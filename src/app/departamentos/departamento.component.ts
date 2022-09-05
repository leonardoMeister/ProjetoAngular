import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Departamento } from './models/departamento.model';
import { DepartamentoService } from './services/departamento.service';

@Component({
    selector: 'app-departamento',
    templateUrl: './departamento.component.html'
})
export class DepartamentoComponent implements OnInit {

    public departamentos$: Observable<Departamento[]>;
    public form: FormGroup;

    constructor(private departamentoService: DepartamentoService,
        private fb: FormBuilder,
        private modalService: NgbModal) {

    }

    ngOnInit(): void {
        this.departamentos$ = this.departamentoService.selecionarTodos();
        this.form = this.fb.group({
            id: new FormControl(""),
            nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
            telefone: new FormControl("", [Validators.required])
        });


    }

    get nome() {
        return this.form.get('nome')
    }
    get telefone() {
        return this.form.get('telefone')
    }
    get tituloModal() {
        return (this.id?.value) ? "Atualização" : "Cadastro";
    }
    get id() {
        return this.form.get("id");
    }

    public async gravar(modal: TemplateRef<any>, departamento?: Departamento) {

        this.form.reset();

        if (departamento) {
            this.form.setValue(departamento);
        }

        try {

            await this.modalService.open(modal).result;

            if (this.form.valid) {

                if (departamento) await this.departamentoService.editar(this.form.value);
                else await this.departamentoService.inserir(this.form.value);

                console.log("O departamento foi salvo com sucesso!");
            }else{
                
            }


        } catch (err) {

        }
    }
    public excluir(registro: Departamento) {
        this.departamentoService.excluir(registro);
    }
}
