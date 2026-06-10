package com.sagres.modulo_usuario.infrastructure.persistence;

import com.sagres.modulo_usuario.domain.entity.Usuario;

/**
 * Mapper entre a entidade de domínio {@link Usuario} e a entidade JPA {@link UsuarioEntity}.
 * Mantém as duas camadas totalmente desacopladas.
 */
public class UsuarioMapper {

    private UsuarioMapper() {}

    public static Usuario toDomain(UsuarioEntity entity) {
        return new Usuario(
                entity.getId(),
                entity.getNomeCompleto(),
                entity.getEmailInstitucional(),
                entity.getSenhaHash(),
                entity.isEmailConfirmado(),
                entity.getRole(),
                entity.getDataCadastro()
        );
    }

    public static UsuarioEntity toEntity(Usuario domain) {
        return UsuarioEntity.builder()
                .id(domain.getId())
                .nomeCompleto(domain.getNomeCompleto())
                .emailInstitucional(domain.getEmailInstitucional().getValor())
                .senhaHash(domain.getSenhaHash())
                .emailConfirmado(domain.isEmailConfirmado())
                .role(domain.getRole())
                .dataCadastro(domain.getDataCadastro())
                .build();
    }
}
