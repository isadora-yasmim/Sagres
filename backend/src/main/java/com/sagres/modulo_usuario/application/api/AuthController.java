package com.sagres.modulo_usuario.application.api;

import com.sagres.modulo_usuario.application.dto.*;
import com.sagres.modulo_usuario.application.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * POST /api/auth/cadastrar
     * Registra um novo usuário (aluno por padrão).
     */
    @PostMapping("/cadastrar")
    public ResponseEntity<MensagemResponse> cadastrar(@Valid @RequestBody CadastrarRequest request) {
        var resposta = usuarioService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    /**
     * POST /api/auth/login
     * Autentica e retorna JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(usuarioService.login(request));
    }

    /**
     * GET /api/auth/confirmar-email?token=UUID
     * Confirma o e-mail do usuário via link recebido no e-mail.
     */
    @GetMapping("/confirmar-email")
    public ResponseEntity<MensagemResponse> confirmarEmail(@RequestParam String token) {
        return ResponseEntity.ok(usuarioService.confirmarEmail(token));
    }

    /**
     * POST /api/auth/reenviar-confirmacao
     * Reenvia o e-mail de confirmação.
     */
    @PostMapping("/reenviar-confirmacao")
    public ResponseEntity<MensagemResponse> reenviarConfirmacao(
            @Valid @RequestBody ReenviarConfirmacaoRequest request) {
        return ResponseEntity.ok(usuarioService.reenviarConfirmacao(request));
    }

    /**
     * POST /api/auth/esqueci-senha
     * Inicia o fluxo de recuperação de senha.
     */
    @PostMapping("/esqueci-senha")
    public ResponseEntity<MensagemResponse> esqueciSenha(
            @Valid @RequestBody EsqueciSenhaRequest request) {
        return ResponseEntity.ok(usuarioService.esqueciSenha(request));
    }

    /**
     * POST /api/auth/redefinir-senha
     * Redefine a senha usando o token recebido por e-mail.
     */
    @PostMapping("/redefinir-senha")
    public ResponseEntity<MensagemResponse> redefinirSenha(
            @Valid @RequestBody RedefinirSenhaRequest request) {
        return ResponseEntity.ok(usuarioService.redefinirSenha(request));
    }
}
