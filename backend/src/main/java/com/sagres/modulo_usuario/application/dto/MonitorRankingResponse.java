package com.sagres.modulo_usuario.application.dto;

import java.util.UUID;

public record MonitorRankingResponse(
        UUID id,
        String nome,
        double notaMedia,
        int totalAvaliacoes
) {}
