package com.cefet.intercards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JogadorRequestDTO {

    @NotBlank(message = "O campo nome é obrigatório")
    private String nome;
    
    @NotNull(message = "O campo numero é obrigatório")
    private Integer numero; 
    
    @NotNull(message = "O campo equipeId é obrigatório")
    private Long equipeId; 
    
    @NotBlank(message = "O campo urlImagem é obrigatório")
    private String urlImagem;

}