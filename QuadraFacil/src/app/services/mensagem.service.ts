import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensagemModel } from '../model/mensagem.model';

@Injectable({
  providedIn: 'root',
})
export class MensagemService {
  private readonly API_URL = 'https://apiquadrafacil.onrender.com/api/v1/mensagens';

  constructor(private http: HttpClient) {}

  listarPorConversa(conversaId: string): Observable<MensagemModel[]> {
    return this.http.get<MensagemModel[]>(`${this.API_URL}/conversa/${conversaId}`);
  }

  enviar(mensagem: MensagemModel): Observable<MensagemModel> {
    return this.http.post<MensagemModel>(this.API_URL, mensagem);
  }
}