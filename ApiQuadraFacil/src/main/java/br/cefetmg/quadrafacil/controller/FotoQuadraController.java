package br.cefetmg.quadrafacil.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.quadrafacil.model.FotoQuadra;
import br.cefetmg.quadrafacil.repository.FotoQuadraRepository;

@RestController
@RequestMapping("/api/v1/fotos")
@CrossOrigin(origins = "*")
public class FotoQuadraController {

    private final FotoQuadraRepository repository;

    public FotoQuadraController(FotoQuadraRepository repository) {
        this.repository = repository;
    }

    /**
     * Sem ?tipo → retorna TUDO (fotos + documentos).
     * Com ?tipo=FOTO → retorna só fotos públicas.
     * Com ?tipo=DOCUMENTO → retorna só documentos.
     */
    @GetMapping("/quadra/{quadraId}")
    public List<FotoQuadra> getByQuadra(
            @PathVariable String quadraId,
            @RequestParam(required = false) String tipo) {

        try {
            if (quadraId == null || quadraId.trim().isEmpty()) {
                return Collections.emptyList();
            }

            List<FotoQuadra> fotos;
            if (tipo != null && !tipo.trim().isEmpty()) {
                fotos = repository.findByQuadraIdAndTipo(quadraId, tipo);
            } else {
                fotos = repository.findByQuadraId(quadraId);
            }

            return (fotos != null) ? fotos : Collections.emptyList();
        } catch (Throwable t) {
            System.err.println(">>> ERRO AO BUSCAR FOTOS DA QUADRA (" + quadraId + "): " + t.getMessage());
            t.printStackTrace();
            return Collections.emptyList();
        }
    }

    @GetMapping("/{id}")
    public FotoQuadra getById(@PathVariable String id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Foto não encontrada"));
    }

    @PostMapping("")
    public FotoQuadra salvar(@RequestBody FotoQuadra foto) {
        try {
            foto.setIdFoto(null);
            if (foto.getTipo() == null || foto.getTipo().isEmpty()) {
                foto.setTipo("FOTO");
            }
            return repository.save(foto);
        } catch (Throwable t) {
            System.err.println(">>> ERRO AO SALVAR FOTO: " + t.getMessage());
            t.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao salvar foto: " + t.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public FotoQuadra excluir(@PathVariable String id) {
        FotoQuadra foto = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Foto não encontrada"));
        repository.deleteById(id);
        return foto;
    }
}