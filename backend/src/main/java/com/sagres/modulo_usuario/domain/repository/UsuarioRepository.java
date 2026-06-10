package com.sagres.modulo_usuario.domain.repository;

import com.sagres.modulo_usuario.domain.entity.Usuario;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Contrato de repositório para a entidade de domínio {@link Usuario}.
 * <p>
 * Esta interface pertence à camada de domínio — sem dependências de JPA ou Spring.
 * A implementação concreta fica em {@code infrastructure.persistence}.
 * </p>
 */
public interface UsuarioRepository {

    Usuario salvar(Usuario usuario);

    Optional<Usuario> buscarPorId(UUID id);

    Optional<Usuario> buscarPorEmail(String emailInstitucional);

    boolean existePorEmail(String emailInstitucional);

    List<Usuario> buscarTop5Monitores();
}
