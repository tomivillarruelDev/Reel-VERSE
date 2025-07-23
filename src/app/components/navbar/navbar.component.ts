import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isScrolled: boolean = false;

  public sectionTitle: string = '';

  constructor( private router: Router,
               private titleService: Title ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter( event => event instanceof NavigationEnd )
    ).subscribe( event => {
      if( this.router.url === '/movies' ){
        this.sectionTitle = 'Películas';
      } else if( this.router.url === '/series' ){
        this.sectionTitle = 'Series';
      } else {
        this.sectionTitle = '';
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 260;
  }

  public goToSearch(){
    this.router.navigateByUrl('/search');

  }


}
