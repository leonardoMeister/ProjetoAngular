import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import {Equipamento} from "src/app/equipamentos/models/equipamento.model";
import { Movimentacao } from "./movimentacao.model";

export class Requisicao{

    id: string;
    descricao: string;
    dataAbertura:Date;

    departamentoId:string;
    departamento?: Departamento;

    funcionarioId:string;
    funcionario?:Funcionario;

    equipamentoId?:string;
    equipamento?:Equipamento;

    movimentacoes?: Movimentacao[];
    ultimaAtualizacao?: Date;
    status: boolean;
}
