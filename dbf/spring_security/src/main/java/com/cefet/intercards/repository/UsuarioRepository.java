package com.cefet.intercards.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.intercards.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{	
	
	boolean existsByLogin(String login);
	boolean existsByLoginAndIdNot(String login, Long id);
	
	Usuario findByLoginAndSenha(String login, String senha);	
}