import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import {NgbModal, ModalDismissReasons, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { faTrash, faUserEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  alumnoForm: FormGroup

  constructor(
              private userService: UserService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              config: NgbModalConfig
  ) { 

              config.backdrop = 'static';
              config.keyboard = false;
              this.alumnoForm = this.formBuilder.group({
                id: [''],
                nombre:[ '', [Validators.required]],
                apellido: [ '', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['']
              })
  }
  faTrash = faTrash
  faUserEdit = faUserEdit
  alumnos : User[] = []
  btnAgregarAlumno = false;
  closeResult = '';
  tituloModal = "";
  page:number = 1;
  modoEdicion:boolean = false;
  lastPageButton: boolean = false;
  prevPageButton: boolean = false;
  total!:number;
  links: any[] = [];

  ngOnInit(): void {
    this.getAlumnosPage(1);
  }

  getAlumnosPage(page:number){
    this.userService.getAlumnosPage(page).subscribe(
      (res:any)=>{
        console.log(res)
        this.total = res.total;
        this.alumnos = res.data;
        this.btnAgregarAlumno = true;
        this.page = res.current_page;
        this.obtenerBotonera(res.links)
        this.validarBotones(res.prev_page_url,res.next_page_url);
      },
      err=>{
        console.log(err)
      }
    )
  }
  
  editarAlumno(alumno: User){
    this.modoEdicion = true;
    this.alumnoForm.patchValue(alumno)
  }

  gestionarAlumno(modo:boolean){
    let oAlumno ={
      id: this.alumnoForm.controls['id'].value,
      nombre: this.alumnoForm.controls['nombre'].value,
      apellido: this.alumnoForm.controls['apellido'].value,
      email: this.alumnoForm.controls['email'].value,
      password: this.alumnoForm.controls['password'].value,
      id_rol: 3
    }
    if(modo === false){
      this.userService.agregarAlumno(oAlumno).subscribe(
        res=>{
          console.log(res)
          if(res.status == 201){
              if(this.alumnos.length === 5){
                this.getAlumnosPage(this.page + 1)
              }else{
                this.getAlumnosPage(this.page)
              }
              this.modalService.dismissAll();
          }
        },
        error=>{
          Swal.fire({
            title: 'Error inesperado',
            text: `Ocurrió el siguiente error: ${error}`,
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
      this.userService.editarAlumno(oAlumno.id,oAlumno).subscribe(
        res=>{
          console.log(res)
          this.modalService.dismissAll();
          this.getAlumnosPage(this.page);
        },
        error=>{
          Swal.fire({
            title: 'Error inesperado',
            text: `Ocurrió el siguiente error: ${error}`,
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

  eliminarAlumno(alumno:User){
      Swal.fire({
        title: 'Eliminar alumno!',
        text: `Quiere eliminar al alumno ${alumno.nombre} ${alumno.apellido}? `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {

          this.userService.eliminarAlumno(alumno.id).subscribe(
            res =>{
              Swal.fire(
                'Eliminado',
                `El alumno ${alumno.nombre} ${alumno.apellido} fue eliminado `,
                'success'
              )
              
              if(this.alumnos.length === 1){
                this.getAlumnosPage(this.page - 1);
              }else{
                this.getAlumnosPage(this.page);
              }
            },
            error =>{
              console.log(error)
            }
          )

        }
      })
  }

  open(content:any, alumno?:any) {
    this.alumnoForm.reset();
    this.alumnoForm.updateValueAndValidity();
    this.modoEdicion = false;
    setTimeout(() => {
      document.getElementById('input_nombre')?.focus();
    }, 500);

    this.tituloModal = "Agregar alumno";
    this.alumnoForm.setValue({
      id: '',
      nombre: '',
      apellido: '',
      email: '',
      password: ''
    })
    if(alumno !== undefined){
      this.tituloModal = "Editar alumno";
      this.editarAlumno(alumno);
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
