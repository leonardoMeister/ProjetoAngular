import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, take } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
    providedIn: 'root'
})
export class FuncionarioService {

    private registros: AngularFirestoreCollection<Funcionario>;

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthenticationService

    ) {
        this.registros = this.firestore.collection<Funcionario>("funcionarios");
    }

    public selecionarTodos(): Observable<Funcionario[]> {

        return this.registros.valueChanges()
            .pipe(
                map((funcionarios: Funcionario[]) => {

                    funcionarios.forEach(funcionario => {

                        this.firestore
                            .collection<Departamento>("departamentos")
                            .doc(funcionario.departamentoId)
                            .valueChanges()
                            .subscribe(x => funcionario.departamento = x);

                    });

                    return funcionarios;
                })

            );
    }
    public selecionarFuncionariologado(email: string| null|undefined) {

        return this.firestore.collection<Funcionario>("funcionarios", ref => ref.where('email', '==', email))
            .valueChanges()
            .pipe(
                take(1),
                map(x => x[0])
            );

    }

    public async inserir(registro: Funcionario): Promise<any> {
        if (!registro) {
            return Promise.reject("item invalido");
        }
        const res = await this.registros.add(registro);
        registro.id = res.id;
        this.registros.doc(res.id).set(registro);
    }
    public async editar(registro: Funcionario): Promise<void> {
        return this.registros.doc(registro.id)
            .set(registro);
    }
    public async excluir(registro: Funcionario): Promise<void> {
        return this.registros.doc(registro.id).delete();
    }


}
