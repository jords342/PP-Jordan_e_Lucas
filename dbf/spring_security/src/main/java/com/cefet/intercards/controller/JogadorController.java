package com.cefet.intercards.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cefet.intercards.dto.JogadorRequestDTO;
import com.cefet.intercards.dto.JogadorResponseDTO;
import com.cefet.intercards.service.JogadorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/jogadores")
@Tag(name = "Jogador")
public class JogadorController {

    @Autowired
    private JogadorService jogadorService;

    @GetMapping
    @Operation(summary = "Listar equipes")
    public ResponseEntity<List<JogadorResponseDTO>> listar() {
        List<JogadorResponseDTO> jogadores = jogadorService.listar();
        return ResponseEntity.ok(jogadores);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar equipe por ID")
    public ResponseEntity<JogadorResponseDTO> buscarPorId(@PathVariable Long id) {
    	JogadorResponseDTO jogadorResponseDTO = jogadorService.buscarPorId(id);
        return ResponseEntity.ok(jogadorResponseDTO);
    }

    @PostMapping
    @Operation(summary = "Cadastrar equipe")
    public ResponseEntity<JogadorResponseDTO> inserir(@Valid @RequestBody JogadorRequestDTO jogadorRequestDTO) {
    	JogadorResponseDTO jogadorResponseDTO = jogadorService.inserir(jogadorRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(jogadorResponseDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar equipe")
    public ResponseEntity<JogadorResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody JogadorRequestDTO jogadorRequestDTO) {

    	JogadorResponseDTO jogadorResponseDTO = jogadorService.atualizar(id, jogadorRequestDTO);

        return ResponseEntity.ok(jogadorResponseDTO);
    }    

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir equipe")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        jogadorService.excluir(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/equipe/{equipeId}")
    @Operation(summary = "Listar jogadores por equipe")
    public ResponseEntity<List<JogadorResponseDTO>> listarPorEquipe(@PathVariable Long equipeId) {
        List<JogadorResponseDTO> jogadores = jogadorService.listarPorEquipe(equipeId);
        return ResponseEntity.ok(jogadores);
    }    

}