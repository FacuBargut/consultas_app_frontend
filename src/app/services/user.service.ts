import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../interfaces/user'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userData$?: boolean = false;

  private apiUrl = "http://127.0.0.1:8000/api/"

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Autorization': `Bearer ${localStorage.getItem('token')} `
    }),
    // responseType: 'text' as 'json'
 }


  constructor( private httpClient: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl + 'usuarios')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getProfesores(){
    return this.httpClient.get(this.apiUrl + 'usuarios/docentes')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAlumnos(){
    return this.httpClient.get(this.apiUrl + 'usuarios/alumnos')
    .pipe(
      catchError(this.errorHandler)
    )
  }


  getProfesoresPage(page:number){
    return this.httpClient.get(this.apiUrl + 'usuarios/docentes?page='+page)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAlumnosPage(page:number){
    return this.httpClient.get(this.apiUrl + 'usuarios/alumnos?page='+page)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  login(data: any): Observable<User>{
    return this.httpClient.post<User>(this.apiUrl + 'user/login', JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
      
    )
  }

  agregarProfesor(profesor:any): Observable<any>{
    return this.httpClient.post<User>(this.apiUrl + 'usuarios', JSON.stringify(profesor), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  agregarAlumno(alumno:any): Observable<any>{
    return this.httpClient.post<User>(this.apiUrl + 'usuarios', JSON.stringify(alumno), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  editarProfesor(id:number, profesor:any): Observable<any>{
    return this.httpClient.put<User>(this.apiUrl + `usuarios/${id}`, JSON.stringify(profesor), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  editarAlumno(id:number, alumno:any): Observable<any>{
    return this.httpClient.put<User>(this.apiUrl + `usuarios/${id}`, JSON.stringify(alumno), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  eliminarProfesor(id:number){
    return this.httpClient.delete<User>(this.apiUrl + `usuarios/${id}`, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  eliminarAlumno(id:number){
    return this.httpClient.delete<User>(this.apiUrl + `usuarios/${id}`, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  isLoggedIn():boolean{
    if(localStorage.getItem('token') && localStorage.getItem('token') !== undefined ){
      return false
    }
    return true
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
