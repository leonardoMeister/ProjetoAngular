import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipamentoRoutingModule } from './equipamento-routing.module';
import { EquipamentoComponent } from './equipamento.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    EquipamentoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    EquipamentoRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [CurrencyPipe]
})
export class EquipamentoModule { }
