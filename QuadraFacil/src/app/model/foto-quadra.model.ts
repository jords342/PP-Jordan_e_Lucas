export class FotoQuadraModel {
  idFoto: string;
  quadraId: string;
  imagemBase64: string;
  tipo: 'FOTO' | 'DOCUMENTO';
  criadoEm: string;

  constructor() {
    this.idFoto = '';
    this.quadraId = '';
    this.imagemBase64 = '';
    this.tipo = 'FOTO';
    this.criadoEm = new Date().toISOString();
  }
}