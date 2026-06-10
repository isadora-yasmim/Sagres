package com.sagres.modulo_usuario.application.dto;

import jakarta.validation.constraints.NotBlank;

public record ReenviarConfirmacaoRequest(

        @NotBlank(message = "E-mail é obrigatório.")
        String email
) {}
