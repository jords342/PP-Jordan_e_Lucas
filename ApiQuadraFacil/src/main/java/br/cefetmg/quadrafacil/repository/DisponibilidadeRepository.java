package br.cefetmg.quadrafacil.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import br.cefetmg.quadrafacil.model.Disponibilidade;

@Repository
public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, String> {

    List<Disponibilidade> findByQuadraIdAndData(String quadraId, String data);

    Optional<Disponibilidade> findByQuadraIdAndDataAndHora(String quadraId, String data, Integer hora);

    // Apaga apenas LIVRE e FECHADO explícitos de hoje em diante.
    // Nunca toca em ALUGADO.
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM disponibilidade " +
                   "WHERE quadra_id = :quadraId " +
                   "AND data >= :data " +
                   "AND status IN ('LIVRE','FECHADO')",
           nativeQuery = true)
    void limparExcecoesAPartirDe(@Param("quadraId") String quadraId, @Param("data") String data);
}