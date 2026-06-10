package com.sagres.modulo_usuario.application.api;

import com.sagres.shared.exception.ConflictException;
import com.sagres.shared.exception.DomainException;
import com.sagres.shared.exception.TokenInvalidoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================================================
    // 400 — DomainException (regras de negócio violadas)
    // =========================================================

    @ExceptionHandler(DomainException.class)
    public ProblemDetail handleDomain(DomainException ex) {
        return problema(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // =========================================================
    // 400 — TokenInvalidoException
    // =========================================================

    @ExceptionHandler(TokenInvalidoException.class)
    public ProblemDetail handleTokenInvalido(TokenInvalidoException ex) {
        return problema(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // =========================================================
    // 400 — Validação de bean (@Valid)
    // =========================================================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "inválido",
                        (a, b) -> a
                ));

        var pd = problema(HttpStatus.BAD_REQUEST, "Dados inválidos.");
        pd.setProperty("erros", erros);
        return pd;
    }

    // =========================================================
    // 401 — BadCredentials / DisabledException (conta não confirmada)
    // =========================================================

    @ExceptionHandler({BadCredentialsException.class, DisabledException.class})
    public ProblemDetail handleAuth(RuntimeException ex) {
        return problema(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos, ou conta não confirmada.");
    }

    // =========================================================
    // 409 — ConflictException
    // =========================================================

    @ExceptionHandler(ConflictException.class)
    public ProblemDetail handleConflict(ConflictException ex) {
        return problema(HttpStatus.CONFLICT, ex.getMessage());
    }

    // =========================================================
    // 500 — Fallback genérico
    // =========================================================

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenerico(Exception ex) {
        return problema(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor.");
    }

    // =========================================================
    // Helper
    // =========================================================

    private ProblemDetail problema(HttpStatus status, String detalhe) {
        var pd = ProblemDetail.forStatusAndDetail(status, detalhe);
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }
}
