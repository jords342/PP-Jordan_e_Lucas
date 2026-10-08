export class SolicitacaoModel {
  idSolicitacao: string;
  quadraId: string;
  solicitanteId: string;
  donoId: string;
  data: string;
  hora: number;
  mensagem: string;
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA' | 'CANCELADA';
  criadoEm: string;
  respondidoEm: string;

  constructor() {
    this.idSolicitacao = '';
    this.quadraId = '';
    this.solicitanteId = '';
    this.donoId = '';
    this.data = '';
    this.hora = 0;
    this.mensagem = '';
    this.status = 'PENDENTE';
    this.criadoEm = new Date().toISOString();
    this.respondidoEm = '';
  }
}