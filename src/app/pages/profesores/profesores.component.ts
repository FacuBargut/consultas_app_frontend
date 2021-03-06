import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import {NgbModal, ModalDismissReasons, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent implements OnInit {

  profesorForm: FormGroup

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              config: NgbModalConfig,
              private activatedRoute: ActivatedRoute) {


              config.backdrop = 'static';
              config.keyboard = false;

              this.profesorForm = this.formBuilder.group({
                id: [''],
                nombre:[ '', [Validators.required]],
                apellido: [ '', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['',]
              })

               }

  profesores : User[] = []
  btnAgregarProfesor = false;
  closeResult = '';
  tituloModal = "";
  page:number = 1;
  modoEdicion:boolean = false;
  lastPageButton: boolean = false;
  prevPageButton: boolean = false;
  links: any[] = [];


  ngOnInit(): void {
    this.getProfesoresPage(1);
  }

  getProfesoresPage(page:number){
    this.userService.getProfesoresPage(page).subscribe(
      (res:any)=>{
        console.log(res)
        this.profesores = res.data;
        this.btnAgregarProfesor = true;
        this.page = res.current_page;
        this.obtenerBotonera(res.links)
        this.validarBotones(res.prev_page_url,res.next_page_url);
      },
      err=>{
        console.log(err)
      }
    )
  }
  
  editarProfesor(profesor: User){
    this.modoEdicion = true;
    this.profesorForm.patchValue(profesor)
  }

  gestionarProfesor(modo:boolean){
    let oProfesor ={
      id: this.profesorForm.controls['id'].value,
      nombre: this.profesorForm.controls['nombre'].value,
      apellido: this.profesorForm.controls['apellido'].value,
      email: this.profesorForm.controls['email'].value,
      password: this.profesorForm.controls['password'].value,
      id_rol: 2
    }
    if(modo === false){
      this.userService.agregarProfesor(oProfesor).subscribe(
        res=>{
          if(res.status == 201){
              if(this.profesores.length === 5){
                this.getProfesoresPage(this.page + 1)
              }else{
                this.getProfesoresPage(this.page)
              }
              this.modalService.dismissAll();
          }
        },
        error=>{
          Swal.fire({
            title: 'Error inesperado',
            text: `Ocurri?? el siguiente error: ${error}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
    
            }
          })
        }
      )
    }else{
      delete oProfesor.password;
      console.log(oProfesor)
      this.userService.editarProfesor(oProfesor.id,oProfesor).subscribe(
        res=>{
          console.log(res)
          this.modalService.dismissAll();
          this.getProfesoresPage(this.page);
        },
        error=>{
          Swal.fire({
            title: 'Error inesperado',
            text: `Ocurri?? el siguiente error: ${error}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
    
            }
          })
        }
      )
    }
  }

  eliminarProfesor(profesor:User){
      Swal.fire({
        title: 'Eliminar profesor!',
        text: `Quiere eliminar al profesor ${profesor.nombre} ${profesor.apellido}? `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {

          this.userService.eliminarProfesor(profesor.id).subscribe(
            res =>{
              Swal.fire(
                'Eliminado',
                `El profesor ${profesor.nombre} ${profesor.apellido} fue eliminado `,
                'success'
              )
              
              if(this.profesores.length === 1){
                this.getProfesoresPage(this.page - 1);
              }else{
                this.getProfesoresPage(this.page);
              }
            },
            error =>{
              console.log(error)
            }
          )

        }
      })
  }

  open(content:any, profesor?:any) {
    this.profesorForm.reset();
    this.profesorForm.updateValueAndValidity();
    this.modoEdicion = false;
    setTimeout(() => {
      document.getElementById('input_nombre')?.focus();
    }, 500);

    this.tituloModal = "Agregar profesor";
    this.profesorForm.setValue({
      id: '',
      nombre: '',
      apellido: '',
      email: '',
      password: ''
    })
    if(profesor !== undefined){
      this.tituloModal = "Editar profesor";
      this.editarProfesor(profesor);
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    console.log(this.modoEdicion)
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  obtenerBotonera(links:any){
    this.links = [];
    this.links = links;
    this.links.shift()
    this.links.pop();
  }

  validarBotones(prev_page_url:string,next_page_url: string){
    if(next_page_url === null){
      this.lastPageButton = false;
    }else{
      this.lastPageButton = true;
    }
    if(prev_page_url === null){
      this.prevPageButton = false
    }else{
      this.prevPageButton = true
    }
  }
}
