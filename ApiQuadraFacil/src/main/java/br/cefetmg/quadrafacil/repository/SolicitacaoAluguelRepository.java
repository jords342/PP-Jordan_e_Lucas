package br.cefetmg.quadrafacil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.cefetmg.quadrafacil.model.SolicitacaoAluguel;

@Repository
public interface SolicitacaoAluguelRepository extends JpaRepository<SolicitacaoAluguel, String> {

    List<SolicitacaoAluguel> findBySolicitanteId(String solicitanteId);

    List<SolicitacaoAluguel> findByDonoId(String donoId);

    List<SolicitacaoAluguel> findByQuadraIdAndDataAndHoraAndStatus(
        String quadraId, String data, Integer hora, String status);
}