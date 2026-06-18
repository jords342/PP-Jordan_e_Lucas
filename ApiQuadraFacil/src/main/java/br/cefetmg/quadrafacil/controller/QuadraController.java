package br.cefetmg.quadrafacil.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.quadrafacil.model.Quadra;
import br.cefetmg.quadrafacil.repository.QuadraRepository;

@RestController
@RequestMapping("/api/v1/quadras")
public class QuadraController {

    private final QuadraRepository repository;

    public QuadraController(QuadraRepository repository) {
        this.repository = repository;
    }

    @GetMapping("")
    public List<Quadra> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Quadra getById(@PathVariable String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quadra não encontrada"));
    }

    @GetMapping("/proprietario/{proprietarioId}")
    public List<Quadra> getByProprietario(@PathVariable String proprietarioId) {
        return repository.findByProprietarioId(proprietarioId);
    }

    @GetMapping("/situacao/{situacao}")
    public List<Quadra> getBySituacao(@PathVariable Quadra.Situacao situacao) {
        return repository.findBySituacao(situacao);
    }

    @PostMapping("")
    public Quadra criar(@RequestBody Quadra quadra) {
        quadra.setIdQuadra(null);
        return repository.save(quadra);
    }

    @PutMapping("")
    public Quadra alterar(@RequestBody Quadra quadra) {
        if (quadra.getIdQuadra() == null || quadra.getIdQuadra().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "idQuadra é obrigatório");
        }
        return repository.save(quadra);
    }

    @GetMapping("/pendentes")
    public List<Quadra> getPendentes() {
        return repository.findBySituacao(Quadra.Situacao.PENDENTE);
    }

    @GetMapping("/ativas")
    public List<Quadra> getAtivas() {
        return repository.findBySituacao(Quadra.Situacao.ATIVA);
    }

    @DeleteMapping("/{id}")
    public Quadra excluir(@PathVariable String id) {
        Quadra quadra = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quadra não encontrada"));
        repository.deleteById(id);
        return quadra;
    }
}
