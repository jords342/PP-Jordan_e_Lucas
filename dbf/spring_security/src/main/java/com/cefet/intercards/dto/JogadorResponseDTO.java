package com.cefet.intercards.dto;

import com.cefet.intercards.entity.Jogador;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JogadorResponseDTO {
	
	private Long id;
    private String nome;
    private Integer numero; 
    private Long equipeId;
    private String urlImagem;
    
    public JogadorResponseDTO(Jogador jogador) {
    	this.id = jogador.getId();
        this.nome = jogador.getNome();
        this.numero = jogador.getNumero();
        this.equipeId = jogador.getEquipe().getId();
        this.urlImagem = jogador.getUrlImagem();
    }  	

}
