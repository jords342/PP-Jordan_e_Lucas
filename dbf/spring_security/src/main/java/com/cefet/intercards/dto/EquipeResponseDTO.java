package com.cefet.intercards.dto;

import com.cefet.intercards.entity.Equipe;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EquipeResponseDTO {
	
	private Long id;
    private String nome;
    private Long modalidadeId;
    private Long usuarioId; 
    
    public EquipeResponseDTO(Equipe equipe) {
    	this.id = equipe.getId();
        this.nome = equipe.getNome();
        this.modalidadeId = equipe.getModalidade().getId();
        this.usuarioId = equipe.getUsuario().getId();
    }  	

}
