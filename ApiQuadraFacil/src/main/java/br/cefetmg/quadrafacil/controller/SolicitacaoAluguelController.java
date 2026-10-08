package br.cefetmg.quadrafacil.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.quadrafacil.model.Conversa;
import br.cefetmg.quadrafacil.model.Disponibilidade;
import br.cefetmg.quadrafacil.model.Mensagem;
import br.cefetmg.quadrafacil.model.Quadra;
import br.cefetmg.quadrafacil.model.SolicitacaoAluguel;
import br.cefetmg.quadrafacil.repository.ConversaRepository;
import br.cefetmg.quadrafacil.repository.DisponibilidadeRepository;
import br.cefetmg.quadrafacil.repository.MensagemRepository;
import br.cefetmg.quadrafacil.repository.QuadraRepository;
import br.cefetmg.quadrafacil.repository.SolicitacaoAluguelRepository;

@RestController
@RequestMapping("/api/v1/solicitacoes")
@CrossOrigin(origins = "*")
public class SolicitacaoAluguelController {

    private final SolicitacaoAluguelRepository repository;
    private final QuadraRepository quadraRepository;
    private final ConversaRepository conversaRepository;
    private final MensagemRepository mensagemRepository;
    private final DisponibilidadeRepository disponibilidadeRepository;

    public SolicitacaoAluguelController(
            SolicitacaoAluguelRepository repository,
            QuadraRepository quadraRepository,
            ConversaRepository conversaRepository,
            MensagemRepository mensagemRepository,
            DisponibilidadeRepository disponibilidadeRepository) {
        this.repository = repository;
        this.quadraRepository = quadraRepository;
        this.conversaRepository = conversaRepository;
        this.mensagemRepository = mensagemRepository;
        this.disponibilidadeRepository = disponibilidadeRepository;
    }

