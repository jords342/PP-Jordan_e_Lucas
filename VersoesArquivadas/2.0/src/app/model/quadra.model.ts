export class QuadraModel {
  idQuadra: string;
  nome: string;
  endereco: string;
  horario: string;
  precoAluguel: number;
  tipoAcesso: 'PUBLICO' | 'PRIVADO';
  situacao: 'PENDENTE' | 'ATIVA' | 'INATIVA' ;
  proprietarioId: string;
  criadoEm: string;

  constructor() {
    this.idQuadra = '';
    this.nome = '';
    this.endereco = '';
    this.horario = '';
    this.precoAluguel = 0;
    this.tipoAcesso = 'PUBLICO';
    this.situacao = 'ATIVA';
    this.proprietarioId = '';
    this.criadoEm = new Date().toISOString();
  }
}