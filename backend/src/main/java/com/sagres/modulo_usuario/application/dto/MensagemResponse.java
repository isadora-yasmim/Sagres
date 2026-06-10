package com.sagres.modulo_usuario.application.dto;

public record MensagemResponse(String mensagem) {

    public static MensagemResponse de(String mensagem) {
        return new MensagemResponse(mensagem);
    }
}
