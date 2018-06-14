import { Component, OnInit } from '@angular/core';
import { FactoryService } from '../factory.service';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public factoryService : FactoryService, public router: Router) { }
  user_name: any;
  pwd: any;
  ngOnInit() {
    localStorage.clear();
  }

  login(): void{
    console.log(this.user_name);
    console.log(this.pwd);
    this.factoryService.login_service(this.user_name, this.pwd)
    .subscribe(result => {
      console.log(result);
      if(result.success){
        localStorage.setItem('token', result.token);
        this.router.navigate(['/dashboard']);
      } else {

      }
    });
  }

}
