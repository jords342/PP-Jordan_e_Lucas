package com.cefet.intercards.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.intercards.entity.Equipe;

public interface EquipeRepository extends JpaRepository<Equipe, Long>{
	
	boolean existsByNome(String nome);
	
	boolean existsByNomeAndIdNot(String nome, Long id);	
	
	List<Equipe> findByModalidadeId(Long modalidadeId);
}