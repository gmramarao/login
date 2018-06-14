import { Component, OnInit } from '@angular/core';
import { FactoryService } from '../factory.service';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  eMail: any;
  pwd: any;
  rpt_pwd: any;
  otp: any;
  err: any;
  otp_verfy: Boolean;
  res: any;
  constructor(public factoryService: FactoryService) { }

  ngOnInit() {
  }
  gen_otp(){
    const data = {
      user: this.eMail
    }
    this.factoryService.otp_generate_service(data)
    .subscribe((res)=>{
      console.log(res);
      if(res.success){
        // this.otp = res.otp;
        this.err= '';
        this.res = 'OTP set to your email';
      } else {
        this.err = res.msg;
      }
    })
  }
  verf_otp(){
    const data = {
      otp: this.otp,
      user: this.eMail
    }
    this.factoryService.otp_verify_service(data)
    .subscribe((res: any)=>{
      console.log(res);
      if(res.success){
        this.otp_verfy = true;
      } else {
        this.err = res.err;
      }
    })
  }
  forgot_pwd(){
    const data = {
      user: this.eMail,
      pwd: this.pwd
    }
    this.factoryService.forgot_service(data)
    .subscribe((res: any)=>{
      console.log(res);
      if(res.success){
        // setTimeout(()=>{

        // }, 200);

      } else {
        this.err = res.err;
      }
    })
  }

}
