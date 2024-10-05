import { TipoUsuario } from "./tipo-usuario.model";

export class Usuario {
    id!: number;
    nome!:  string;
    telefone!: string;
    email!: string;
    endereco!: string;
    tipoUsuario!: TipoUsuario;
    senha!:  string;
}
