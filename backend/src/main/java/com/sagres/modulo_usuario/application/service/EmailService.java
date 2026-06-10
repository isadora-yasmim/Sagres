package com.sagres.modulo_usuario.application.service;

import com.sagres.modulo_usuario.domain.entity.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${sagres.frontend-url}")
    private String frontendUrl;

    private static final String REMETENTE = "noreply@sagres.ufg.br";

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envia e-mail de confirmação de cadastro com link de ativação.
     *
     * @param usuario usuário recém-cadastrado
     * @param token   UUID do token de confirmação
     */
    @Async
    public void enviarConfirmacaoEmail(Usuario usuario, String token) {
        String link = frontendUrl + "/confirmar-email?token=" + token;

        String corpo = """
                Olá, %s!
                
                Seja bem-vindo(a) ao SAGRES Monitoria.
                
                Para ativar sua conta, clique no link abaixo (válido por 24 horas):
                %s
                
                Se você não criou uma conta no SAGRES, ignore este e-mail.
                
                Atenciosamente,
                Equipe SAGRES — UFG
                """.formatted(usuario.getNomeCompleto(), link);

        String email = usuario.getEmailInstitucional().getValor();
        enviar(email, "SAGRES — Confirme seu e-mail", corpo);
        log.info("E-mail de confirmação enviado para {}", email);
    }

    /**
     * Envia e-mail com link para redefinição de senha.
     *
     * @param email e-mail do usuário solicitante
     * @param token UUID do token de redefinição
     */
    @Async
    public void enviarRedefinicaoSenha(String email, String token) {
        String link = frontendUrl + "/redefinir-senha?token=" + token;

        String corpo = """
                Olá!
                
                Recebemos uma solicitação para redefinir a senha da sua conta no SAGRES.
                
                Clique no link abaixo para criar uma nova senha (válido por 1 hora):
                %s
                
                Se você não solicitou a redefinição de senha, ignore este e-mail.
                Sua senha permanecerá a mesma.
                
                Atenciosamente,
                Equipe SAGRES — UFG
                """.formatted(link);

        enviar(email, "SAGRES — Redefinição de senha", corpo);
        log.info("E-mail de redefinição enviado para {}", email);
    }

    // =========================================================
    // Método auxiliar interno
    // =========================================================

    private void enviar(String destinatario, String assunto, String corpo) {
        try {
            var mensagem = new SimpleMailMessage();
            mensagem.setFrom(REMETENTE);
            mensagem.setTo(destinatario);
            mensagem.setSubject(assunto);
            mensagem.setText(corpo);
            mailSender.send(mensagem);
        } catch (Exception ex) {
            log.error("Falha ao enviar e-mail para {}: {}", destinatario, ex.getMessage());
        }
    }
}
