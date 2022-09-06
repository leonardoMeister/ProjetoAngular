import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
    selector: 'app-painel',
    templateUrl: './painel.component.html',
    styleUrls: ['./painel.component.css']
})
export class PainelComponent implements OnInit, OnDestroy {

    emailUsuario?: string | null = "";
    leo?: string | null = "";
    usuarioLogado$: Subscription;

    constructor(private authService: AuthenticationService,
        private router: Router) {

    }
    ngOnDestroy(): void {
        this.usuarioLogado$.unsubscribe();
    }

    ngOnInit(): void {
         this.usuarioLogado$ =this.authService.usuarioLogado.subscribe(x => {
            this.emailUsuario = x?.email;
            this.leo = x?.uid;
        })
    }

    public sair() {
        this.authService.logout()
            .then(() => this.router.navigate(['/login']));
    }

}
