package br.cefetmg.quadrafacil.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import br.cefetmg.quadrafacil.model.Mensagem;
import br.cefetmg.quadrafacil.repository.MensagemRepository;

@RestController
@RequestMapping("/api/v1/mensagens")
@CrossOrigin(origins = "*")
public class MensagemController {

    private final MensagemRepository repository;

    public MensagemController(MensagemRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/conversa/{conversaId}")
    public List<Mensagem> listarPorConversa(@PathVariable String conversaId) {
        return repository.findByConversaIdOrderByCriadoEmAsc(conversaId);
    }

    @PostMapping("")
    public Mensagem enviar(@RequestBody Mensagem mensagem) {
        mensagem.setIdMensagem(null);
        return repository.save(mensagem);
    }
}