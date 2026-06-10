package com.sagres.modulo_usuario.infrastructure.persistence;

import com.sagres.modulo_usuario.domain.entity.TokenEmail;

/**
 * Mapper entre {@link TokenEmail} (domínio) e {@link TokenEmailEntity} (JPA).
 */
public class TokenEmailMapper {

    private TokenEmailMapper() {}

    public static TokenEmail toDomain(TokenEmailEntity entity) {
        return new TokenEmail(
                entity.getId(),
                entity.getUsuarioId(),
                entity.getToken(),
                entity.getTipo(),
                entity.getExpiresAt(),
                entity.isUsado()
        );
    }

    public static TokenEmailEntity toEntity(TokenEmail domain) {
        return TokenEmailEntity.builder()
                .id(domain.getId())
                .usuarioId(domain.getUsuarioId())
                .token(domain.getToken())
                .tipo(domain.getTipo())
                .expiresAt(domain.getExpiresAt())
                .usado(domain.isUsado())
                .build();
    }
}
