package com.sagres.modulo_usuario.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RedefinirSenhaRequest(

        @NotBlank(message = "Token é obrigatório.")
        String token,

        @NotBlank(message = "Nova senha é obrigatória.")
        @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres.")
        String novaSenha
) {}
