package br.cefetmg.quadrafacil.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.cefetmg.quadrafacil.model.FotoQuadra;

@Repository
public interface FotoQuadraRepository extends JpaRepository<FotoQuadra, String> {
    
    // Consulta JPQL explícita para não depender de convenção de nomes
    @Query("SELECT f FROM FotoQuadra f WHERE f.quadraId = :quadraId")
    List<FotoQuadra> findByQuadraId(@Param("quadraId") String quadraId);
}