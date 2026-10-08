package br.cefetmg.quadrafacil.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class SolicitacaoAluguel {

    @Id
    private String idSolicitacao;

    @Column(nullable = false)
    private String quadraId;

    @Column(nullable = false)
    private String solicitanteId;

    @Column(nullable = false)
    private String donoId;

    @Column(nullable = false)
    private String data; // "yyyy-MM-dd"

    @Column(nullable = false)
    private Integer hora; // 0-23

    @Column(columnDefinition = "TEXT")
    private String mensagem; // opcional, texto do solicitante

    @Column(nullable = false, length = 30)
    private String status; // PENDENTE | ACEITA | RECUSADA | CANCELADA

    @Column(nullable = false)
    private String criadoEm;

    private String respondidoEm;

    @PrePersist
    public void prePersist() {
        if (this.idSolicitacao == null || this.idSolicitacao.isEmpty()) {
            this.idSolicitacao = UUID.randomUUID().toString();
        }
        if (this.criadoEm == null || this.criadoEm.isEmpty()) {
            this.criadoEm = LocalDateTime.now().toString();
        }
        if (this.status == null || this.status.isEmpty()) {
            this.status = "PENDENTE";
        }
    }
}