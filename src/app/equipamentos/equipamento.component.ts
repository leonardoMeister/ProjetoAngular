import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './service/equipamento.service';

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
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.equipamentos$ = this.equipamentoService.selecionarTodos();
        this.form = this.fb.group({
            id: new FormControl(""),
            nome: new FormControl(""),
            numeroSerie: new FormControl(""),
            preco: new FormControl(""),
            dataFabricacao: new FormControl("")
        })
    }

    get id() { return this.form.get('id') }
    get nome() { return this.form.get('nome') }
    get numeroSerie() { return this.form.get('numeroSerie') }
    get preco() { return this.form.get('preco') }
    get dataFabricacao() { return this.form.get('dataFabricacao') }
    get tituloModal() { return (this.id?.value) ? "Atualização" : "Cadastro"; }

    public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
        this.form.reset();

        if (equipamento) {
            this.form.setValue(equipamento);
        }

        try {
            await this.modalService.open(modal).result;

            if (equipamento) await this.equipamentoService.editar(this.form.value);
            else await this.equipamentoService.inserir(this.form.value);

            console.log("O equipamento foi salvo com sucesso");
        } catch (err) {
            console.log(err);
        }
    }
    public excluir(equipamento: Equipamento) {
        this.equipamentoService.excluir(equipamento);
    }
}
