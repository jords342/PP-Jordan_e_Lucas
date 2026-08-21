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
public class Conversa {

    @Id
    private String idConversa;

    @Column(nullable = false)
    private String usuario1Id;

    @Column(nullable = false)
    private String usuario2Id;

    @Column(nullable = false)
    private String criadoEm;

    @PrePersist
    public void prePersist() {
        if (this.idConversa == null || this.idConversa.isEmpty()) {
            this.idConversa = UUID.randomUUID().toString();
        }
        if (this.criadoEm == null || this.criadoEm.isEmpty()) {
            this.criadoEm = LocalDateTime.now().toString();
        }
    }
}