    @GetMapping("/{id}")
    public SolicitacaoAluguel buscarPorId(@PathVariable String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));
    }

    @GetMapping("/solicitante/{solicitanteId}")
    public List<SolicitacaoAluguel> listarPorSolicitante(@PathVariable String solicitanteId) {
        return repository.findBySolicitanteId(solicitanteId);
    }

    @GetMapping("/dono/{donoId}")
    public List<SolicitacaoAluguel> listarPorDono(@PathVariable String donoId) {
        return repository.findByDonoId(donoId);
    }

    // ===== Criar (chamado pela disponibilidade.page) =====

    @PostMapping("")
    public SolicitacaoAluguel criar(@RequestBody Map<String, String> body) {
        String quadraId = body.get("quadraId");
        String solicitanteId = body.get("solicitanteId");
        String data = body.get("data");
        Integer hora = Integer.valueOf(body.get("hora"));
        String mensagemTexto = body.get("mensagem");

        Quadra quadra = quadraRepository.findById(quadraId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quadra não encontrada"));

        if (quadra.getProprietarioId().equals(solicitanteId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Você não pode solicitar aluguel da sua própria quadra");
        }

        LocalDate dataInformada = LocalDate.parse(data);
        if (dataInformada.isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Não é possível solicitar aluguel para datas passadas");
        }

        // Já existe pedido aceito pra esse horário?
        List<SolicitacaoAluguel> aceitas = repository.findByQuadraIdAndDataAndHoraAndStatus(
                quadraId, data, hora, "ACEITA");
        if (!aceitas.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Esse horário já foi reservado");
        }

        // Cria a solicitação
        SolicitacaoAluguel solicitacao = new SolicitacaoAluguel();
        solicitacao.setQuadraId(quadraId);
        solicitacao.setSolicitanteId(solicitanteId);
        solicitacao.setDonoId(quadra.getProprietarioId());
        solicitacao.setData(data);
        solicitacao.setHora(hora);
        solicitacao.setMensagem(mensagemTexto);
        solicitacao.setStatus("PENDENTE");
        SolicitacaoAluguel salva = repository.save(solicitacao);

        // Cria ou reaproveita conversa
        Conversa conversa = conversaRepository
                .buscarEntreUsuarios(solicitanteId, quadra.getProprietarioId())
                .orElseGet(() -> {
                    Conversa nova = new Conversa();
                    nova.setUsuario1Id(solicitanteId);
                    nova.setUsuario2Id(quadra.getProprietarioId());
                    return conversaRepository.save(nova);
                });

        // Cria a mensagem especial no chat
        String horaFormatada = String.format("%02d:00", hora);
        String dataFormatada = dataInformada.getDayOfMonth() + "/" + dataInformada.getMonthValue() + "/"
                + dataInformada.getYear();
        String texto = "Pedido de aluguel — " + quadra.getNome() + " em " + dataFormatada + " às " + horaFormatada;
        if (mensagemTexto != null && !mensagemTexto.isEmpty()) {
            texto += "\n\n\"" + mensagemTexto + "\"";
        }

        Mensagem mensagem = new Mensagem();
        mensagem.setConversaId(conversa.getIdConversa());
        mensagem.setRemetenteId(solicitanteId);
        mensagem.setTexto(texto);
        mensagem.setTipoMensagem("PEDIDO_ALUGUEL");
        mensagem.setSolicitacaoId(salva.getIdSolicitacao());
        mensagem.setStatusSolicitacao("PENDENTE");
        mensagemRepository.save(mensagem);

        return salva;
    }

    // ===== Aceitar =====

    @PatchMapping("/{id}/aceitar")
    public SolicitacaoAluguel aceitar(@PathVariable String id, @RequestBody Map<String, String> body) {
        String usuarioId = body.get("usuarioId");
        SolicitacaoAluguel solicitacao = buscarEOValidar(id);

        if (!solicitacao.getDonoId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Apenas o dono pode aceitar a solicitação");
        }
        if (!"PENDENTE".equals(solicitacao.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Essa solicitação já foi respondida");
        }

        // Revalida se outra solicitação foi aceita enquanto isso
        List<SolicitacaoAluguel> aceitas = repository.findByQuadraIdAndDataAndHoraAndStatus(
                solicitacao.getQuadraId(), solicitacao.getData(), solicitacao.getHora(), "ACEITA");
        if (!aceitas.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Outro pedido já reservou esse horário");
        }

        solicitacao.setStatus("ACEITA");
        solicitacao.setRespondidoEm(LocalDateTime.now().toString());
        SolicitacaoAluguel salva = repository.save(solicitacao);

        // Marca a Disponibilidade como ALUGADO
        Disponibilidade disp = disponibilidadeRepository
                .findByQuadraIdAndDataAndHora(solicitacao.getQuadraId(), solicitacao.getData(), solicitacao.getHora())
                .orElseGet(() -> {
                    Disponibilidade nova = new Disponibilidade();
                    nova.setQuadraId(solicitacao.getQuadraId());
                    nova.setData(solicitacao.getData());
                    nova.setHora(solicitacao.getHora());
                    return nova;
                });
        disp.setStatus(Disponibilidade.Status.ALUGADO);
        disponibilidadeRepository.save(disp);

        // Atualiza a mensagem no chat
        atualizarMensagemDaSolicitacao(salva.getIdSolicitacao(), "ACEITA");

        return salva;
    }

    // ===== Recusar =====

    @PatchMapping("/{id}/recusar")
    public SolicitacaoAluguel recusar(@PathVariable String id, @RequestBody Map<String, String> body) {
        String usuarioId = body.get("usuarioId");
        SolicitacaoAluguel solicitacao = buscarEOValidar(id);

        if (!solicitacao.getDonoId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Apenas o dono pode recusar a solicitação");
        }
        if (!"PENDENTE".equals(solicitacao.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Essa solicitação já foi respondida");
        }

        solicitacao.setStatus("RECUSADA");
        solicitacao.setRespondidoEm(LocalDateTime.now().toString());
        SolicitacaoAluguel salva = repository.save(solicitacao);

        atualizarMensagemDaSolicitacao(salva.getIdSolicitacao(), "RECUSADA");
        return salva;
    }

    // ===== Cancelar (solicitante) =====

    @PatchMapping("/{id}/cancelar")
    public SolicitacaoAluguel cancelar(@PathVariable String id, @RequestBody Map<String, String> body) {
        String usuarioId = body.get("usuarioId");
        SolicitacaoAluguel solicitacao = buscarEOValidar(id);

        if (!solicitacao.getSolicitanteId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Apenas quem pediu pode cancelar a solicitação");
        }
        if (!"PENDENTE".equals(solicitacao.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Só é possível cancelar pedidos pendentes");
        }

        solicitacao.setStatus("CANCELADA");
        solicitacao.setRespondidoEm(LocalDateTime.now().toString());
        SolicitacaoAluguel salva = repository.save(solicitacao);

        atualizarMensagemDaSolicitacao(salva.getIdSolicitacao(), "CANCELADA");
        return salva;
    }

    // ===== Helpers =====

    private SolicitacaoAluguel buscarEOValidar(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));
    }

    private void atualizarMensagemDaSolicitacao(String solicitacaoId, String novoStatus) {
        List<Mensagem> msgs = mensagemRepository.findBySolicitacaoId(solicitacaoId);
        for (Mensagem m : msgs) {
            m.setStatusSolicitacao(novoStatus);
            mensagemRepository.save(m);
        }
    }
}