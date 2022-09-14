import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { RequisicaoComponent } from './requisicao.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequisicoesFuncionarioComponent } from './requisicoes-funcionario/requisicoes-funcionario.component';
import { RequisicoesDepartamentoComponent } from './requisicoes-departamento/requisicoes-departamento.component';
import { ViewComponent } from './requisicoes-departamento/view/view.component';


@NgModule({
    declarations: [
        RequisicaoComponent,
        RequisicoesFuncionarioComponent,
        RequisicoesDepartamentoComponent,
        ViewComponent
    ],
    imports: [
        CommonModule,
        RequisicaoRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        NgSelectModule
    ],
    providers:
        [CurrencyPipe]
})
export class RequisicaoModule { }
