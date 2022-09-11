import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/service/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Movimentacao } from '../models/movimentacao.model';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
    selector: 'app-requisicoes-funcionario',
    templateUrl: './requisicoes-funcionario.component.html'
})
export class RequisicoesFuncionarioComponent implements OnInit {

    public departamentos$: Observable<Departamento[]>;
    public equipamentos$: Observable<Equipamento[]>;
    public requisicoes$: Observable<Requisicao[]>;
    public funcionarioLogado: Funcionario;

    public form: FormGroup;

    constructor(
        private funcionarioService: FuncionarioService,
        private departamentoService: DepartamentoService,
        private equipamentoService: EquipamentoService,
        private requisicoesService: RequisicaoService,

        private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private authService: AuthenticationService,
    ) { }


    ngOnInit(): void {
        this.requisicoes$ = this.requisicoesService.selecionarTodos();
        this.equipamentos$ = this.equipamentoService.selecionarTodos();
        this.departamentos$ = this.departamentoService.selecionarTodos();
        this.obterFuncionarioLogado();


        this.form = this.fb.group({

            id: new FormControl(""),
            descricao: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(40)]),

            status: new FormControl(""),
            movimentacoes:new FormControl(""),
            ultimaAtualizacao :new FormControl(""),

            dataAbertura: new FormControl(""),

            departamentoId: new FormControl("", Validators.required),
            departamento: new FormControl(""),

            funcionarioId: new FormControl(""),
            funcionario: new FormControl(""),

            equipamentoId: new FormControl(""),
            equipamento: new FormControl(""),
        });


    }

    get id() { return this.form.get('id') }
    get descricao() { return this.form.get('descricao') }
    get dataAbertura() { return this.form.get('dataAbertura') }
    get departamentoId() { return this.form.get('departamentoId') }
    get departamento() { return this.form.get('departamento') }
    get funcionarioId() { return this.form.get('funcionarioId') }
    get funcionario() { return this.form.get('funcionario') }
    get equipamentoId() { return this.form.get('equipamentoId') }
    get equipamento() { return this.form.get('equipamento') }
    get tituloModal() { return (this.id?.value) ? "Atualização" : "Cadastro"; }


    public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
        this.form.reset();

        if (requisicao) {

            const departamento = requisicao.departamento ? requisicao.departamento : null;
            const equipamento = requisicao.equipamento ? requisicao.equipamento : null;
            const funcionario = requisicao.funcionario ? requisicao.funcionario : null;

            const requisicaoCompleta = {
                ...requisicao,
                departamento,
                equipamento,
                funcionario,
            }

            this.form.setValue(requisicaoCompleta);

        }

        try {
            await this.modalService.open(modal).result;

            if (this.form.valid) {
                if (requisicao) await this.requisicoesService.editar(this.pegarDadosRequisicaoEdicao(requisicao));
                else await this.requisicoesService.inserir(this.pegarDadosRequisicaoCriacaoNovo())
                this.menssagemSucesso();

            } else {
                this.menssagemErro();
            }
        } catch (err) {
            console.log(err);
            this.menssagemErro();
        }
    }

    public obterFuncionarioLogado() {

        this.authService.usuarioLogado.subscribe(dados => {
            let email = dados?.email;
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


    pegarDadosRequisicaoCriacaoNovo(): Requisicao {
        let resultado = this.form.value
        resultado.funcionarioId = this.funcionarioLogado.id;
        resultado.funcionario = this.funcionarioLogado;
        resultado.dataAbertura = new Date(Date.now()).toLocaleDateString();
        resultado.status = "Aberta";
        resultado.ultimaAtualizacao = resultado.dataAbertura;
        let aux: Movimentacao[]  = [];
        resultado.movimentacoes =  aux;

        return resultado;
    }


    pegarDadosRequisicaoEdicao(requisicao: Requisicao | undefined): Requisicao|undefined {
        const dados = this.form;
        if (requisicao != null) {
            requisicao.departamentoId = dados.get('departamentoId')?.value;
            requisicao.descricao = dados.get('descricao')?.value
            requisicao.equipamentoId = dados.get('equipamentoId')?.value
            return requisicao;
        }

        return undefined;
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

    public excluir(requisicao: Requisicao) {
        this.requisicoesService.excluir(requisicao);
    }

}
