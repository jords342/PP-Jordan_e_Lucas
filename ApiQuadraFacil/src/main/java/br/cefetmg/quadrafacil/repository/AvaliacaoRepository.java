package br.cefetmg.quadrafacil.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.cefetmg.quadrafacil.model.Avaliacao;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, String> {

    List<Avaliacao> findByQuadraId(String quadraId);
    Optional<Avaliacao> findByQuadraIdAndUsuarioId(String quadraId, String usuarioId);
}