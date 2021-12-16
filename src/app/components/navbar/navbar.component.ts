import { Component, OnInit } from '@angular/core';
import { NavbarService } from './navbar.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( private navbarService:NavbarService) { }
  loggedIn = false;
  permission: any;

  ngOnInit(): void {
    this.navbarService.change.subscribe(
      res =>{
        this.loggedIn = res
      }
      )
    this.permission = localStorage.getItem('rol');
    console.log(this.permission)
    this.loggedIn = localStorage.getItem('token') !== null;
    
  }


  toggleHamburguer(){
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    hamburger!.classList.toggle("active");
    navMenu!.classList.toggle("active");
  }

  logOut(){
     localStorage.removeItem('token');
     localStorage.removeItem('rol');
     this.toggleHamburguer();
     this.loggedIn = false;
  }


}
