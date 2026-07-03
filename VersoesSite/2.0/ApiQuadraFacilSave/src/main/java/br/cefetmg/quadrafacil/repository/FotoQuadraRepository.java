package br.cefetmg.quadrafacil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.cefetmg.quadrafacil.model.FotoQuadra;

@Repository
public interface FotoQuadraRepository extends JpaRepository<FotoQuadra, String> {
    List<FotoQuadra> findByQuadraId(String quadraId);
}