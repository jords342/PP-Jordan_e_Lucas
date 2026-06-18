package br.cefetmg.quadrafacil.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Quadra {

    @Id
    private String idQuadra;

    @Column(length = 100, nullable = false)
    private String nome;

    @Column(length = 150, nullable = false)
    private String endereco;

    @Column(length = 100, nullable = false)
    private String horario;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal precoAluguel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAcesso tipoAcesso;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Situacao situacao;

    @Column(nullable = false)
    private String proprietarioId;

    @Column(nullable = false)
    private String criadoEm;

    @PrePersist
    public void prePersist() {
        if (this.idQuadra == null || this.idQuadra.isEmpty()) {
            this.idQuadra = java.util.UUID.randomUUID().toString();
        }
        if (this.criadoEm == null || this.criadoEm.isEmpty()) {
            this.criadoEm = java.time.LocalDateTime.now().toString();
        }
    }

    public enum TipoAcesso {
        PUBLICO, PRIVADO
    }

    public enum Situacao {
        PENDENTE,ATIVA, INATIVA
    }
}