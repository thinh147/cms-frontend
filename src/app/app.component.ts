import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { STORAGE_KEY } from './constant/constant';
import { SubjectService } from './services/subject.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  fullLoading: boolean = false;
  constructor(
    private subjectService: SubjectService,
    private cookieService: CookieService,
    private router:Router
  ) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subjectService.fullLoading.subscribe((res: boolean) => {
      this.fullLoading = res;
    })
    if (!this.subjectService.userInfo.getValue() && this.cookieService.get(STORAGE_KEY.USER_INFO)) {
      this.subjectService.userInfo.next(JSON.parse(this.cookieService.get(STORAGE_KEY.USER_INFO)));
      setTimeout(() => {
        if(!window.location.pathname || window.location.pathname === '/') {
          this.router.navigateByUrl('/ideas').then(res => console.log('routing'));
        }
      }, 300);
    }

  }
}
