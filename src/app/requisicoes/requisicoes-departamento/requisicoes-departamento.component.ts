import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { EquipamentoService } from 'src/app/equipamentos/service/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Movimentacao } from '../models/movimentacao.model';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
    selector: 'app-requisicoes-departamento',
    templateUrl: './requisicoes-departamento.component.html'
})
export class RequisicoesDepartamentoComponent implements OnInit {


    public requisicoes$: Observable<Requisicao[]>;
    public funcionarioLogado: Funcionario;
    public departamentos$: Observable<Departamento[]>;

    public funcioNovo$: Observable<Funcionario>;

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private authService: AuthenticationService,

        private funcionarioService: FuncionarioService,
        private departamentoService: DepartamentoService,
        private equipamentoService: EquipamentoService,
        private requisicoesService: RequisicaoService,

    ) { }
    
    ngOnInit(): void {
        this.obterFuncionarioLogado();
        this.requisicoes$ = this.requisicoesService.selecionarTodos();
        this.departamentos$ = this.departamentoService.selecionarTodos();

    }


    public obterFuncionarioLogado() {

        this.authService.usuarioLogado.subscribe(dados => {
            let email = dados?.email;
            this.funcioNovo$ = this.funcionarioService.selecionarFuncionariologado(email);
            this.funcionarioService.selecionarFuncionariologado(email)
                .subscribe(funcionario => {
                    this.funcionarioLogado = funcionario;

                    this.requisicoes$ = this.requisicoesService.selecionarTodos()
                        .pipe(
                            map(requisicao => {
                                return requisicao.filter(x => x.funcionario?.email === this.funcionarioLogado.email);
                            })
                        )

                })

        });

    }
}
