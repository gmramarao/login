// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable'; 
// import {CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot  } from '@angular/router';
// @Injectable()
// export class AuthguardService  implements CanActivateChild  {

//   constructor(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>  { }
//   CanActivateChild(){
//     return true;
//   }
// }
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(private router: Router) {
    
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('token')) {
            return true;
        }
        else {
            this.router.navigate(['/login']);
        }
        return false;
    }

}