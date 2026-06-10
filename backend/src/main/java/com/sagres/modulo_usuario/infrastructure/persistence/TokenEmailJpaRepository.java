package com.sagres.modulo_usuario.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repositório Spring Data JPA para {@link TokenEmailEntity}.
 */
public interface TokenEmailJpaRepository extends JpaRepository<TokenEmailEntity, UUID> {

    Optional<TokenEmailEntity> findByToken(UUID token);

    void deleteByUsuarioId(UUID usuarioId);
}
