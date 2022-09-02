import { CurrencyPipe } from "@angular/common";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
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
        private departamentoService:DepartamentoService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private currencyPipe: CurrencyPipe,
        private toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.funcionarios$ = this.funcionarioService.selecionarTodos();
        this.form = this.fb.group({
            id: new FormControl(""),
            nome: new FormControl("", Validators.required),
            email: new FormControl(""),
            funcao: new FormControl(""),
            departamentoId: new FormControl(""),
            departamento: new FormControl("")
        })
        this.funcionarios$ = this.funcionarioService.selecionarTodos();
        this.departamentos$ = this.departamentoService.selecionarTodos();
    }



    get id() { return this.form.get('id') }
    get nome() { return this.form.get('nome') }
    get email() { return this.form.get('email') }
    get funcao() { return this.form.get('funcao') }
    get departamentoId() { return this.form.get('departamentoId') }
    get departamento() { return this.form.get('departamento') }
    get tituloModal() { return (this.id?.value) ? "Atualização" : "Cadastro"; }

    public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
        this.form.reset();

        if (funcionario) {
            const departamento = funcionario.departamento ? funcionario.departamento : null;
            const funcionarioDepartamento = {
                ...funcionario,
                departamento
            }

            this.form.setValue(funcionarioDepartamento);
        }

        try {
            await this.modalService.open(modal).result;

            if (this.form.valid) {
                if (funcionario) await this.funcionarioService.editar(this.form.value);
                else await this.funcionarioService.inserir(this.form.value);

                this.toastr.success("Registro Salvo.", "Success",
                    {
                        timeOut: 2000,
                        closeButton: true,
                        disableTimeOut: false,
                        tapToDismiss: true,
                        progressBar: true
                    })
            } else {
                this.toastr.warning("Não foi possival salvar o registro.", "Falha",
                    {
                        timeOut: 2000,
                        closeButton: true,
                        disableTimeOut: false,
                        tapToDismiss: true,
                        progressBar: true
                    })
            }

        } catch (err) {
            console.log(err);
        }
    }

    public excluir(funcionario: Funcionario) {
        this.funcionarioService.excluir(funcionario);
    }
}
