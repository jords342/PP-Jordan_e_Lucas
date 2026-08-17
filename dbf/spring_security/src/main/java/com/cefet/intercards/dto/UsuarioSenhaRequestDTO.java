package com.cefet.intercards.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UsuarioSenhaRequestDTO {

    @NotBlank(message = "O campo senha é obrigatório")
    private String senha;
}