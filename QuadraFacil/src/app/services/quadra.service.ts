import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuadraModel } from '../model/quadra.model';

@Injectable({
  providedIn: 'root',
})
export class QuadraService {
  private readonly API_URL = 'http://localhost:8080/api/v1/quadras';

  constructor(private http: HttpClient) { }

  listarTodas(): Observable<QuadraModel[]> {
    return this.http.get<QuadraModel[]>(this.API_URL);
  }

  listarPorProprietario(proprietarioId: string): Observable<QuadraModel[]> {
    return this.http.get<QuadraModel[]>(`${this.API_URL}/proprietario/${proprietarioId}`);
  }

  buscarPorId(id: string): Observable<QuadraModel> {
    return this.http.get<QuadraModel>(`${this.API_URL}/${id}`);
  }

  criar(quadra: QuadraModel): Observable<QuadraModel> {
    return this.http.post<QuadraModel>(this.API_URL, quadra);
  }

  alterar(quadra: QuadraModel): Observable<QuadraModel> {
    return this.http.put<QuadraModel>(this.API_URL, quadra);
  }

  excluir(id: string): Observable<QuadraModel> {
    return this.http.delete<QuadraModel>(`${this.API_URL}/${id}`);
  }
  listarAtivas(): Observable<QuadraModel[]> {
    return this.http.get<QuadraModel[]>(`${this.API_URL}/ativas`);
  }

  listarPendentes(): Observable<QuadraModel[]> {
    return this.http.get<QuadraModel[]>(`${this.API_URL}/pendentes`);
  }

  aprovar(id: string): Observable<QuadraModel> {
    const quadra = new QuadraModel();
    quadra.idQuadra = id;
    quadra.situacao = 'ATIVA';
    return this.http.patch<QuadraModel>(`${this.API_URL}/${id}/situacao`, { situacao: 'ATIVA' });
  }
}