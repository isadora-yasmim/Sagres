package com.sagres.shared.exception;

/**
 * Exceção base para violações de regras de negócio do domínio.
 * Não carrega dependências de framework — camada de domínio é pura.
 */
public class DomainException extends RuntimeException {

    public DomainException(String message) {
        super(message);
    }

    public DomainException(String message, Throwable cause) {
        super(message, cause);
    }
}
