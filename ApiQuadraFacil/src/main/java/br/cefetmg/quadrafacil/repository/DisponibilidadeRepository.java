package br.cefetmg.quadrafacil.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.cefetmg.quadrafacil.model.Disponibilidade;

@Repository
public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, String> {

    List<Disponibilidade> findByQuadraIdAndData(String quadraId, String data);

    Optional<Disponibilidade> findByQuadraIdAndDataAndHora(String quadraId, String data, Integer hora);
}