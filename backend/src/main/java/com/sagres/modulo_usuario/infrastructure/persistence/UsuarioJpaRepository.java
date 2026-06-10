package com.sagres.modulo_usuario.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repositório Spring Data JPA para {@link UsuarioEntity}.
 * Camada de infraestrutura — não exposto para o domínio diretamente.
 * O adapter {@link UsuarioRepositoryAdapter} implementa o contrato de domínio.
 */
public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, UUID> {

    Optional<UsuarioEntity> findByEmailInstitucional(String emailInstitucional);

    boolean existsByEmailInstitucional(String emailInstitucional);
}
