package com.sagres.modulo_usuario.infrastructure.persistence;

import com.sagres.modulo_usuario.domain.entity.TokenEmail;
import com.sagres.modulo_usuario.domain.repository.TokenEmailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * Adapter que implementa o contrato de domínio {@link TokenEmailRepository}
 * usando Spring Data JPA.
 */
@Repository
@RequiredArgsConstructor
public class TokenEmailRepositoryAdapter implements TokenEmailRepository {

    private final TokenEmailJpaRepository jpaRepository;

    @Override
    public TokenEmail salvar(TokenEmail token) {
        TokenEmailEntity entity = TokenEmailMapper.toEntity(token);
        TokenEmailEntity salvo  = jpaRepository.save(entity);
        return TokenEmailMapper.toDomain(salvo);
    }

    @Override
    public Optional<TokenEmail> buscarPorToken(UUID token) {
        return jpaRepository.findByToken(token)
                .map(TokenEmailMapper::toDomain);
    }

    @Override
    @Transactional
    public void deletarPorUsuarioId(UUID usuarioId) {
        jpaRepository.deleteByUsuarioId(usuarioId);
    }
}
