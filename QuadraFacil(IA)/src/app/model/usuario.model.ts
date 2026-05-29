export class UsuarioModel {
  id: string;
  nomeUsuario: string;
  email: string;
  senha: string;
  fotoPerfil: string;
  dataEntrada: string;

  constructor() {
    this.id = crypto.randomUUID();
    this.nomeUsuario = '';
    this.email = '';
    this.senha = '';
    this.fotoPerfil = '';
    this.dataEntrada = new Date().toLocaleDateString('pt-BR');
  }
}