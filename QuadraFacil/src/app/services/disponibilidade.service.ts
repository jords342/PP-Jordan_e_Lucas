import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DisponibilidadeModel } from '../model/disponibilidade.model';

@Injectable({
  providedIn: 'root',
})
export class DisponibilidadeService {
  private readonly API_URL = 'https://apiquadrafacil.onrender.com/api/v1/disponibilidades';

  constructor(private http: HttpClient) {}

  listarPorQuadraEData(quadraId: string, data: string): Observable<DisponibilidadeModel[]> {
    return this.http.get<DisponibilidadeModel[]>(`${this.API_URL}/quadra/${quadraId}/data/${data}`);
  }

  definirStatus(quadraId: string, data: string, hora: number, status: string, usuarioId: string): Observable<DisponibilidadeModel> {
    return this.http.put<DisponibilidadeModel>(this.API_URL, {
      quadraId, data, hora: hora.toString(), status, usuarioId
    });
  }
}