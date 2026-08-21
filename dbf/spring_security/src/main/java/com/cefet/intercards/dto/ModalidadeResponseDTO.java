package com.cefet.intercards.dto;

import com.cefet.intercards.entity.Modalidade;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ModalidadeResponseDTO {
	
	private Long id;
    private String descricao;
    private Integer limiteJogadores;
    
    public ModalidadeResponseDTO(Modalidade modalidade) {
    	this.id = modalidade.getId();
        this.descricao = modalidade.getDescricao();
        this.limiteJogadores = modalidade.getLimiteJogadores();
    }  	

}
