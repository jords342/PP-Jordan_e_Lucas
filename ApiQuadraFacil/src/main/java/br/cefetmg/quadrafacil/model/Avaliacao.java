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
public class Avaliacao {

    @Id
    private String idAvaliacao;

    @Column(nullable = false)
    private String quadraId;

    @Column(nullable = false)
    private String usuarioId;

    @Column(length = 2000, nullable = false)
    private String comentario;

    @Column(nullable = false)
    private Integer nota; // de 1 a 5

    @Column(nullable = false)
    private String criadoEm;

    // Gera o ID e a data automaticamente antes de salvar
    @PrePersist
    public void prePersist() {
        if (this.idAvaliacao == null || this.idAvaliacao.isEmpty()) {
            this.idAvaliacao = UUID.randomUUID().toString();
        }
        if (this.criadoEm == null || this.criadoEm.isEmpty()) {
            this.criadoEm = LocalDateTime.now().toString();
        }
    }
}