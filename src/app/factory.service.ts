import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/map';
@Injectable()
export class FactoryService {

  constructor(public http: Http) { }

  login_service(...args){
    console.log(args);
    const data = {
      user: args[0],
      pwd:args[1]
    }
      return this.http.post('/login/signin', data)
      .map((res) => res.json());
  }
  forgot_service(data){
    return this.http.put('login/forgot_pwd', data)
    .map((res)=>res.json())
  }
  otp_generate_service(data){
    return this.http.post('login/otp_gen', data)
    .map((res)=>res.json())
  }
  otp_verify_service(data){
    return this.http.post('login/otp_verify', data)
    .map((res)=>res.json())
  }
  signup_service(data){
    return this.http.post('/login/signup', data)
    .map((res)=> res.json());
  }
}
