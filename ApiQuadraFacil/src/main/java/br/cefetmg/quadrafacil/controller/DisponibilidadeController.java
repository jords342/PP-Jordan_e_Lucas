package br.cefetmg.quadrafacil.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.quadrafacil.model.Disponibilidade;
import br.cefetmg.quadrafacil.model.Quadra;
import br.cefetmg.quadrafacil.repository.DisponibilidadeRepository;
import br.cefetmg.quadrafacil.repository.QuadraRepository;

@RestController
@RequestMapping("/api/v1/disponibilidades")
@CrossOrigin(origins = "*")
public class DisponibilidadeController {

    private final DisponibilidadeRepository repository;
    private final QuadraRepository quadraRepository;

    public DisponibilidadeController(DisponibilidadeRepository repository, QuadraRepository quadraRepository) {
        this.repository = repository;
        this.quadraRepository = quadraRepository;
    }

    @GetMapping("/quadra/{quadraId}/data/{data}")
    public List<Disponibilidade> listarPorQuadraEData(@PathVariable String quadraId, @PathVariable String data) {
        return repository.findByQuadraIdAndData(quadraId, data);
    }

    @PutMapping("")
    public Disponibilidade definirStatus(@RequestBody Map<String, String> body) {
        String quadraId = body.get("quadraId");
        String data = body.get("data");
        Integer hora = Integer.valueOf(body.get("hora"));
        String statusTexto = body.get("status");
        String usuarioId = body.get("usuarioId");

        // Verifica se quem está solicitando é o proprietário da quadra
        Quadra quadra = quadraRepository.findById(quadraId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quadra não encontrada"));

        if (!quadra.getProprietarioId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o proprietário pode alterar a disponibilidade");
        }

        // Não permite alterar datas passadas
        LocalDate dataInformada = LocalDate.parse(data);
        if (dataInformada.isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível alterar datas passadas");
        }

        Disponibilidade.Status status = Disponibilidade.Status.valueOf(statusTexto);

        Disponibilidade disponibilidade = repository.findByQuadraIdAndDataAndHora(quadraId, data, hora)
            .orElseGet(() -> {
                Disponibilidade nova = new Disponibilidade();
                nova.setQuadraId(quadraId);
                nova.setData(data);
                nova.setHora(hora);
                return nova;
            });

        disponibilidade.setStatus(status);
        return repository.save(disponibilidade);
    }
}