package br.cefetmg.quadrafacil.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.quadrafacil.model.Avaliacao;
import br.cefetmg.quadrafacil.repository.AvaliacaoRepository;

@RestController
@RequestMapping("/api/v1/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    private final AvaliacaoRepository repository;

    public AvaliacaoController(AvaliacaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("")
    public List<Avaliacao> getAll() {
        return repository.findAll();
    }

    @GetMapping("/quadra/{quadraId}")
    public List<Avaliacao> getByQuadra(@PathVariable String quadraId) {
        return repository.findByQuadraId(quadraId);
    }

    @GetMapping("/{id}")
    public Avaliacao getById(@PathVariable String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada"));
    }

    @PostMapping("")
    public Avaliacao cadastrar(@RequestBody Avaliacao avaliacao) {
        boolean jaAvaliou = repository
                .findByQuadraIdAndUsuarioId(avaliacao.getQuadraId(), avaliacao.getUsuarioId())
                .isPresent();

        if (jaAvaliou) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Você já avaliou esta quadra");
        }

        avaliacao.setIdAvaliacao(null); // garante que o @PrePersist gera o UUID
        return repository.save(avaliacao);
    }

    @PutMapping("")
    public Avaliacao alterar(@RequestBody Avaliacao avaliacao) {
        if (avaliacao.getIdAvaliacao() == null || avaliacao.getIdAvaliacao().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "idAvaliacao é obrigatório");
        }
        return repository.save(avaliacao);
    }

    @DeleteMapping("/{id}")
    public Avaliacao excluir(@PathVariable String id) {
        Avaliacao avaliacao = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada"));
        repository.deleteById(id);
        return avaliacao;
    }
}