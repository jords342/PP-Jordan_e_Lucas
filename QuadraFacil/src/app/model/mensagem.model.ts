export class MensagemModel {
  idMensagem: string;
  conversaId: string;
  remetenteId: string;
  texto: string;
  criadoEm: string;
  tipoMensagem: 'TEXTO' | 'PEDIDO_ALUGUEL';
  solicitacaoId: string;
  statusSolicitacao: 'PENDENTE' | 'ACEITA' | 'RECUSADA' | 'CANCELADA' | '';

  constructor() {
    this.idMensagem = '';
    this.conversaId = '';
    this.remetenteId = '';
    this.texto = '';
    this.criadoEm = new Date().toISOString();
    this.tipoMensagem = 'TEXTO';
    this.solicitacaoId = '';
    this.statusSolicitacao = '';
  }
}