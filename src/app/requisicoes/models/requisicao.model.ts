import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import {Equipamento} from "src/app/equipamentos/models/equipamento.model";

export class Requisicao{
    constructor(descricao:string,data:Date, departamentoId:string,funcionarioId:string,equipamentoId:string){
        this.descricao = descricao;
        this.dataAbertura = data;
        this.departamentoId = departamentoId;
        this.funcionarioId = funcionarioId;
        this.equipamentoId = equipamentoId;
    }

    id: string;
    descricao: string;
    dataAbertura:Date;

    departamentoId:string;
    departamento?: Departamento;

    funcionarioId:string;
    funcionario?:Funcionario;

    equipamentoId?:string;
    equipamento?:Equipamento;
}
