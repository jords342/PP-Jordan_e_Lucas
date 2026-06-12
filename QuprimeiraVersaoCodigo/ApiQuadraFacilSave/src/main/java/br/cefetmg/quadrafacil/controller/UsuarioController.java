package br.cefetmg.quadrafacil.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.quadrafacil.model.Usuario;
import br.cefetmg.quadrafacil.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping("")
    public List<Usuario> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Usuario getById(@PathVariable String id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    @PostMapping("")
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        usuario.setIdUsuario(null); // garante que o @PrePersist gera o UUID
        return repository.save(usuario);
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        return repository.findByEmailAndSenha(email, senha)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha incorretos"));
    }

    @PutMapping("")
    public Usuario alterar(@RequestBody Usuario usuario) {
        if (usuario.getIdUsuario() == null || usuario.getIdUsuario().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "idUsuario é obrigatório");
        }
        return repository.save(usuario);
    }

    @DeleteMapping("/{id}")
    public Usuario excluir(@PathVariable String id) {
        Usuario usuario = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        repository.deleteById(id);
        return usuario;
    }
}