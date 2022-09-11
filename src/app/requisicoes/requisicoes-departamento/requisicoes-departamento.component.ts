import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    public form: FormGroup;
    public requisicaoAux:Requisicao;
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

        this.form = this.fb.group({

            descricao: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(40)]),
            status: new FormControl("", Validators.required),
            solicitacao: new FormControl("",[Validators.required, Validators.minLength(10), Validators.maxLength(40)])
        });
    }
    get descricao() { return this.form.get('descricao') }
    get status() { return this.form.get('status') }
    get solicitacao() { return this.form.get('solicitacao') }


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
    public async visualizar(modal: TemplateRef<any>, requisicao: Requisicao) {

        try {
            this.requisicaoAux = requisicao;
            await this.modalService.open(modal).result;
        } catch (err) {
            console.log(err);
        }
    }
    public async gravar(modal: TemplateRef<any>, requisicao: Requisicao) {
        this.form.reset();

        try {

            this.requisicaoAux = requisicao;

            await this.modalService.open(modal).result;

            if (this.form.valid) {
                this.pegarDadosRequisicaoEdicao(requisicao);
                await this.requisicoesService.editar(requisicao);
                this.menssagemSucesso();
            } else {
                this.menssagemErro();
            }
        } catch (err) {
            console.log(err);
            this.menssagemErro();
        }
    }
    pegarDadosRequisicaoEdicao(requisicao: Requisicao) {

        requisicao.ultimaAtualizacao = new Date(Date.now()).toLocaleDateString();
        requisicao.status = this.status?.value;
        const resultado = this.form.value
        requisicao.movimentacoes?.push(resultado)
    }


    private menssagemSucesso() {
        this.toastr.success("Registro Salvo.", "Success",
            {
                timeOut: 2000,
                closeButton: true,
                disableTimeOut: false,
                tapToDismiss: true,
                progressBar: true
            });
    }

    private menssagemErro() {
        this.toastr.warning("Não foi possival salvar o registro.", "Falha",
            {
                timeOut: 2000,
                closeButton: true,
                disableTimeOut: false,
                tapToDismiss: true,
                progressBar: true
            });
    }
}
