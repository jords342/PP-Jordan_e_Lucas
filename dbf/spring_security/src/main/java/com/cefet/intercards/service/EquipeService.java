package com.cefet.intercards.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.intercards.dto.EquipeRequestDTO;
import com.cefet.intercards.dto.EquipeResponseDTO;
import com.cefet.intercards.entity.Equipe;
import com.cefet.intercards.entity.Modalidade;
import com.cefet.intercards.entity.Perfil;
import com.cefet.intercards.entity.Usuario;
import com.cefet.intercards.exception.BusinessException;
import com.cefet.intercards.exception.ResourceNotFoundException;
import com.cefet.intercards.repository.EquipeRepository;
import com.cefet.intercards.repository.ModalidadeRepository;
import com.cefet.intercards.repository.UsuarioRepository;

@Service
public class EquipeService {

    @Autowired
    private EquipeRepository equipeRepository;
    
    @Autowired
    private ModalidadeRepository modalidadeRepository;    

    @Autowired
    private UsuarioRepository usuarioRepository;  
    
    
    @Transactional(readOnly = true)
    public List<EquipeResponseDTO> listar() {
        List<Equipe> equipes = equipeRepository.findAll();
        return equipes.stream().map(EquipeResponseDTO::new).toList();
    }
    
    @Transactional(readOnly = true)
    public EquipeResponseDTO buscarPorId(Long id) {
    	Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipe não encontrado. Id: " + id));

        return new EquipeResponseDTO(equipe);
    }

    @Transactional
    public EquipeResponseDTO inserir(EquipeRequestDTO dto) {

    	if (equipeRepository.existsByNome(dto.getNome())){
            throw new BusinessException("Já existe uma equipe com esse nome.");
        }

        Modalidade modalidade = modalidadeRepository.findById(dto.getModalidadeId())
                .orElseThrow(() -> new ResourceNotFoundException("Modalidade não encontrada. Id: " + dto.getModalidadeId()));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrada. Id: " + dto.getUsuarioId()));
        
        if (usuario.getPerfil() != Perfil.TREINADOR) {
            throw new BusinessException("A equipe só pode ser associada a um usuário com perfil TREINADOR.");
        }
        
    	Equipe equipe = new Equipe();
    	equipe.setNome(dto.getNome());
    	equipe.setModalidade(modalidade);
    	equipe.setUsuario(usuario);

        return new EquipeResponseDTO(equipeRepository.save(equipe));
    }
    
    @Transactional
    public EquipeResponseDTO atualizar(Long id, EquipeRequestDTO dto) {

    	Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipe não encontrado. Id: " + id));

    	if (equipeRepository.existsByNomeAndIdNot(dto.getNome(), id)) {
            throw new BusinessException("Já existe uma equipe com esse nome.");
        }

        Modalidade modalidade = modalidadeRepository.findById(dto.getModalidadeId())
                .orElseThrow(() -> new ResourceNotFoundException("Modalidade não encontrada. Id: " + dto.getModalidadeId()));
        
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrada. Id: " + dto.getUsuarioId()));        
    	
        if (usuario.getPerfil() != Perfil.TREINADOR) {
            throw new BusinessException("A equipe só pode ser associada a um usuário com perfil TREINADOR.");
        }
        
    	equipe.setNome(dto.getNome());
    	equipe.setModalidade(modalidade);
    	equipe.setUsuario(usuario);

        return new EquipeResponseDTO(equipeRepository.save(equipe));
    }    

    @Transactional
    public void excluir(Long id) {
        if (!equipeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipe não encontrado com ID: " + id);
        }

        equipeRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public List<EquipeResponseDTO> listarPorModalidade(Long modalidadeId) {
        List<Equipe> equipes = equipeRepository.findByModalidadeId(modalidadeId);
        
        return equipes.stream().map(EquipeResponseDTO::new).toList();
    }    
}