import { NgModule } from '@angular/core';
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
import { RegisterPersonComponent } from './pages/register-person/register-person.component';
import { ViewPersonsComponent } from './pages/view-persons/view-persons.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ContactsPersonComponent } from './pages/person/contacts-person/contacts-person.component';
import { TipoPersonaComponent } from './pages/configuraciones/catalogos/tipo-persona/tipo-persona.component';
import { NgLetModule } from 'ng-let';
import { TipoProcesoComponent } from './pages/configuraciones/catalogos/tipo-proceso/tipo-proceso.component';

import { GrupoComponent } from './pages/configuraciones/catalogos/grupo/grupo.component';
import { EscuelaComponent } from './pages/configuraciones/catalogos/escuela/escuela.component';
import { EtapaComponent } from './pages/configuraciones/catalogos/etapa/etapa.component';







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
        path:'registrar-persona',component:RegisterPersonComponent
      },
      {
        path:'ver-personas',component:ViewPersonsComponent
      },
      {
        path:'ver-contacto-personas',component:ContactsPersonComponent
      },
      {
        path:'tipoPersona',component:TipoPersonaComponent
      },
      {
        path:'tipoProceso',component:TipoProcesoComponent
      },
      {
        path:'grupo',component:GrupoComponent
      },
      {
        path:'escuela',component:EscuelaComponent
      },
      {
        path:'etapa',component:EtapaComponent
      }

    ] 
  },
 
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
    EtapaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes,{useHash:true}),
    BrowserAnimationsModule,
    ToastrModule.forRoot(), 
    NgLetModule
  
     // required animations module

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  
}
