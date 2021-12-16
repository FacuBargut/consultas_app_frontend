import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import {NgbModal, ModalDismissReasons, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { textChangeRangeIsUnchanged } from 'typescript';

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
              config: NgbModalConfig) {


              config.backdrop = 'static';
              config.keyboard = false;

              this.profesorForm = this.formBuilder.group({
                nombre:[ '', [Validators.required]],
                apellido: [ '', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required]]
              })

               }

  profesores : User[] = []
  btnAgregarProfesor = false;
  closeResult = '';
  tituloModal = "";
  page:number = 1;
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
    this.profesorForm.patchValue(profesor)
  }

  agregarProfesor(){
    let newProfesor ={
      nombre: this.profesorForm.controls['nombre'].value,
      apellido: this.profesorForm.controls['apellido'].value,
      email: this.profesorForm.controls['email'].value,
      password: this.profesorForm.controls['password'].value,
      id_rol: 2
    }
    this.userService.agregarProfesor(newProfesor).subscribe(
      res=>{
        if(res.status == 201){
        }
      }
    )
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
              console.log(res)
              Swal.fire(
                'Eliminado',
                `El profesor ${profesor.nombre} ${profesor.apellido} fue eliminado `,
                'success'
              )
              this.getProfesoresPage(this.page);
            },
            error =>{
              console.log(error)
            }
          )

        }
      })
  }

  open(content:any, profesor?:any) {
    console.log("Modal abierto")
    this.profesorForm.reset();



    this.profesorForm.updateValueAndValidity();
    setTimeout(() => {
      document.getElementById('input_nombre')?.focus();
    }, 500);

    this.tituloModal = "Agregar profesor";
    this.profesorForm.setValue({
      nombre: '',
      apellido: '',
      email: '',
      password: ''
    })
    if(profesor !== undefined){
      this.tituloModal = "Editar profesor";
      this.editarProfesor(profesor)
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
    console.log(prev_page_url)
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
