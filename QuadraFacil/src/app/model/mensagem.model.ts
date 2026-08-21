export class MensagemModel {
  idMensagem: string;
  conversaId: string;
  remetenteId: string;
  texto: string;
  criadoEm: string;

  constructor() {
    this.idMensagem = '';
    this.conversaId = '';
    this.remetenteId = '';
    this.texto = '';
    this.criadoEm = new Date().toISOString();
  }
}