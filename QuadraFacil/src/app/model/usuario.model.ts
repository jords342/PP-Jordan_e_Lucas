export class UsuarioModel {
  idUsuario: string;
  nomeUsuario: string;
  email: string;
  senha: string;
  fotoPerfil: string;
  criadoEm: string;
  papel: 'USUARIO' | 'MODERADOR';

  constructor() {
    this.idUsuario = '';
    this.nomeUsuario = '';
    this.email = '';
    this.senha = '';
    this.fotoPerfil = '';
    this.criadoEm = new Date().toISOString();
    this.papel = 'USUARIO';
  }
}