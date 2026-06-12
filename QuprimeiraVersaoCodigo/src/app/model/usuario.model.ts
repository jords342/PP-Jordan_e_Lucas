export class UsuarioModel {
  idUsuario: string;
  nomeUsuario: string;
  email: string;
  senha: string;
  fotoPerfil: string;
  criadoEm: string;

  constructor() {
    this.idUsuario = '';
    this.nomeUsuario = '';
    this.email = '';
    this.senha = '';
    this.fotoPerfil = '';
    this.criadoEm = new Date().toISOString(); // 👈 gera ex: "2026-05-29T14:32:00.000Z"
  }
}