import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { EquipamentoService } from 'src/app/equipamentos/service/equipamento.service';
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
        this.requisicoes$ = this.requisicoesService.selecionarTodos();
        let asd: Movimentacao[] = []
        asd.length
    }

}
