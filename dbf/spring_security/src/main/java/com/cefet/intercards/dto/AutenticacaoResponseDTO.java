package com.cefet.intercards.dto;

import com.cefet.intercards.entity.Perfil;
import com.cefet.intercards.entity.Usuario;

import lombok.Getter;

@Getter
public class AutenticacaoResponseDTO {

    private Long id;
    private String login;
    private Perfil perfil;

    public AutenticacaoResponseDTO(Usuario usuario) {
        id = usuario.getId();
        login = usuario.getLogin();
        perfil = usuario.getPerfil();
    }
}