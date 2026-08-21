package br.cefetmg.quadrafacil.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.cefetmg.quadrafacil.model.Conversa;

@Repository
public interface ConversaRepository extends JpaRepository<Conversa, String> {

    List<Conversa> findByUsuario1IdOrUsuario2Id(String usuario1Id, String usuario2Id);

    @Query("SELECT c FROM Conversa c WHERE " +
           "(c.usuario1Id = :usuario1 AND c.usuario2Id = :usuario2) " +
           "OR (c.usuario1Id = :usuario2 AND c.usuario2Id = :usuario1)")
    Optional<Conversa> buscarEntreUsuarios(@Param("usuario1") String usuario1, @Param("usuario2") String usuario2);
}