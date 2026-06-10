package com.sagres.modulo_usuario.infrastructure.persistence;

import com.sagres.modulo_usuario.domain.entity.RoleUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
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

    @Query("SELECT u FROM UsuarioEntity u WHERE u.role = :role ORDER BY u.nomeCompleto ASC LIMIT 5")
    List<UsuarioEntity> findTop5ByRole(@Param("role") RoleUsuario role);
}
