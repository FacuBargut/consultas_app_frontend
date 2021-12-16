import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';


//Modulos
import { RoutingPagesModule } from './routing-pages.module';
import { ComponentsModule } from '../components/components.module';

//Componentes
import { LogInComponent } from './log-in/log-in.component';
import { MainComponent } from './main/main.component';
import { ProfesoresComponent } from './profesores/profesores.component';

//Modulos para el calendario
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    LogInComponent,
    MainComponent,
    ProfesoresComponent
  ],
  imports: [
    CommonModule,
    RoutingPagesModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModalModule,
    FormsModule,
    FullCalendarModule,
    ComponentsModule,
    NgbModule
  ]
})
export class PagesModule { }
