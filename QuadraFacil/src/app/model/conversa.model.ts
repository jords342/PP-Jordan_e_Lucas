export class ConversaModel {
  idConversa: string;
  usuario1Id: string;
  usuario2Id: string;
  criadoEm: string;

  constructor() {
    this.idConversa = '';
    this.usuario1Id = '';
    this.usuario2Id = '';
    this.criadoEm = new Date().toISOString();
  }
}