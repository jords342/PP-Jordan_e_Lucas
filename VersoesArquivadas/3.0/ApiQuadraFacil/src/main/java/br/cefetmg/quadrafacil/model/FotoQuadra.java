package br.cefetmg.quadrafacil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class FotoQuadra {

    @Id
    private String idFoto;

    @Column(nullable = false)
    private String quadraId;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String imagemBase64; // foto salva como Base64

    @Column(nullable = false)
    private String criadoEm;

    @PrePersist
    public void prePersist() {
        if (this.idFoto == null || this.idFoto.isEmpty()) {
            this.idFoto = java.util.UUID.randomUUID().toString();
        }
        if (this.criadoEm == null || this.criadoEm.isEmpty()) {
            this.criadoEm = java.time.LocalDateTime.now().toString();
        }
    }
}