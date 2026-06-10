package com.sagres.modulo_usuario.infrastructure.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
    // Habilita o uso de @Async nos beans Spring.
    // O executor padrão do Spring Boot é suficiente para esta fase.
}
