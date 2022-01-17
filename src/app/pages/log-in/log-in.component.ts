import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NavbarService } from 'src/app/components/navbar/navbar.service';


import Swal from 'sweetalert2'
import { SweetAlertsService } from 'src/app/components/sweetAlerts/sweet-alerts.service';



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  loginForm!: FormGroup
  constructor( private formBuilder: FormBuilder,
               private userService: UserService,
               private navbarService: NavbarService,
               private route: Router,
               private sweetAlert: SweetAlertsService ) { 
    this.buildForm();
  }

  ngOnInit(): void {
    document.getElementById('inputEmail')?.focus();
  }


  buildForm(){
    this.loginForm = this.formBuilder.group({
      email:[ '', [Validators.email,Validators.required]],
      password: [ '', Validators.required]
    })
  }
  

  submit(){
    if (this.loginForm.valid){
      let data = {
        email : this.loginForm.controls["email"].value,
        password: this.loginForm.controls["password"].value
      }
      this.userService.login(data).subscribe(
        (res:any)=>{
          console.log(res); 
          if(res.message === "Credenciales Invalidas"){
            Swal.fire({
              title: 'Error!',
              text: 'Usuario o contraseña incorrectas',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            }).then((result) =>{
              if(result.isConfirmed){
                setTimeout(() => {
                  document.getElementById('inputEmail')?.focus();  
                }, 500);
              }
            })
          }else{
            localStorage.setItem('token',res.access_token)
            localStorage.setItem('rol',res.user.id_rol)
            this.route.navigate(['/main']);
            this.navbarService.userIsLogged(true);
          }

          
        },
        err=>{
          this.sweetAlert.mostrarMensajeError(
            'Ocurrió un problema de conexión'
          )
        }
      )
      return
    }
    console.error("Hay errores en el formulario")

  }

}
