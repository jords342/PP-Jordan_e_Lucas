package br.cefetmg.quadrafacil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.cefetmg.quadrafacil.model.Quadra;

@Repository
public interface QuadraRepository extends JpaRepository<Quadra, String> {
    List<Quadra> findByProprietarioId(String proprietarioId);
    List<Quadra> findBySituacao(Quadra.Situacao situacao);
    List<Quadra> findByTipoAcesso(Quadra.TipoAcesso tipoAcesso);

    @Query("SELECT q FROM Quadra q WHERE q.situacao = 'ATIVA' " +
           "AND (LOWER(q.nome) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(q.endereco) LIKE LOWER(CONCAT('%', :texto, '%')))")
    List<Quadra> buscarPorTexto(@Param("texto") String texto);
}