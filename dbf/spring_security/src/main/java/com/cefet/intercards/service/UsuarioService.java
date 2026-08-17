package com.cefet.intercards.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.intercards.dto.UsuarioRequestDTO;
import com.cefet.intercards.dto.UsuarioResponseDTO;
import com.cefet.intercards.dto.UsuarioSenhaRequestDTO;
import com.cefet.intercards.entity.Usuario;
import com.cefet.intercards.exception.BusinessException;
import com.cefet.intercards.exception.ResourceNotFoundException;
import com.cefet.intercards.repository.UsuarioRepository;


@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listar() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream().map(UsuarioResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado. Id: " + id));

        return new UsuarioResponseDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO inserir(UsuarioRequestDTO dto) {

        if (usuarioRepository.existsByLogin(dto.getLogin())) {
            throw new BusinessException("Já existe um usuário com esse login.");
        }

        Usuario usuario = new Usuario();
        usuario.setLogin(dto.getLogin());
        usuario.setSenha(dto.getSenha());
        usuario.setPerfil(dto.getPerfil());

        return new UsuarioResponseDTO(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponseDTO atualizar(Long id, UsuarioSenhaRequestDTO dto) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuário não encontrado. Id: " + id));

        usuario.setSenha(dto.getSenha());

        return new UsuarioResponseDTO(usuarioRepository.save(usuario));
    }   


    @Transactional
    public void excluir(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado com ID: " + id);
        }

        usuarioRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public Boolean existeLogin(String login) {
        return usuarioRepository.existsByLogin(login);
    }    
}
