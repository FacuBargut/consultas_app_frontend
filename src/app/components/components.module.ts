import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SpinnerComponent } from './spinner/spinner.component';




@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot()
  ],
  exports:[
    SpinnerComponent
  ]
})
export class ComponentsModule { }
