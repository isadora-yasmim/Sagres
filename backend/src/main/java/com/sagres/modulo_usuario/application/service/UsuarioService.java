package com.sagres.modulo_usuario.application.service;

import com.sagres.modulo_usuario.application.dto.*;
import com.sagres.shared.exception.ConflictException;
import com.sagres.shared.exception.DomainException;
import com.sagres.shared.exception.TokenInvalidoException;
import com.sagres.modulo_usuario.domain.entity.RoleUsuario;
import com.sagres.modulo_usuario.domain.entity.TipoToken;
import com.sagres.modulo_usuario.domain.entity.TokenEmail;
import com.sagres.modulo_usuario.domain.entity.Usuario;
import com.sagres.modulo_usuario.domain.vo.EmailInstitucional;
import com.sagres.modulo_usuario.domain.repository.TokenEmailRepository;
import com.sagres.modulo_usuario.domain.repository.UsuarioRepository;
import com.sagres.modulo_usuario.infrastructure.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final TokenEmailRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            TokenEmailRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public MensagemResponse cadastrar(CadastrarRequest request) {
        var emailVO = new EmailInstitucional(request.email());

        if (usuarioRepository.existePorEmail(emailVO.getValor())) {
            throw new ConflictException("E-mail já cadastrado.");
        }

        var usuario = new Usuario(
                request.nome().trim(),
                emailVO.getValor(),
                passwordEncoder.encode(request.senha()),
                RoleUsuario.ALUNO
        );
        usuarioRepository.salvar(usuario);

        var token = new TokenEmail(usuario.getId(), TipoToken.CONFIRMAR_EMAIL);
        tokenRepository.salvar(token);
        emailService.enviarConfirmacaoEmail(usuario, token.getToken().toString());

        return MensagemResponse.de("Cadastro realizado. Verifique seu e-mail para ativar sua conta.");
    }

    public MensagemResponse confirmarEmail(String tokenStr) {
        var tokenEntidade = tokenRepository.buscarPorToken(UUID.fromString(tokenStr))
                .orElseThrow(() -> new TokenInvalidoException("Token de confirmação inválido."));

        if (tokenEntidade.getTipo() != TipoToken.CONFIRMAR_EMAIL) {
            throw new TokenInvalidoException("Token de tipo incorreto.");
        }

        if (!tokenEntidade.isValido()) {
            throw new TokenInvalidoException("Token expirado ou já utilizado.");
        }

        var usuario = usuarioRepository.buscarPorId(tokenEntidade.getUsuarioId())
                .orElseThrow(() -> new DomainException("Usuário não encontrado."));
        usuario.confirmarEmail();
        tokenEntidade.marcarComoUsado();

        usuarioRepository.salvar(usuario);
        tokenRepository.salvar(tokenEntidade);

        return MensagemResponse.de("E-mail confirmado com sucesso. Você já pode fazer login.");
    }

    public MensagemResponse reenviarConfirmacao(ReenviarConfirmacaoRequest request) {
        var usuario = usuarioRepository.buscarPorEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new DomainException("Usuário não encontrado."));

        if (usuario.isEmailConfirmado()) {
            throw new DomainException("E-mail já confirmado.");
        }

        tokenRepository.deletarPorUsuarioId(usuario.getId());

        var novoToken = new TokenEmail(usuario.getId(), TipoToken.CONFIRMAR_EMAIL);
        tokenRepository.salvar(novoToken);
        emailService.enviarConfirmacaoEmail(usuario, novoToken.getToken().toString());

        return MensagemResponse.de("E-mail de confirmação reenviado.");
    }

    public TokenResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email().toLowerCase().trim(),
                            request.senha()
                    )
            );
        } catch (AuthenticationException ex) {
            throw new BadCredentialsException("E-mail ou senha inválidos, ou conta não confirmada.");
        }

        var usuario = usuarioRepository.buscarPorEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new DomainException("Usuário não encontrado."));

        String email = usuario.getEmailInstitucional().getValor();
        String jwt = jwtService.gerarToken(email, usuario.getRole());
        return TokenResponse.bearer(jwt, email, usuario.getRole().name());
    }

    public MensagemResponse esqueciSenha(EsqueciSenhaRequest request) {
        var emailNormalizado = request.email().toLowerCase().trim();

        usuarioRepository.buscarPorEmail(emailNormalizado).ifPresent(usuario -> {
            tokenRepository.deletarPorUsuarioId(usuario.getId());

            var token = new TokenEmail(usuario.getId(), TipoToken.REDEFINIR_SENHA);
            tokenRepository.salvar(token);
            emailService.enviarRedefinicaoSenha(emailNormalizado, token.getToken().toString());
        });

        return MensagemResponse.de("Se este e-mail estiver cadastrado, você receberá as instruções em breve.");
    }

    public MensagemResponse redefinirSenha(RedefinirSenhaRequest request) {
        var tokenEntidade = tokenRepository.buscarPorToken(UUID.fromString(request.token()))
                .orElseThrow(() -> new TokenInvalidoException("Token de redefinição inválido."));

        if (tokenEntidade.getTipo() != TipoToken.REDEFINIR_SENHA) {
            throw new TokenInvalidoException("Token de tipo incorreto.");
        }

        if (!tokenEntidade.isValido()) {
            throw new TokenInvalidoException("Token expirado ou já utilizado.");
        }

        var usuario = usuarioRepository.buscarPorId(tokenEntidade.getUsuarioId())
                .orElseThrow(() -> new DomainException("Usuário não encontrado."));
        usuario.alterarSenha(passwordEncoder.encode(request.novaSenha()));
        tokenEntidade.marcarComoUsado();

        usuarioRepository.salvar(usuario);
        tokenRepository.salvar(tokenEntidade);

        return MensagemResponse.de("Senha redefinida com sucesso.");
    }

    @Transactional(readOnly = true)
    public List<MonitorRankingResponse> rankingSemana() {
        return usuarioRepository.buscarTop5Monitores().stream()
                .map(u -> new MonitorRankingResponse(
                        u.getId(),
                        u.getNomeCompleto(),
                        0.0,
                        0
                ))
                .toList();
    }
}
