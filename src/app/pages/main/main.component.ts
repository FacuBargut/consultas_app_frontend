import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import allLocales from '@fullcalendar/core/locales-all';
import * as XLSX from 'xlsx'

import {NgbModal, ModalDismissReasons, NgbModalConfig, } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from './main.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent{
  closeResult = '';
  permission: any;
  data!: [any][any];
  
  

  calendarOptions?: CalendarOptions;
  public events: any[] | undefined;
  

  onDateClick(res: { dateStr: string; }) {
    alert('Clicked on date : ' + res.dateStr)
  }



  constructor(private httpClient: HttpClient,
              private modalService: NgbModal,
              private mainService: MainService) {}
  
  @ViewChild('content') content! : ElementRef;


  ngOnInit(){
    this.permission = localStorage.getItem('rol');
    console.log(this.permission)
    this.calendarOptions = {
      plugins: [ timeGridPlugin ],
      dateClick: this.onDateClick.bind(this),
      eventClick: this.openModal.bind(this),
      eventMouseEnter:function(data){
        // console.log(data)
      },
      hiddenDays: [ 0, 6 ],
      slotMinTime: "07:00:00",
      slotMaxTime: "23:00:00",
      locales: allLocales,
      allDaySlot: false,
      height: "auto",
      themeSystem: 'bootstrap',
      eventTimeFormat:{
        hour12:true
      },

      eventSources: [
        {
          events:[ 

            {
              title  : 'event1',
              start  : '2021-12-28'
            },
            {
              title  : 'Matemática Discreta',
              start  : '2021-12-29T12:00:00',
              end    : '2021-12-29T14:00:00',
            },
            {
              title  : 'event3',
              start  : '2021-12-30T12:30:00',
              allDay : false 
            }
          ],
          color: 'black',
          textColor: 'yellow'

        }
        ]
        
    }
  }  

  onFileChange(evt: any){
    const target: DataTransfer = <DataTransfer>(evt.target);
    if(target.files.length !== 1) throw new Error('No se puede usar multiples archivos')

    const reader: FileReader = new FileReader();

    reader.onload = (e:any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary'})
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = (XLSX.utils.sheet_to_json(ws, {header:1}))
      console.log(this.data);
    }

    reader.readAsBinaryString(target.files[0]);
  }

  cargarHorarios():void{
    let consultas: any[] = [];
    let index = 0;

    for(let consulta of this.data){
      if(consulta.length != 0){
        if(index != 0){

          let obj = {
            nombre: consulta[0],
            apellido: consulta[1],
            mail: consulta[2],
            dia: consulta[3],
            hora_inicio: consulta[4],
            hora_fin: consulta[5]
          }
          consultas.push(obj);
        }
      }
      index ++
    }
    console.log(consultas)

    this.mainService.cargarHorarios(consultas).subscribe(
      res=>{
        console.log(res)
      },
      err=>{
        console.log(err)
      }
    )
  }


  openModal() {
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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



}
