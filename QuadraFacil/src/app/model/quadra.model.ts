export class QuadraModel {
  idQuadra: string;
  nome: string;
  endereco: string;
  horaAbertura: number;
  horaFechamento: number;
  precoAluguel: number;
  tipoAcesso: 'PUBLICO' | 'PRIVADO';
  situacao: 'PENDENTE' | 'ATIVA' | 'INATIVA';
  proprietarioId: string;
  criadoEm: string;

  constructor() {
    this.idQuadra = '';
    this.nome = '';
    this.endereco = '';
    this.horaAbertura = 8;
    this.horaFechamento = 22;
    this.precoAluguel = 0;
    this.tipoAcesso = 'PUBLICO';
    this.situacao = 'ATIVA';
    this.proprietarioId = '';
    this.criadoEm = new Date().toISOString();
  }
}