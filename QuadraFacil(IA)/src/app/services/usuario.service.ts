import { Injectable } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly KEY_USUARIOS = 'quadrafacil_usuarios';
  private readonly KEY_SESSAO = 'quadrafacil_sessao';

  cadastrar(nomeUsuario: string, email: string, senha: string): boolean {
    const usuarios = this.listarUsuarios();
    const jaExiste = usuarios.find(u => u.email === email || u.nomeUsuario === nomeUsuario);
    if (jaExiste) return false;

    const novo = new UsuarioModel();
    novo.nomeUsuario = nomeUsuario;
    novo.email = email;
    novo.senha = senha;

    usuarios.push(novo);
    localStorage.setItem(this.KEY_USUARIOS, JSON.stringify(usuarios));
    return true;
  }

  login(emailOuNome: string, senha: string): UsuarioModel | null {
    const usuarios = this.listarUsuarios();
    const usuario = usuarios.find(
      u => (u.email === emailOuNome || u.nomeUsuario === emailOuNome) && u.senha === senha
    );
    if (usuario) {
      localStorage.setItem(this.KEY_SESSAO, JSON.stringify(usuario));
      return usuario;
    }
    return null;
  }

  obterSessao(): UsuarioModel | null {
    const json = localStorage.getItem(this.KEY_SESSAO);
    return json ? JSON.parse(json) : null;
  }

  verificarSessao(): boolean {
    return localStorage.getItem(this.KEY_SESSAO) !== null;
  }

  sair(): void {
    localStorage.removeItem(this.KEY_SESSAO);
  }

  excluirConta(): void {
    const sessao = this.obterSessao();
    if (!sessao) return;
    const usuarios = this.listarUsuarios().filter(u => u.id !== sessao.id);
    localStorage.setItem(this.KEY_USUARIOS, JSON.stringify(usuarios));
    this.sair();
  }

  atualizarFoto(base64: string): void {
    const sessao = this.obterSessao();
    if (!sessao) return;
    sessao.fotoPerfil = base64;
    const usuarios = this.listarUsuarios().map(u => u.id === sessao.id ? sessao : u);
    localStorage.setItem(this.KEY_USUARIOS, JSON.stringify(usuarios));
    localStorage.setItem(this.KEY_SESSAO, JSON.stringify(sessao));
  }

  private listarUsuarios(): UsuarioModel[] {
    const json = localStorage.getItem(this.KEY_USUARIOS);
    return json ? JSON.parse(json) : [];
  }
}