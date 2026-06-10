package com.sagres.modulo_usuario.application.service;

import com.sagres.modulo_usuario.application.dto.*;
import com.sagres.shared.exception.ConflictException;
import com.sagres.shared.exception.DomainException;
import com.sagres.shared.exception.TokenInvalidoException;
import com.sagres.modulo_usuario.domain.entity.RoleUsuario;
import com.sagres.modulo_usuario.domain.entity.TipoToken;
import com.sagres.modulo_usuario.domain.entity.TokenEmail;
import com.sagres.modulo_usuario.domain.entity.Usuario;
import com.sagres.modulo_usuario.domain.repository.TokenEmailRepository;
import com.sagres.modulo_usuario.domain.repository.UsuarioRepository;
import com.sagres.modulo_usuario.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    @InjectMocks
    private UsuarioService usuarioService;

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private TokenEmailRepository tokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private EmailService emailService;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ──────────────────────────────────────────────────────────
    // Cadastrar
    // ──────────────────────────────────────────────────────────

    @Test
    void cadastrar_deveRetornarSucesso_quandoDadosValidos() {
        var req = new CadastrarRequest("Maria Silva", "maria@discente.ufg.br", "Senha@123");

        when(usuarioRepository.existePorEmail("maria@discente.ufg.br")).thenReturn(false);
        when(passwordEncoder.encode("Senha@123")).thenReturn("$hash");
        when(usuarioRepository.salvar(any())).thenAnswer(inv -> inv.getArgument(0));
        when(tokenRepository.salvar(any())).thenAnswer(inv -> inv.getArgument(0));

        var resposta = usuarioService.cadastrar(req);

        assertThat(resposta.mensagem()).contains("Verifique seu e-mail");
        verify(emailService).enviarConfirmacaoEmail(any(), anyString());
    }

    @Test
    void cadastrar_deveLancarConflict_quandoEmailJaCadastrado() {
        when(usuarioRepository.existePorEmail(anyString())).thenReturn(true);

        assertThatThrownBy(() ->
                usuarioService.cadastrar(
                        new CadastrarRequest("Fulano", "fulano@discente.ufg.br", "Senha@123")))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("E-mail já cadastrado");
    }

    @Test
    void cadastrar_deveLancarDomain_quandoEmailNaoInstitucional() {
        assertThatThrownBy(() ->
                usuarioService.cadastrar(
                        new CadastrarRequest("Fulano", "fulano@gmail.com", "Senha@123")))
                .isInstanceOf(DomainException.class);
    }

    // ──────────────────────────────────────────────────────────
    // Confirmar e-mail
    // ──────────────────────────────────────────────────────────

    @Test
    void confirmarEmail_deveAtivarConta_quandoTokenValido() {
        var usuario = usuarioComEmailNaoConfirmado();
        var token = new TokenEmail(usuario.getId(), TipoToken.CONFIRMAR_EMAIL);

        when(tokenRepository.buscarPorToken(token.getToken())).thenReturn(Optional.of(token));
        when(usuarioRepository.buscarPorId(usuario.getId())).thenReturn(Optional.of(usuario));
        when(usuarioRepository.salvar(any())).thenAnswer(inv -> inv.getArgument(0));
        when(tokenRepository.salvar(any())).thenAnswer(inv -> inv.getArgument(0));

        var resposta = usuarioService.confirmarEmail(token.getToken().toString());

        assertThat(resposta.mensagem()).contains("confirmado");
        assertThat(usuario.isEmailConfirmado()).isTrue();
    }

    @Test
    void confirmarEmail_deveLancarToken_quandoExpirado() {
        var usuario = usuarioComEmailNaoConfirmado();
        var token = tokenConfirmacaoExpirado(usuario);

        when(tokenRepository.buscarPorToken(token.getToken())).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> usuarioService.confirmarEmail(token.getToken().toString()))
                .isInstanceOf(TokenInvalidoException.class);
    }

    // ──────────────────────────────────────────────────────────
    // Esqueci senha — não revela e-mail
    // ──────────────────────────────────────────────────────────

    @Test
    void esqueciSenha_deveRetornar200_mesmoQuandoEmailNaoExiste() {
        when(usuarioRepository.buscarPorEmail(anyString())).thenReturn(Optional.empty());

        var resposta = usuarioService.esqueciSenha(new EsqueciSenhaRequest("nao@discente.ufg.br"));

        assertThat(resposta.mensagem()).contains("Se este e-mail");
        verifyNoInteractions(emailService);
    }

    // ──────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────

    private Usuario usuarioComEmailNaoConfirmado() {
        return new Usuario("Teste", "test@discente.ufg.br", "$hash", RoleUsuario.ALUNO);
    }

    private TokenEmail tokenConfirmacaoExpirado(Usuario usuario) {
        var t = new TokenEmail(usuario.getId(), TipoToken.CONFIRMAR_EMAIL);
        try {
            var campo = TokenEmail.class.getDeclaredField("expiresAt");
            campo.setAccessible(true);
            campo.set(t, Instant.now().minusSeconds(3600));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return t;
    }
}
