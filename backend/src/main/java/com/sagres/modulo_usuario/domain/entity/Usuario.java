package com.sagres.modulo_usuario.domain.entity;

import com.sagres.modulo_usuario.domain.vo.EmailInstitucional;
import com.sagres.shared.exception.DomainException;

import java.time.Instant;
import java.util.UUID;

/**
 * Entidade de domínio Usuario.
 * <p>
 * Representa um usuário da plataforma SAGRES (aluno ou monitor).
 * Esta classe pertence à camada de domínio — sem anotações JPA ou Spring.
 * A persistência é responsabilidade da camada de infraestrutura.
 * </p>
 */
public class Usuario {

    private final UUID id;
    private String nomeCompleto;
    private final EmailInstitucional emailInstitucional;
    private String senhaHash;
    private boolean emailConfirmado;
    private RoleUsuario role;
    private final Instant dataCadastro;

    /**
     * Cria um novo usuário. Usado na criação (cadastro).
     */
    public Usuario(String nomeCompleto,
                   String emailInstitucional,
                   String senhaHash,
                   RoleUsuario role) {
        validarNome(nomeCompleto);
        this.id                 = UUID.randomUUID();
        this.nomeCompleto       = nomeCompleto.trim();
        this.emailInstitucional = new EmailInstitucional(emailInstitucional);
        this.senhaHash          = senhaHash;
        this.emailConfirmado    = false;
        this.role               = role;
        this.dataCadastro       = Instant.now();
    }

    /**
     * Reconstitui um usuário já existente (vindo do banco via infraestrutura).
     */
    public Usuario(UUID id,
                   String nomeCompleto,
                   String emailInstitucional,
                   String senhaHash,
                   boolean emailConfirmado,
                   RoleUsuario role,
                   Instant dataCadastro) {
        this.id                 = id;
        this.nomeCompleto       = nomeCompleto;
        this.emailInstitucional = new EmailInstitucional(emailInstitucional);
        this.senhaHash          = senhaHash;
        this.emailConfirmado    = emailConfirmado;
        this.role               = role;
        this.dataCadastro       = dataCadastro;
    }

    // ===== COMPORTAMENTOS DE DOMÍNIO =====

    public void confirmarEmail() {
        if (this.emailConfirmado) {
            throw new DomainException("O e-mail já foi confirmado anteriormente.");
        }
        this.emailConfirmado = true;
    }

    public void alterarSenha(String novaSenhaHash) {
        if (novaSenhaHash == null || novaSenhaHash.isBlank()) {
            throw new DomainException("A nova senha não pode ser vazia.");
        }
        this.senhaHash = novaSenhaHash;
    }

    public void tornarMonitor() {
        this.role = RoleUsuario.MONITOR;
    }

    // ===== VALIDAÇÕES INTERNAS =====

    private void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new DomainException("O nome completo não pode ser vazio.");
        }
        if (nome.trim().length() < 3) {
            throw new DomainException("O nome completo deve ter ao menos 3 caracteres.");
        }
    }

    // ===== GETTERS =====

    public UUID getId() {
        return id;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public EmailInstitucional getEmailInstitucional() {
        return emailInstitucional;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public boolean isEmailConfirmado() {
        return emailConfirmado;
    }

    public RoleUsuario getRole() {
        return role;
    }

    public Instant getDataCadastro() {
        return dataCadastro;
    }
}
