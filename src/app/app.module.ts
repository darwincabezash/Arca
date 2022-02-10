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
import { RouterModule, Route, Routes } from '@angular/router';
import { TestComponent } from './pages/test/test.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PagesRoutingComponent } from './pages/pages-routing/pages-routing.component';
import { RegisterPersonComponent } from './pages/menu/personas/registrarPersona/registrarPersona.component';
import { VerPersonaComponent } from './pages/menu/personas/verPersona/verPersona.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ContactoPersonaComponent } from './pages/menu/personas/contactoPersona/contactoPersona.component';
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
import { RegistroDiezmoComponent } from './pages/menu/finanzas/registro-diezmo/registro-diezmo.component';
import { ModificarPersonaComponent } from './pages/menu/personas/modificar-persona/modificar-persona.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';



/*const routes: Route[]=[
  { path: '', component: DashboardComponent },
  { path:"test",component:TestComponent},
  { path: '**', component: DashboardComponent }
];
*/

const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'registrarPersona',
        component: RegisterPersonComponent,
      },
      {
        path: 'verPersona',
        component: VerPersonaComponent,
      },
      {
        path: 'contactoPersona',
        component: ContactoPersonaComponent,
      },
      {
        path: 'tipoPersona',
        component: TipoPersonaComponent,
      },
      {
        path: 'proceso',
        component: TipoProcesoComponent,
      },
      {
        path: 'grupo',
        component: GrupoComponent,
      },
      {
        path: 'escuela',
        component: EscuelaComponent,
      },
      {
        path: 'etapa',
        component: EtapaComponent,
      },
      {
        path: 'seminario',
        component: SeminarioComponent,
      },
      {
        path: 'permiso',
        component: PermisoComponent,
      },
      {
        path: 'registroDiezmo',
        component: RegistroDiezmoComponent,
      },
    ],
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  /*{
    path: 'login', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: '', redirectTo: '/dashboard', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: '/dashboard', pathMatch: 'full'
  },*/
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
    InicioComponent,
    PagesRoutingComponent,
    RegisterPersonComponent,
    VerPersonaComponent,
    ContactoPersonaComponent,
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
    RegistroDiezmoComponent,
    ModificarPersonaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgLetModule,
    ButtonModule,
    ChartModule,
    TableModule,
    ProgressBarModule,
    SplitterModule,
    ProgressSpinnerModule,
    FormsModule,
  ],
  providers: [NgxImageCompressService],
  bootstrap: [AppComponent],
})
export class AppModule {
  ngOnInit() {}

  OnInit() {}
}

/********************
 * 


const routes: Route[] = [
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'test',
        component: TestComponent,
      },
      {
        path: 'registrarPersona',
        component: RegisterPersonComponent,
      },
      {
        path: 'verPersonas',
        component: ViewPersonsComponent,
      },
      {
        path: 'contactoPersonas',
        component: ContactsPersonComponent,
      },
      {
        path: 'tipoPersona',
        component: TipoPersonaComponent,
      },
      {
        path: 'proceso',
        component: TipoProcesoComponent,
      },
      {
        path: 'grupo',
        component: GrupoComponent,
      },
      {
        path: 'escuela',
        component: EscuelaComponent,
      },
      {
        path: 'etapa',
        component: EtapaComponent,
      },
      {
        path: 'permiso',
        component: PermisoComponent,
      },
      {
        path: 'pagina404',
        component: Page404Component,
      },
      {
        path: 'pagina503',
        component: Page503Component,
      },
      {
        path: 'seminario',
        component: SeminarioComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'registroDiezmo',
        component: RegistroDiezmoComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: 'login/',
        component: LoginComponent,
      },
    ],
  },
  {
    path: 'login', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: '', redirectTo: '/dashboard', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: '/dashboard', pathMatch: 'full'
  },
];



*/
