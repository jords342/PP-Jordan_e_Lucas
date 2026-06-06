package br.cefetmg.quadrafacil.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.quadrafacil.model.Usuario;
import br.cefetmg.quadrafacil.repository.UsuarioRepository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1/usuarios")

public class UsuarioController {

    private UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    private static List<Usuario> usuariosList;

    private Long nextId = 1L;
    {
        usuariosList = new ArrayList<>();
        Usuario ent1 = new Usuario();
        ent1.setNome("Mario");
        ent1.setId(nextId++);
        ent1.setEndereço("Cano");
        Usuario ent2 = new Usuario();
        ent2.setNome("Princesa Peach");
        ent2.setId(nextId++);
        ent2.setEndereço("Palácio");
        usuariosList.add(ent1);
        usuariosList.add(ent2);
    }

    @GetMapping("")
    public List<Usuario> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Usuario getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping("")
    public Usuario inserir(@RequestBody Usuario usuario) {
        usuario.setId(null); //
        repository.save(usuario);

        return usuario;
    }

    @DeleteMapping("/{id}")
    public Usuario excluirUsuario(@PathVariable Long id) {
        Usuario ret = repository.findById(id).orElse(null);

            if (ret == null) {
                 throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario com id:"+id+"não encontrado");
            }
            repository.deleteById(id);
        return ret;
    }

    @PutMapping("")
    public Usuario alterarUsuario(@RequestBody Usuario usuario) {

        if (usuario.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "id é obrigatório");
        }
        repository.save(usuario);
        return usuario;
    }

}
