import { Component, OnInit } from '@angular/core';
import { FactoryService } from '../factory.service';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-signupcomponent',
  templateUrl: './signupcomponent.component.html',
  styleUrls: ['./signupcomponent.component.css']
})
export class SignupcomponentComponent implements OnInit {
  eMail: any;
  pwd: any;
  rept_pwd: any;
  err: any;
  constructor(public factoryService: FactoryService) { }

  ngOnInit() {
  }

  signup(){
    const data = {
      user: this.eMail,
      pwd: this.pwd
    }
    this.factoryService.signup_service(data)
    .subscribe((res: any)=>{
      console.log(res);
      if(res.success){

      } else {
        this.err = res.msg;
      }
    })
  }

}
