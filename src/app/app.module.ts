import { ProgressBarModule } from 'primeng/progressbar';

import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterModule, Route } from '@angular/router';
import { TestComponent } from './pages/test/test.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { PagesComponent } from './pages/pages/pages.component';
import { PagesRoutingComponent } from './pages/pages-routing/pages-routing.component';
import { RegisterPersonComponent } from './pages/menu/personas/registrarPersona/registrarPersona.component';
import { ViewPersonsComponent } from './pages/menu/personas/verPersona/verPersona.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ContactsPersonComponent } from './pages/menu/personas/contactoPersona/contactoPersona.component';
import { TipoPersonaComponent } from './pages/menu/configuraciones/catalogos/tipo-persona/tipo-persona.component';
import { NgLetModule } from 'ng-let';
import { TipoProcesoComponent } from './pages/menu/configuraciones/catalogos/proceso/proceso.component';

import { GrupoComponent } from './pages/menu/configuraciones/catalogos/grupo/grupo.component';
import { EtapaComponent } from './pages/menu/configuraciones/catalogos/etapa/etapa.component';
import { EscuelaComponent } from './pages/menu/configuraciones/catalogos/escuela/escuela.component';
import { Page404Component } from './shared/page404/page404.component';
import { LoginComponent } from './shared/login/login.component';
import { PermisoComponent } from './pages/menu/configuraciones/catalogos/permiso/permiso.component';
import { Page503Component } from './shared/page503/page503.component';
import { SeminarioComponent } from './pages/menu/configuraciones/catalogos/seminario/seminario.component';
import { SplitterModule } from 'primeng/splitter';
import { PerfilComponent } from './pages/menu/personas/perfil/perfil.component';








/*const routes: Route[]=[
  { path: '', component: DashboardComponent },
  { path:"test",component:TestComponent},
  { path: '**', component: DashboardComponent }
];
*/

const routes: Route[]=[
  { 
    path: 'dashboard', component: PagesComponent,
    children:[
      {
        path:'',component:DashboardComponent
      },
      {
        path:'test',component:TestComponent
      },
      {
        path:'registrarPersona',component:RegisterPersonComponent
      },
      {
        path:'verPersonas',component:ViewPersonsComponent
      },
      {
        path:'contactoPersonas',component:ContactsPersonComponent
      },
      {
        path:'tipoPersona',component:TipoPersonaComponent
      },
      {
        path:'proceso',component:TipoProcesoComponent
      },
      {
        path:'grupo',component:GrupoComponent
      },
      {
        path:'escuela',component:EscuelaComponent
      },
      {
        path:'etapa',component:EtapaComponent
      },
      {
        path:'permiso',component:PermisoComponent
      },
      {
        path: 'pagina404', component: Page404Component
      },
      {
        path: 'pagina503', component: Page503Component
      },
      {
        path: 'seminario', component: SeminarioComponent
      },
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'perfil', component: PerfilComponent
      }


    ] 
  },{ 
    path: 'login', component: LoginComponent,
    children:[
      
      {
        path:'login/',component:LoginComponent
      }
    ] 
  },
  {path:'login',redirectTo:'/login',pathMatch:'full'},
  {path:'',redirectTo:'/dashboard',pathMatch:'full'},
  {path:'**',redirectTo:'/dashboard',pathMatch:'full'}

];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    TestComponent,
    DashboardComponent,
    BreadcrumbsComponent,
    PagesComponent,
    PagesRoutingComponent,
    RegisterPersonComponent,
    ViewPersonsComponent,
    ContactsPersonComponent,
    TipoPersonaComponent,
    TipoProcesoComponent,
    GrupoComponent,
    EscuelaComponent,
    EtapaComponent,
    Page404Component,
    LoginComponent,
    PermisoComponent,
    Page503Component,
    SeminarioComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes,{useHash:true}),
    BrowserAnimationsModule,
    ToastrModule.forRoot(), 
    NgLetModule,
    ButtonModule,
    ChartModule,
    TableModule,
    ProgressBarModule,
    SplitterModule
     // required animations module

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  ngOnInit(){
  }

  OnInit(){

  }
  
}
