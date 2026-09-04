export class DisponibilidadeModel {
  idDisponibilidade: string;
  quadraId: string;
  data: string; // "yyyy-MM-dd"
  hora: number; // 0 a 23
  status: 'LIVRE' | 'ALUGADO' | 'FECHADO';
  criadoEm: string;

  constructor() {
    this.idDisponibilidade = '';
    this.quadraId = '';
    this.data = '';
    this.hora = 0;
    this.status = 'LIVRE';
    this.criadoEm = new Date().toISOString();
  }
}