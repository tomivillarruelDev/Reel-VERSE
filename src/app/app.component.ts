import { Component, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { Observable } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'reelVERSE';

  isLoading: Observable<boolean>;

  constructor( private loadingService: LoadingService,
               private router: Router) {
    this.isLoading = this.loadingService.isLoading;
    
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart){
        window.scrollTo(0,0);
      }
    })
  }

}
