package br.cefetmg.quadrafacil.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.quadrafacil.model.FotoQuadra;
import br.cefetmg.quadrafacil.repository.FotoQuadraRepository;

@RestController
@RequestMapping("/api/v1/fotos")
public class FotoQuadraController {

    private final FotoQuadraRepository repository;

    public FotoQuadraController(FotoQuadraRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/quadra/{quadraId}")
    public List<FotoQuadra> getByQuadra(@PathVariable String quadraId) {
        return repository.findByQuadraId(quadraId);
    }

    @GetMapping("/{id}")
    public FotoQuadra getById(@PathVariable String id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Foto não encontrada"));
    }

    @PostMapping("")
    public FotoQuadra salvar(@RequestBody FotoQuadra foto) {
        foto.setIdFoto(null);
        return repository.save(foto);
    }

    @DeleteMapping("/{id}")
    public FotoQuadra excluir(@PathVariable String id) {
        FotoQuadra foto = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Foto não encontrada"));
        repository.deleteById(id);
        return foto;
    }
}