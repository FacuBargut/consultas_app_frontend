import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  public userData$?: boolean = false;

  private apiUrl = "http://127.0.0.1:8000/api/"

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Autorization': `Bearer ${localStorage.getItem('token')} `
    }),

 }


  constructor( private httpClient: HttpClient) { }

 
  cargarHorarios(consultas: any):Observable<any>{
    return this.httpClient.post<any>(this.apiUrl + 'consultas', JSON.stringify(consultas), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }


}
