import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly KEY_USUARIO = 'usuarioAutenticado';
  private usuariosJson: UsuarioModel[] = [];

  constructor(private http: HttpClient) {}

  cadastrar(usuario: UsuarioModel): Observable<UsuarioModel> {
    usuario.idUsuario = crypto.randomUUID();
    usuario.criadoEm = new Date().toISOString();
    this.usuariosJson.push(usuario);
    return of(usuario);
  }

  autenticar(email: string, senha: string): Observable<UsuarioModel | null> {
    const encontrado = this.usuariosJson.find(
      u => u.email === email && u.senha === senha
    ) ?? null;
    return of(encontrado);
  }

  buscarPorId(id: string): Observable<UsuarioModel | null> {
    const encontrado = this.usuariosJson.find(u => u.idUsuario === id) ?? null;
    return of(encontrado);
  }

  salvarSessao(usuario: UsuarioModel): void {
    localStorage.setItem(this.KEY_USUARIO, JSON.stringify(usuario));
  }

  obterSessao(): UsuarioModel {
    const json = localStorage.getItem(this.KEY_USUARIO);
    return json ? JSON.parse(json) as UsuarioModel : new UsuarioModel();
  }

  limparSessao(): void {
    localStorage.removeItem(this.KEY_USUARIO);
  }

  verificarSessao(): boolean {
    return localStorage.getItem(this.KEY_USUARIO) !== null;
  }
}