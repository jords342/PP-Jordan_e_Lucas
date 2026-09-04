package br.cefetmg.quadrafacil.model;

import java.time.LocalDateTime;
import java.util.UUID;

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
public class Disponibilidade {

    @Id
    private String idDisponibilidade;

    @Column(nullable = false)
    private String quadraId;

    @Column(nullable = false)
    private String data; // formato "yyyy-MM-dd"

    @Column(nullable = false)
    private Integer hora; // 0 a 23

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private String criadoEm;

    public enum Status {
        LIVRE, ALUGADO, FECHADO
    }

    @PrePersist
    public void prePersist() {
        if (this.idDisponibilidade == null || this.idDisponibilidade.isEmpty()) {
            this.idDisponibilidade = UUID.randomUUID().toString();
        }
        if (this.criadoEm == null || this.criadoEm.isEmpty()) {
            this.criadoEm = LocalDateTime.now().toString();
        }
    }
}