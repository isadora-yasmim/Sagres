package com.sagres.modulo_usuario.domain.vo;

import com.sagres.shared.exception.DomainException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.*;

class EmailInstitucionalTest {

    @ParameterizedTest
    @ValueSource(strings = {
            "aluno@discente.ufg.br",
            "professor@ufg.br",
            "dev@inf.ufg.br",
            "eng@eee.ufg.br"
    })
    void deveAceitarDominiosValidos(String email) {
        assertThatNoException().isThrownBy(() -> new EmailInstitucional(email));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "aluno@gmail.com",
            "aluno@hotmail.com",
            "aluno@ufg.com",
            "aluno@ufg.edu.br",
            ""
    })
    void deveRejeitarDominiosInvalidos(String email) {
        assertThatThrownBy(() -> new EmailInstitucional(email))
                .isInstanceOf(DomainException.class);
    }

    @Test
    void deveNormalizarEmailParaMinusculas() {
        var vo = new EmailInstitucional("ALUNO@Discente.UFG.BR");
        assertThat(vo.getValor()).isEqualTo("aluno@discente.ufg.br");
    }

    @Test
    void deveRejeitarEmailNulo() {
        assertThatThrownBy(() -> new EmailInstitucional(null))
                .isInstanceOf(DomainException.class);
    }
}
