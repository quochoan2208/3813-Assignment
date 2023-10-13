import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { UploadimageComponent } from './uploadimage/uploadimage.component';


const routes: Routes = [{path: 'login',component: LoginComponent},{path: 'account',component: AccountComponent},{path: 'profile',component: ProfileComponent}, {path: 'home',component: HomeComponent}, ]

@NgModule({
    declarations: [
        AppComponent,
        AccountComponent,
        UploadimageComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        HttpClientModule,
        HomeComponent,
        LoginComponent
    ]
})
export class AppModule { }
