package com.cefet.intercards.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.intercards.dto.JogadorRequestDTO;
import com.cefet.intercards.dto.JogadorResponseDTO;
import com.cefet.intercards.entity.Equipe;
import com.cefet.intercards.entity.Jogador;
import com.cefet.intercards.exception.BusinessException;
import com.cefet.intercards.exception.ResourceNotFoundException;
import com.cefet.intercards.repository.EquipeRepository;
import com.cefet.intercards.repository.JogadorRepository;

@Service
public class JogadorService {

    @Autowired
    private JogadorRepository jogadorRepository;
    
    @Autowired
    private EquipeRepository equipeRepository;    

    @Transactional(readOnly = true)
    public List<JogadorResponseDTO> listar() {
        List<Jogador> jogadores = jogadorRepository.findAll();
        return jogadores.stream().map(JogadorResponseDTO::new).toList();
    }
    
    @Transactional(readOnly = true)
    public JogadorResponseDTO buscarPorId(Long id) {
    	Jogador jogador = jogadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jogador não encontrado. Id: " + id));

        return new JogadorResponseDTO(jogador);
    }

    @Transactional
    public JogadorResponseDTO inserir(JogadorRequestDTO dto) {

        Equipe equipe = equipeRepository.findById(dto.getEquipeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipe não encontrada. Id: " + dto.getEquipeId()));
        
        /*RN - Validar limite máximo de jogadores por equipe */
        Integer quantidadeJogadores = jogadorRepository.countByEquipeId(equipe.getId());
        Integer limiteJogadores = equipe.getModalidade().getLimiteJogadores();
        
        if (quantidadeJogadores >= limiteJogadores) {
            throw new BusinessException("Limite de jogadores atingido para esta equipe.");
        }        
        
    	Jogador jogador = new Jogador();
    	jogador.setNome(dto.getNome());
    	jogador.setNumero(dto.getNumero());
    	jogador.setEquipe(equipe);
    	jogador.setUrlImagem(dto.getUrlImagem());

        return new JogadorResponseDTO(jogadorRepository.save(jogador));
    }
    
    @Transactional
    public JogadorResponseDTO atualizar(Long id, JogadorRequestDTO dto) {

    	Jogador jogador = jogadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jogador não encontrado. Id: " + id));

        Equipe equipe = equipeRepository.findById(dto.getEquipeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipe não encontrada. Id: " + dto.getEquipeId()));    	
    	
        /*RN - Validar limite máximo de jogadores por equipe */
        if (!jogador.getEquipe().getId().equals(equipe.getId())) {

            Integer quantidadeJogadores = jogadorRepository.countByEquipeId(equipe.getId());

            Integer limiteJogadores = equipe.getModalidade().getLimiteJogadores();

            if (quantidadeJogadores >= limiteJogadores) {
                throw new BusinessException("Limite de jogadores da equipe atingido.");
            }
        }        
        
    	jogador.setNome(dto.getNome());
    	jogador.setNumero(dto.getNumero());
    	jogador.setEquipe(equipe);
    	jogador.setUrlImagem(dto.getUrlImagem());

        return new JogadorResponseDTO(jogadorRepository.save(jogador));
    }    

    @Transactional
    public void excluir(Long id) {
        if (!jogadorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipe não encontrado com ID: " + id);
        }

        jogadorRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public List<JogadorResponseDTO> listarPorEquipe(Long equipeId) {

        List<Jogador> jogadores = jogadorRepository.findByEquipeId(equipeId);
        return jogadores.stream().map(JogadorResponseDTO::new).toList();
    }
}