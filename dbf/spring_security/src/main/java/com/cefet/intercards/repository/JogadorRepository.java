package com.cefet.intercards.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.intercards.entity.Jogador;

public interface JogadorRepository extends JpaRepository<Jogador, Long>{	
	
	Integer countByEquipeId(Long equipeId);
	List<Jogador> findByEquipeId(Long equipeId);
}