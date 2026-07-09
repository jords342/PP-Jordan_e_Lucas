export class AvaliacaoModel {
  idAvaliacao: string;
  quadraId: string;
  usuarioId: string;
  comentario: string;
  nota: number; // de 1 a 5
  criadoEm: string;

  constructor() {
    this.idAvaliacao = '';
    this.quadraId = '';
    this.usuarioId = '';
    this.comentario = '';
    this.nota = 0;
    this.criadoEm = new Date().toISOString();
  }
}