package br.cefetmg.quadrafacil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "foto_quadra")
public class FotoQuadra {

    @Id
    @Column(name = "id_foto")
    private String idFoto;

    @Column(name = "quadra_id", nullable = false)
    private String quadraId;

    @Column(name = "imagem_base64", nullable = false, columnDefinition = "TEXT")
    private String imagemBase64;

    /**
     * "FOTO"      → foto pública da quadra (aparece no carrossel)
     * "DOCUMENTO" → documento comprobatório (só moderador/dono vê)
     */
    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(name = "criado_em", nullable = false)
    private String criadoEm;

    @PrePersist
    public void prePersist() {
        if (this.idFoto == null || this.idFoto.isEmpty()) {
            this.idFoto = java.util.UUID.randomUUID().toString();
        }
        if (this.criadoEm == null || this.criadoEm.isEmpty()) {
            this.criadoEm = java.time.LocalDateTime.now().toString();
        }
        if (this.tipo == null || this.tipo.isEmpty()) {
            this.tipo = "FOTO";
        }
    }
}