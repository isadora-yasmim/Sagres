package com.sagres.modulo_usuario.application.api;

import com.sagres.modulo_usuario.application.dto.MonitorRankingResponse;
import com.sagres.modulo_usuario.application.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicoController {

    private final UsuarioService usuarioService;

    public PublicoController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * GET /api/public/ranking-semana
     * Retorna os top 5 monitores — acesso público, sem autenticação.
     */
    @GetMapping("/ranking-semana")
    public ResponseEntity<List<MonitorRankingResponse>> rankingSemana() {
        return ResponseEntity.ok(usuarioService.rankingSemana());
    }
}
