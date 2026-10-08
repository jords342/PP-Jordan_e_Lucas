import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitacaoModel } from '../model/solicitacao.model';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService {
  private readonly API_URL = 'https://apiquadrafacil.onrender.com/api/v1/solicitacoes';

  constructor(private http: HttpClient) {}

  buscarPorId(id: string): Observable<SolicitacaoModel> {
    return this.http.get<SolicitacaoModel>(`${this.API_URL}/${id}`);
  }

  criar(quadraId: string, solicitanteId: string, data: string, hora: number, mensagem: string): Observable<SolicitacaoModel> {
    return this.http.post<SolicitacaoModel>(this.API_URL, {
      quadraId, solicitanteId, data, hora: hora.toString(), mensagem
    });
  }

  aceitar(id: string, usuarioId: string): Observable<SolicitacaoModel> {
    return this.http.patch<SolicitacaoModel>(`${this.API_URL}/${id}/aceitar`, { usuarioId });
  }

  recusar(id: string, usuarioId: string): Observable<SolicitacaoModel> {
    return this.http.patch<SolicitacaoModel>(`${this.API_URL}/${id}/recusar`, { usuarioId });
  }

  cancelar(id: string, usuarioId: string): Observable<SolicitacaoModel> {
    return this.http.patch<SolicitacaoModel>(`${this.API_URL}/${id}/cancelar`, { usuarioId });
  }
}