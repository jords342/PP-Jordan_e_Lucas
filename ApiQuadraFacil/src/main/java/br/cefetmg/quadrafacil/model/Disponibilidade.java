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
    private String data;

    @Column(nullable = false)
    private Integer hora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private String criadoEm;

    /**
     * ALUGADO  = evento real, preservado sempre.
     * FECHADO  = exceção manual do dono (fechou mesmo dentro do expediente,
     *            ou fechou fora do expediente por escolha).
     * LIVRE    = exceção manual do dono (abriu mesmo fora do expediente).
     *
     * LIVRE "default" (dentro do expediente, sem registro) NÃO é gravado.
     * FECHADO "default" (fora do expediente, sem registro) NÃO é gravado —
     * é derivado no front a partir de Quadra.horaAbertura / horaFechamento.
     */
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