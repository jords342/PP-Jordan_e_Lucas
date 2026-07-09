import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvaliacaoModel } from '../model/avaliacao.model';

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoService {
  private readonly API_URL = 'http://localhost:8080/api/v1/avaliacoes';

  constructor(private http: HttpClient) {}

  listarPorQuadra(quadraId: string): Observable<AvaliacaoModel[]> {
    return this.http.get<AvaliacaoModel[]>(`${this.API_URL}/quadra/${quadraId}`);
  }

  buscarPorId(id: string): Observable<AvaliacaoModel> {
    return this.http.get<AvaliacaoModel>(`${this.API_URL}/${id}`);
  }

  criar(avaliacao: AvaliacaoModel): Observable<AvaliacaoModel> {
    return this.http.post<AvaliacaoModel>(this.API_URL, avaliacao);
  }

  alterar(avaliacao: AvaliacaoModel): Observable<AvaliacaoModel> {
    return this.http.put<AvaliacaoModel>(this.API_URL, avaliacao);
  }

  excluir(id: string): Observable<AvaliacaoModel> {
    return this.http.delete<AvaliacaoModel>(`${this.API_URL}/${id}`);
  }
}