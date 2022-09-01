import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
    providedIn: 'root'
})
export class FuncionarioService {

    private registros: AngularFirestoreCollection<Funcionario>;

    constructor(
        private firestore: AngularFirestore
    ) {
        this.registros = this.firestore.collection<Funcionario>("funcionarios");
    }

    public selecionarTodos(): Observable<Funcionario[]> {
        return this.registros.valueChanges();
    }
    public async inserir(registro:Funcionario): Promise<any>{
        if(!registro){
            return Promise.reject("item invalido");
        }
        const res = await this.registros.add(registro);
        registro.id = res.id;
        this.registros.doc(res.id).set(registro);
    }
    public async editar(registro:Funcionario):Promise<void>{
        return this.registros.doc(registro.id)
            .set(registro);
    }
    public async excluir(registro:Funcionario): Promise<void>{
        return this.registros.doc(registro.id).delete();
    }


}
