package com.sagres.modulo_usuario.infrastructure.security;

import com.sagres.modulo_usuario.infrastructure.persistence.UsuarioEntity;
import com.sagres.modulo_usuario.infrastructure.persistence.UsuarioJpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioJpaRepository usuarioJpaRepository;

    public UsuarioDetailsService(UsuarioJpaRepository usuarioJpaRepository) {
        this.usuarioJpaRepository = usuarioJpaRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UsuarioEntity entity = usuarioJpaRepository.findByEmailInstitucional(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuário não encontrado: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(entity.getEmailInstitucional())
                .password(entity.getSenhaHash())
                .roles(entity.getRole().name())
                .disabled(!entity.isEmailConfirmado())
                .build();
    }
}
