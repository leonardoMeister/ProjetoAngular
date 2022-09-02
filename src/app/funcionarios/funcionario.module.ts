import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { ToastrModule } from 'ngx-toastr';
import { FuncionarioComponent } from './funcionario.component';
import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    FuncionarioComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FuncionarioRoutingModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    NgSelectModule
  ],
    providers:
     [CurrencyPipe]

})

export class FuncionarioModule { }
