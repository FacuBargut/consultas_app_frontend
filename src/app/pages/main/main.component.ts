import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import allLocales from '@fullcalendar/core/locales-all';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent{

  Events:any = [
    {
      start: '2014-11-03T10:00:00',
      end: '2014-11-03T16:00:00',
      display: 'background'
    }
  ];
  calendarOptions?: CalendarOptions;
  

  onDateClick(res: { dateStr: string; }) {
    alert('Clicked on date : ' + res.dateStr)
  }

  constructor(private httpClient: HttpClient) {}

  ngOnInit(){

    this.calendarOptions = {
      plugins: [ timeGridPlugin ],
      dateClick: this.onDateClick.bind(this),
      initialView: 'timeGridWeek',
      hiddenDays: [ 0, 6 ],
      slotMinTime: "07:00:00",
      slotMaxTime: "23:00:00",
      locales: allLocales,
      allDaySlot: false,
      
      titleFormat: { // will produce something like "Tuesday, September 18, 2018"
        // year: '2-digit',
        // hour:'2-digit',
        // minute: '2-digit',
        // hour12: true,
      },
      eventTimeFormat:{
        hour12:true
      }
      
    }

    // setTimeout(() => {
    //   let calendarEvent = [
    //     {
    //       title: 'Event name',
    //       // start: '2021-04-11'
    //     }
    //   ]
    //   this.Events.push(calendarEvent);
    //   console.log(this.Events);

    // }, 2200);

    // setTimeout(() => {
    //   console.log("sdads")
    //   this.calendarOptions = {
    //     // initialView: 'basicWeek',
    //     // dateClick: this.onDateClick.bind(this),
    //     // events: this.Events,
    //     // plugins: [ timeGridPlugin ],
        
    //   };
    // }, 2500);
        
    }  

}
