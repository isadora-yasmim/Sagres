package com.sagres.modulo_usuario.infrastructure.persistence;

import com.sagres.modulo_usuario.domain.entity.RoleUsuario;
import com.sagres.modulo_usuario.domain.entity.Usuario;
import com.sagres.modulo_usuario.domain.repository.UsuarioRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Adapter que implementa o contrato de domínio {@link UsuarioRepository}
 * usando Spring Data JPA ({@link UsuarioJpaRepository}).
 * <p>
 * O domínio nunca conhece esta implementação — ele depende apenas da interface.
 * </p>
 */
@Repository
public class UsuarioRepositoryAdapter implements UsuarioRepository {

    private final UsuarioJpaRepository jpaRepository;

    public UsuarioRepositoryAdapter(UsuarioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Usuario salvar(Usuario usuario) {
        UsuarioEntity entity = UsuarioMapper.toEntity(usuario);
        UsuarioEntity salvo  = jpaRepository.save(entity);
        return UsuarioMapper.toDomain(salvo);
    }

    @Override
    public Optional<Usuario> buscarPorId(UUID id) {
        return jpaRepository.findById(id)
                .map(UsuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String emailInstitucional) {
        return jpaRepository.findByEmailInstitucional(emailInstitucional)
                .map(UsuarioMapper::toDomain);
    }

    @Override
    public boolean existePorEmail(String emailInstitucional) {
        return jpaRepository.existsByEmailInstitucional(emailInstitucional);
    }

    @Override
    public List<Usuario> buscarTop5Monitores() {
        List<UsuarioEntity> entities = jpaRepository.findTop5ByRole(RoleUsuario.MONITOR);
        return entities.stream()
                .map(e -> UsuarioMapper.toDomain(e))
                .toList();
    }
}
