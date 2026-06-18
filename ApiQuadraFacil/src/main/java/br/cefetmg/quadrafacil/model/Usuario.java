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
public class Usuario {

    @Id
    private String idUsuario;

    @Column(length = 60, nullable = false)
    private String nomeUsuario;

    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(length = 255)
    private String fotoPerfil;

    @Column(nullable = false)
    private String criadoEm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Papel papel;

    // Gera o ID e a data automaticamente antes de salvar
    @PrePersist
    public void prePersist() {
        if (this.idUsuario == null || this.idUsuario.isEmpty()) {
            this.idUsuario = UUID.randomUUID().toString();
        }
        if (this.criadoEm == null || this.criadoEm.isEmpty()) {
            this.criadoEm = LocalDateTime.now().toString();
        }
        if (this.papel == null) {
            this.papel = Papel.USUARIO; // 👈 todo novo cadastro começa como USUARIO
        }
    }
    public enum Papel {
    USUARIO, MODERADOR
}

}

