import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupcomponentComponent } from './signupcomponent/signupcomponent.component';
import { ForgotComponent } from './forgot/forgot.component';
import { FactoryService } from './factory.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './authguard.service';


const appRoutes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupcomponentComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // HttpClientInMemoryWebApiModule,
    SignupcomponentComponent,
    ForgotComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } 
    )
  ],
  providers: [FactoryService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
