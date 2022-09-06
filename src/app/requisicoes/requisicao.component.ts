import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/service/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
    selector: 'app-requisicao',
    templateUrl: './requisicao.component.html'
})
export class RequisicaoComponent implements OnInit {

    public funcionarios$: Observable<Funcionario[]>;
    public departamentos$: Observable<Departamento[]>;
    public equipamentos$: Observable<Equipamento[]>;
    public requisicoes$: Observable<Requisicao[]>;

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

        this.form = this.fb.group({

            id: new FormControl(""),
            descricao: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(40)]),

            dataAbertura: new FormControl(""),

            departamentoId: new FormControl("", Validators.required),
            departamento: new FormControl(""),

            funcionarioId: new FormControl(""),
            funcionario: new FormControl(""),

            equipamentoId: new FormControl(""),
            equipamento: new FormControl(""),
        });

        this.equipamentos$ = this.equipamentoService.selecionarTodos();
        this.funcionarios$ = this.funcionarioService.selecionarTodos();
        this.departamentos$ = this.departamentoService.selecionarTodos();
        this.obterFuncionarioLogado();
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

    public funcionarioLogado: Funcionario;

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
                funcionario
            }

            this.form.setValue(requisicaoCompleta);
        }

        try {

            this.pegarRegistroFuncionario();
            await this.modalService.open(modal).result;



            if (this.form.valid) {

                const requisicaoFinal = this.pegarDadosRequisicao();

                if (requisicao) await this.requisicoesService.editar(requisicaoFinal);
                else this.requisicoesService.inserir(requisicaoFinal)

                this.menssagemSucesso();
            } else {
                this.menssagemErro();
            }

        } catch (err) {
            this.menssagemErro();
        }
    }
    private emailOficial?: string | null | undefined;

    public obterFuncionarioLogado() {

        this.authService.usuarioLogado.subscribe(dados => {
            let email = dados?.email;
            this.emailOficial = email;
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
    pegarRegistroFuncionario() {
        alert("funcio")
        alert(this.funcionarioLogado.email)
        alert(this.emailOficial)

    }


    pegarDadosRequisicao(): Requisicao {
        const dados = this.form.value;

        const data = new Date(Date.now());

        const funcionario = this.pegarRegistroFuncionario();
        console.log(funcionario)


        return dados;
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


