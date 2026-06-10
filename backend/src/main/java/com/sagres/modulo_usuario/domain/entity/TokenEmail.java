package com.sagres.modulo_usuario.domain.entity;

import com.sagres.shared.exception.DomainException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Entidade de domínio TokenEmail.
 * <p>
 * Representa um token único enviado ao usuário para confirmação de e-mail
 * ou redefinição de senha. Sem anotações de framework.
 * </p>
 */
public class TokenEmail {

    private static final long EXPIRACAO_HORAS_PADRAO = 24;

    private final UUID id;
    private final UUID usuarioId;
    private final UUID token;
    private final TipoToken tipo;
    private final Instant expiresAt;
    private boolean usado;

    /**
     * Cria um novo token com expiração padrão de 24h.
     */
    public TokenEmail(UUID usuarioId, TipoToken tipo) {
        this.id         = UUID.randomUUID();
        this.usuarioId  = usuarioId;
        this.token      = UUID.randomUUID();
        this.tipo       = tipo;
        this.expiresAt  = Instant.now().plus(EXPIRACAO_HORAS_PADRAO, ChronoUnit.HOURS);
        this.usado      = false;
    }

    /**
     * Reconstitui um token existente (vindo do banco).
     */
    public TokenEmail(UUID id, UUID usuarioId, UUID token, TipoToken tipo,
                      Instant expiresAt, boolean usado) {
        this.id        = id;
        this.usuarioId = usuarioId;
        this.token     = token;
        this.tipo      = tipo;
        this.expiresAt = expiresAt;
        this.usado     = usado;
    }

    // ===== COMPORTAMENTOS DE DOMÍNIO =====

    public void marcarComoUsado() {
        if (this.usado) {
            throw new DomainException("Este token já foi utilizado.");
        }
        if (isExpirado()) {
            throw new DomainException("Token expirado. Solicite um novo.");
        }
        this.usado = true;
    }

    public boolean isExpirado() {
        return Instant.now().isAfter(this.expiresAt);
    }

    public boolean isValido() {
        return !usado && !isExpirado();
    }

    // ===== GETTERS =====

    public UUID getId() { return id; }

    public UUID getUsuarioId() { return usuarioId; }

    public UUID getToken() { return token; }

    public TipoToken getTipo() { return tipo; }

    public Instant getExpiresAt() { return expiresAt; }

    public boolean isUsado() { return usado; }
}
