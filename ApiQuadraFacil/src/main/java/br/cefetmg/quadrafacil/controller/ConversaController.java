package br.cefetmg.quadrafacil.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.quadrafacil.model.Conversa;
import br.cefetmg.quadrafacil.repository.ConversaRepository;

@RestController
@RequestMapping("/api/v1/conversas")
@CrossOrigin(origins = "*")
public class ConversaController {

    private final ConversaRepository repository;

    public ConversaController(ConversaRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Conversa> listarPorUsuario(@PathVariable String usuarioId) {
        return repository.findByUsuario1IdOrUsuario2Id(usuarioId, usuarioId);
    }

    @GetMapping("/{id}")
    public Conversa buscarPorId(@PathVariable String id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversa não encontrada"));
    }

    @PostMapping("/iniciar")
    public Conversa iniciar(@RequestBody Map<String, String> body) {
        String usuario1Id = body.get("usuario1Id");
        String usuario2Id = body.get("usuario2Id");

        return repository.buscarEntreUsuarios(usuario1Id, usuario2Id)
            .orElseGet(() -> {
                Conversa nova = new Conversa();
                nova.setUsuario1Id(usuario1Id);
                nova.setUsuario2Id(usuario2Id);
                return repository.save(nova);
            });
    }
}