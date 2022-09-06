import { CurrencyPipe } from "@angular/common";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { AuthenticationService } from "../auth/services/authentication.service";
import { Departamento } from "../departamentos/models/departamento.model";
import { DepartamentoService } from "../departamentos/services/departamento.service";
import { Funcionario } from "./models/funcionario.model";
import { FuncionarioService } from "./services/funcionario.service";

@Component({
    selector: 'app-funcionario',
    templateUrl: './funcionario.component.html'
})

export class FuncionarioComponent implements OnInit {

    public funcionarios$: Observable<Funcionario[]>;
    public departamentos$: Observable<Departamento[]>;
    public form: FormGroup;

    constructor(
        private funcionarioService: FuncionarioService,
        private departamentoService: DepartamentoService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private authService: AuthenticationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            funcionario: new FormGroup({
                id: new FormControl(""),
                nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
                email: new FormControl("", [Validators.required, Validators.email]),
                funcao: new FormControl("", [Validators.required, Validators.minLength(5)]),
                departamentoId: new FormControl("", Validators.required),
                departamento: new FormControl("")
            }),
            senha: new FormControl("")
        });

        this.funcionarios$ = this.funcionarioService.selecionarTodos();

        this.departamentos$ = this.departamentoService.selecionarTodos();
    }
    public removerSenha(){
        this.senha?.removeValidators([Validators.required, Validators.minLength(8)])
    }

    public adicionarSenha(){
        this.senha?.addValidators([Validators.required, Validators.minLength(8)])
    }


    get id() { return this.form.get('funcionario.id') }
    get nome() { return this.form.get('funcionario.nome') }
    get email() { return this.form.get('funcionario.email') }
    get funcao() { return this.form.get('funcionario.funcao') }
    get departamentoId() { return this.form.get('funcionario.departamentoId') }
    get departamento() { return this.form.get('funcionario.departamento') }
    get senha() { return this.form.get('senha') }
    get tituloModal() { return (this.id?.value) ? "Atualização" : "Cadastro"; }

    public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
        this.form.reset();

        if (funcionario) {
            const departamento = funcionario.departamento ? funcionario.departamento : null;
            const funcionarioDepartamento = {
                ...funcionario,
                departamento
            }
            this.form.get("funcionario")?.setValue(funcionarioDepartamento);
            this.removerSenha();
        }else this.adicionarSenha();

        try {


            await this.modalService.open(modal).result;

            if (this.form.valid) {
                if (funcionario) await this.funcionarioService.editar(this.form.get("funcionario")?.value);
                else {
                    await this.authService.cadastrar(this.email?.value, this.senha?.value)

                     this.funcionarioService.inserir(this.form.get("funcionario")?.value)
                        .then(() => {
                            this.authService.logout();
                            this.router.navigate(["/login"])
                        });

                }

                this.menssagemSucesso();
            } else {
                this.menssagemErro();
            }

        } catch (err) {
            this.menssagemErro();
        }
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

    public excluir(funcionario: Funcionario) {
        this.funcionarioService.excluir(funcionario);
    }
}
