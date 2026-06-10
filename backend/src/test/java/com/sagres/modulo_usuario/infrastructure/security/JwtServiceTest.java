package com.sagres.modulo_usuario.infrastructure.security;

import com.sagres.modulo_usuario.domain.entity.RoleUsuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    // Chave de 64+ caracteres UTF-8 → 512 bits → compatível com HS512
    private static final String SECRET =
            "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final long EXPIRACAO_MS = 3_600_000L; // 1h

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, EXPIRACAO_MS);
    }

    @Test
    void deveGerarTokenValido() {
        String token = jwtService.gerarToken("aluno@discente.ufg.br", RoleUsuario.ALUNO);
        assertThat(token).isNotBlank();
        assertThat(jwtService.validarToken(token)).isTrue();
    }

    @Test
    void deveExtrairEmailCorreto() {
        String email = "aluno@discente.ufg.br";
        String token = jwtService.gerarToken(email, RoleUsuario.ALUNO);
        assertThat(jwtService.extrairEmail(token)).isEqualTo(email);
    }

    @Test
    void deveExtrairRoleCorreta() {
        String token = jwtService.gerarToken("monitor@ufg.br", RoleUsuario.MONITOR);
        assertThat(jwtService.extrairRole(token)).isEqualTo(RoleUsuario.MONITOR);
    }

    @Test
    void deveRejeitarTokenInvalido() {
        assertThat(jwtService.validarToken("token.invalido.aqui")).isFalse();
    }

    @Test
    void deveRejeitarTokenVazio() {
        assertThat(jwtService.validarToken("")).isFalse();
    }

    @Test
    void deveRejeitarTokenExpirado() throws InterruptedException {
        // Cria JwtService com expiração de 1ms
        var serviceExpiradoRapido = new JwtService(SECRET, 1L);
        String token = serviceExpiradoRapido.gerarToken("aluno@discente.ufg.br", RoleUsuario.ALUNO);

        Thread.sleep(50); // garante expiração

        assertThat(serviceExpiradoRapido.validarToken(token)).isFalse();
    }
}
