import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // 👇 Quando tiver API, troque aqui e remova o JSON local
  private readonly API_URL = 'https://SUA_API_AQUI.com/usuarios';
  private readonly KEY_USUARIO = 'usuarioAutenticado';

  // 👇 Banco local temporário enquanto não tem API
  private usuariosJson: UsuarioModel[] = [];

  constructor(private http: HttpClient) {}

  // --- AUTH LOCAL (remover quando tiver API) ---

  cadastrar(usuario: UsuarioModel): Observable<UsuarioModel> {
    // TODO: trocar por -> return this.http.post<UsuarioModel>(this.API_URL, usuario);
    usuario.idUsuario = crypto.randomUUID();
    usuario.criadoEm = new Date().toISOString();
    this.usuariosJson.push(usuario);
    return of(usuario);
  }

  autenticar(email: string, senha: string): Observable<UsuarioModel | null> {
    // TODO: trocar por -> return this.http.post<UsuarioModel>(`${this.API_URL}/login`, { email, senha });
    const encontrado = this.usuariosJson.find(
      u => u.email === email && u.senha === senha
    ) ?? null;
    return of(encontrado);
  }

  // --- SESSÃO (igual ao outro projeto) ---

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