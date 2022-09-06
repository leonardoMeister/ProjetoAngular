import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';

@Injectable({
    providedIn: 'root'
})
export class RequisicaoService  {

    registros: AngularFirestoreCollection<Requisicao>;

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthenticationService,
        private funcionarioService: FuncionarioService
    ) {
        this.registros = this.firestore.collection<Requisicao>("requisicoes");
    }
    private funcionarioLogado:Funcionario;

    public selecionarTodos(): Observable<Requisicao[]> {


        return this.registros.valueChanges()

            .pipe(
                map((requisicoes: Requisicao[]) => {

                    requisicoes.forEach(requisicao => {

                        this.firestore
                            .collection<Departamento>("departamentos")
                            .doc(requisicao.departamentoId)
                            .valueChanges()
                            .subscribe(x => requisicao.departamento = x);

                        this.firestore
                            .collection<Funcionario>("funcionarios")
                            .doc(requisicao.funcionarioId)
                            .valueChanges()
                            .subscribe(x => requisicao.funcionario = x);

                        this.firestore
                            .collection<Equipamento>("equipamentos")
                            .doc(requisicao.equipamentoId)
                            .valueChanges()
                            .subscribe(x => requisicao.equipamento = x);
                    });
                    let valorSalvo;

                    this.authService.usuarioLogado.subscribe(x => {
                        valorSalvo = x?.uid;
                        return valorSalvo
                    });

                    let email;

                    let aux = this.authService.usuarioLogado.subscribe((x) => {
                        email = x?.email;
                    });

                    return requisicoes;
                })

            );
    }

    public async inserir(registro: Requisicao): Promise<any> {
        if (!registro) {
            return Promise.reject("item invalido");
        }
        const res = await this.registros.add(registro);
        registro.id = res.id;
        this.registros.doc(res.id).set(registro);
    }

    public async editar(registro: Requisicao): Promise<void> {
        return this.registros.doc(registro.id)
            .set(registro);
    }

    public async excluir(registro: Requisicao): Promise<void> {
        return this.registros.doc(registro.id).delete();
    }
}
