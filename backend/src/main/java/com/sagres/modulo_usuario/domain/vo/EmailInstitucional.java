package com.sagres.modulo_usuario.domain.vo;

import com.sagres.shared.exception.DomainException;

import java.util.List;
import java.util.Objects;

/**
 * Value Object imutável que representa um e-mail institucional da UFG.
 * <p>
 * Domínios aceitos: @discente.ufg.br (alunos) e @ufg.br (servidores/monitores).
 * Lança {@link DomainException} se o valor for inválido — falha rápida no domínio.
 * </p>
 */
public final class EmailInstitucional {

    private static final List<String> DOMINIOS_VALIDOS = List.of(
            "@discente.ufg.br",
            "@ufg.br"
    );

    private final String valor;

    public EmailInstitucional(String valor) {
        validar(valor);
        this.valor = valor.trim().toLowerCase();
    }

    private void validar(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new DomainException("O e-mail institucional não pode ser vazio.");
        }

        String normalizado = valor.trim().toLowerCase();

        boolean dominioValido = DOMINIOS_VALIDOS.stream()
                .anyMatch(normalizado::endsWith);

        if (!dominioValido) {
            throw new DomainException(
                    "E-mail inválido: apenas endereços @discente.ufg.br ou @ufg.br são aceitos."
            );
        }

        // Validação básica de formato (parte local não vazia)
        int arrobaIndex = normalizado.indexOf('@');
        if (arrobaIndex <= 0) {
            throw new DomainException("Formato de e-mail inválido.");
        }
    }

    public String getValor() {
        return valor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EmailInstitucional)) return false;
        EmailInstitucional other = (EmailInstitucional) o;
        return Objects.equals(valor, other.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
