import { Component, Input, OnInit } from '@angular/core';
import { Requisicao } from '../../models/requisicao.model';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html'
})
export class ViewComponent  {

    @Input() requisicaoAux: Requisicao;



}
