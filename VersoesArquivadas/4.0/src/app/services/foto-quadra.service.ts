import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FotoQuadraModel } from '../model/foto-quadra.model';

@Injectable({
  providedIn: 'root',
})
export class FotoQuadraService {
  private readonly API_URL = 'http://localhost:8080/api/v1/fotos';

  constructor(private http: HttpClient) {}

  listarPorQuadra(quadraId: string): Observable<FotoQuadraModel[]> {
    return this.http.get<FotoQuadraModel[]>(`${this.API_URL}/quadra/${quadraId}`);
  }

  buscarPorId(id: string): Observable<FotoQuadraModel> {
    return this.http.get<FotoQuadraModel>(`${this.API_URL}/${id}`);
  }

  salvar(foto: FotoQuadraModel): Observable<FotoQuadraModel> {
    return this.http.post<FotoQuadraModel>(this.API_URL, foto);
  }

  excluir(id: string): Observable<FotoQuadraModel> {
    return this.http.delete<FotoQuadraModel>(`${this.API_URL}/${id}`);
  }
}