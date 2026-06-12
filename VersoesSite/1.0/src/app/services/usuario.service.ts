import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly API_URL = 'http://localhost:8080/api/v1/usuarios';
  private readonly KEY_USUARIO = 'usuarioAutenticado';

  constructor(private http: HttpClient) {}

  cadastrar(usuario: UsuarioModel): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(this.API_URL, usuario);
  }

  autenticar(email: string, senha: string): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(`${this.API_URL}/login`, { email, senha });
  }

  buscarPorId(id: string): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.API_URL}/${id}`);
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