import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './service/equipamento.service';

import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-equipamento',
    templateUrl: './equipamento.component.html'
})
export class EquipamentoComponent implements OnInit {

    public equipamentos$: Observable<Equipamento[]>;
    public form: FormGroup;

    constructor(
        private equipamentoService: EquipamentoService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private currencyPipe: CurrencyPipe,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.equipamentos$ = this.equipamentoService.selecionarTodos();
        this.form = this.fb.group({
            id: new FormControl(""),
            nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
            numeroSerie: new FormControl("",[Validators.required, Validators.minLength(5)]),
            preco: ['', Validators.required],
            dataFabricacao: new FormControl("", Validators.required)
        })

        //user pipe to display currency
        this.form.valueChanges.subscribe(myForm => {
            if (myForm.preco) {
                this.form.patchValue({
                    preco: this.currencyPipe.

                        transform(myForm.preco.replace(/\D/g, '').replace(/^0+/, ''), 'BRL', 'symbol', '1.0-0')
                }, { emitEvent: false });
            }
        });
    }

    get id() { return this.form.get('id') }
    get nome() { return this.form.get('nome') }
    get numeroSerie() { return this.form.get('numeroSerie') }
    get preco() { return this.form.get('preco') }
    get dataFabricacao() { return this.form.get('dataFabricacao') }
    get tituloModal() { return (this.id?.value) ? "Atualiza????o" : "Cadastro"; }

    public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
        this.form.reset();

        if (equipamento) {
            this.form.setValue(equipamento);
        }

        try {
            await this.modalService.open(modal).result;

            if (this.form.valid) {
                if (equipamento) await this.equipamentoService.editar(this.form.value);
                else await this.equipamentoService.inserir(this.form.value);

                this.mensagemSucesso();
            } else {
                this.menssagemErro();
            }

        } catch (err) {
            this.menssagemErro();
        }
    }
    private mensagemSucesso() {
        this.toastr.success("Registro Salvo.", "Success",
            {
                timeOut: 2000,
                closeButton: true,
                disableTimeOut: false,
                tapToDismiss: true,
                progressBar: true
            })
    }
    public excluir(equipamento: Equipamento) {
        this.equipamentoService.excluir(equipamento);
    }

    private menssagemErro() {
        this.toastr.warning("N??o foi possival salvar o registro.", "Falhar",
            {
                timeOut: 2000,
                closeButton: true,
                disableTimeOut: false,
                tapToDismiss: true,
                progressBar: true
            })
    }
}
