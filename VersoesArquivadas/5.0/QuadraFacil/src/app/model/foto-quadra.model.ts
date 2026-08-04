export class FotoQuadraModel {
  idFoto: string;
  quadraId: string;
  imagemBase64: string;
  criadoEm: string;

  constructor() {
    this.idFoto = '';
    this.quadraId = '';
    this.imagemBase64 = '';
    this.criadoEm = new Date().toISOString();
  }
}