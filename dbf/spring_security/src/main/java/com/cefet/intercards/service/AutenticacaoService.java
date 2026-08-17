package com.cefet.intercards.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.intercards.dto.AutenticacaoRequestDTO;
import com.cefet.intercards.dto.AutenticacaoResponseDTO;
import com.cefet.intercards.entity.Usuario;
import com.cefet.intercards.exception.BusinessException;
import com.cefet.intercards.repository.UsuarioRepository;

@Service
public class AutenticacaoService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public AutenticacaoResponseDTO autenticar(AutenticacaoRequestDTO dto) {

        Usuario usuario = usuarioRepository.findByLoginAndSenha(dto.getLogin(), dto.getSenha());

        if (usuario == null) {
            throw new BusinessException("Login ou senha inválidos.");
        }

        return new AutenticacaoResponseDTO(usuario);
    }
}