package br.cefetmg.quadrafacil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.cefetmg.quadrafacil.model.Quadra;

@Repository
public interface QuadraRepository extends JpaRepository<Quadra, String> {
    List<Quadra> findByProprietarioId(String proprietarioId);
    List<Quadra> findBySituacao(Quadra.Situacao situacao);
    List<Quadra> findByTipoAcesso(Quadra.TipoAcesso tipoAcesso);
}