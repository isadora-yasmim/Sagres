package com.sagres.modulo_usuario.domain.repository;

import com.sagres.modulo_usuario.domain.entity.TokenEmail;

import java.util.Optional;
import java.util.UUID;

/**
 * Contrato de repositório para {@link TokenEmail}.
 * Camada de domínio — sem dependências de JPA ou Spring.
 */
public interface TokenEmailRepository {

    TokenEmail salvar(TokenEmail token);

    Optional<TokenEmail> buscarPorToken(UUID token);

    void deletarPorUsuarioId(UUID usuarioId);
}
