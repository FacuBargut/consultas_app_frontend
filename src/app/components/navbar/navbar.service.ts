import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

    isLogged = false;

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    userIsLogged(res:boolean){
        this.isLogged = res;
        this.change.emit(this.isLogged)
    }


}
