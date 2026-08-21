package br.cefetmg.quadrafacil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.cefetmg.quadrafacil.model.Mensagem;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, String> {
    List<Mensagem> findByConversaIdOrderByCriadoEmAsc(String conversaId);
}