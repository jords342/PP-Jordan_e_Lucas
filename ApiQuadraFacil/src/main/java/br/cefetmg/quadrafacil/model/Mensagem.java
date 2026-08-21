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
public class Mensagem {

    @Id
    private String idMensagem;

    @Column(nullable = false)
    private String conversaId;

    @Column(nullable = false)
    private String remetenteId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(nullable = false)
    private String criadoEm;

    @PrePersist
    public void prePersist() {
        if (this.idMensagem == null || this.idMensagem.isEmpty()) {
            this.idMensagem = UUID.randomUUID().toString();
        }
        if (this.criadoEm == null || this.criadoEm.isEmpty()) {
            this.criadoEm = LocalDateTime.now().toString();
        }
    }
}