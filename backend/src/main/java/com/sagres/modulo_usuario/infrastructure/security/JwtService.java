package com.sagres.modulo_usuario.infrastructure.security;

import com.sagres.modulo_usuario.domain.entity.RoleUsuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final String CLAIM_ROLE = "role";

    private final SecretKey chave;
    private final long expiracaoMs;

    public JwtService(
            @Value("${sagres.jwt.secret}") String secret,
            @Value("${sagres.jwt.expiration-ms}") long expiracaoMs
    ) {
        this.chave = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiracaoMs = expiracaoMs;
    }

    /**
     * Gera um JWT contendo o e-mail como subject e a role como claim adicional.
     */
    public String gerarToken(String email, RoleUsuario role) {
        long agora = System.currentTimeMillis();
        return Jwts.builder()
                .subject(email)
                .claim(CLAIM_ROLE, role.name())
                .issuedAt(new Date(agora))
                .expiration(new Date(agora + expiracaoMs))
                .signWith(chave)
                .compact();
    }

    /**
     * Extrai o e-mail (subject) do token. Lança JwtException se inválido.
     */
    public String extrairEmail(String token) {
        return parsearClaims(token).getSubject();
    }

    /**
     * Extrai a role do token.
     */
    public RoleUsuario extrairRole(String token) {
        String roleStr = parsearClaims(token).get(CLAIM_ROLE, String.class);
        return RoleUsuario.valueOf(roleStr);
    }

    /**
     * Valida assinatura e expiração. Retorna false em qualquer problema.
     */
    public boolean validarToken(String token) {
        try {
            parsearClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("Token JWT inválido: {}", ex.getMessage());
            return false;
        }
    }

    // =========================================================

    private Claims parsearClaims(String token) {
        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
