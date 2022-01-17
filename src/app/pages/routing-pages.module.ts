import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LogInComponent } from "./log-in/log-in.component";
import { MainComponent } from "./main/main.component";

import { AuthGuard } from "../shared/guards/auth.guard";
import { ProfesoresComponent } from "./profesores/profesores.component";
import { AlumnosComponent } from "./alumnos/alumnos.component";

const routes: Routes = [
  {
    path:'',
    children: [
      {
        path:'main',
        component: MainComponent
      },
      {
        path: 'logIn',
        component: LogInComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profesores',
        component: ProfesoresComponent,
      },
      {
        path: 'alumnos',
        component: AlumnosComponent,
      },
      {
        path: '**',
        component: MainComponent,
      }
    ]
  }
]


@NgModule({
  declarations: [],
  imports: [
      RouterModule.forChild(routes)
  ]
})


export class RoutingPagesModule { }
