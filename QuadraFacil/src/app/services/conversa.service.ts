import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConversaModel } from '../model/conversa.model';

@Injectable({
  providedIn: 'root',
})
export class ConversaService {
  private readonly API_URL = 'https://apiquadrafacil.onrender.com/api/v1/conversas';

  constructor(private http: HttpClient) {}

  listarPorUsuario(usuarioId: string): Observable<ConversaModel[]> {
    return this.http.get<ConversaModel[]>(`${this.API_URL}/usuario/${usuarioId}`);
  }

  buscarPorId(id: string): Observable<ConversaModel> {
    return this.http.get<ConversaModel>(`${this.API_URL}/${id}`);
  }

  iniciar(usuario1Id: string, usuario2Id: string): Observable<ConversaModel> {
    return this.http.post<ConversaModel>(`${this.API_URL}/iniciar`, { usuario1Id, usuario2Id });
  }
}