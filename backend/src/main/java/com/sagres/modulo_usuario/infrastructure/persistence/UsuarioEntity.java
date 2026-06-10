package com.sagres.modulo_usuario.infrastructure.persistence;

import com.sagres.modulo_usuario.domain.entity.RoleUsuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Entidade JPA para persistência do usuário.
 * <p>
 * Pertence à camada de infraestrutura. Não deve vazar para o domínio ou a API.
 * A conversão entre {@link com.sagres.modulo_usuario.domain.entity.Usuario} e
 * esta entidade é responsabilidade do mapper na camada de infraestrutura.
 * </p>
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "nome_completo", nullable = false, length = 150)
    private String nomeCompleto;

    @Column(name = "email_institucional", nullable = false, unique = true, length = 100)
    private String emailInstitucional;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Column(name = "email_confirmado", nullable = false)
    private boolean emailConfirmado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoleUsuario role;

    @CreationTimestamp
    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private Instant dataCadastro;
}
