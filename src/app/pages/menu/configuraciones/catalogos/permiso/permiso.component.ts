import { ObjPermisos, PermisoGrupo } from './../../../../../dataModels/permisoGrupo';
import { Permiso } from './../../../../../dataModels/permiso';
import { PermisoService } from './../../../../../services/catalogos/permiso.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Grupo, PermisoG } from 'src/app/dataModels/grupo';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { GrupoService } from 'src/app/services/catalogos/grupo.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: []
})
export class PermisoComponent implements OnInit {


  grupos: Grupo[] = [];

  permisos: Permiso[] = [];
  permisosGrupoSeleccionado: Permiso[] = [];

  colorGrupoSeleccionado: String = "#343A40";
  colorTextoGrupoSeleccionado: String = "#FFF";
  idGrupoSeleccionado?: String = "";
  grupoSeleccionado = new Grupo;

  permisosPopUp: Permiso[] = []

  constructor(private fb: FormBuilder, private router: Router,
    private grupoService: GrupoService, private permisoService: PermisoService,
    private toastr: ToastrService, private sesion: RuteadorService, private ruteadorService: RuteadorService) {


    sesion.existeSessionActiva();

  }



  ngOnInit(): void {
    this.ruteadorService.servidorActivo(this.router.url);

    //GRUPOS
    this.grupoService.consultarGrupo();
    this.grupoService.obtenerGrupos$().subscribe(gr => {
      this.grupos = gr;
    });

    //PERMISOS
    this.permisoService.consultarPermiso();
    this.permisoService.obtenerPermisos$().subscribe(pe => {
      this.permisos = pe;
    });



  }

  //AL HACER CLIC EN UNO DE LOS GRUPOS DE LA LISTA, INGRESA AQUI
  seleccionarGrupo(_idGrupo?: String) {

    //CAMBIA DE COLOR AL GRUPO SELECCIONADO
    this.cambiarColorGrupoSeleccionado(_idGrupo);
    this.idGrupoSeleccionado = _idGrupo;

    //EXTRAE EL GRUPO CON EL QUE SE VA A TRABAJAR
    this.grupoSeleccionado = this.grupos.find(grupo => grupo._id === _idGrupo)!;

    //EXTRAE LOS PERMISOS DEL GRUPO SELECCIONADO
    this.permisosGrupoSeleccionado = this.grupoSeleccionado.permisos!;

  }

  //GENERA UNA LISTA CON LOS PERMISOS QUE EXISTEN EN EL GRUPO SELECCIONADO
  generarPermisosPopUp() {
    this.permisosPopUp = [];

    let agregado = false;

    //REPITE ENTRE TODOS LOS PERMISOS EXISTENTES
    for (let i = 0; i < this.permisos.length; i++) {
      agregado = false;

      //REPITE ENTRE LOS PERMISOS DEL GRUPO SELECCIONADO
      for (let j = 0; j < this.grupoSeleccionado.permisos?.length!; j++) {

        //COMPARA SI EL PERMISO DE ENTRE LOS PERMISOS DEL GRUPO SELECCIONADO, EXISTE ENTRE LOS PERMISOS DEL SISTEMA

        /*CABE MENCIONAR QUE TODOS LOS PERMISOS SERAN AÑADIDOS A LA LISTA, EL TOPE ES LA CANTIDAD DE PERMISOS EXISTENTES
        EN EL SISTEMA; ASI QUE LA IDEA ES QUE APAREZCAN TODOS PERO SOLO LOS QUE TIENE ASIGNADO EL GRUPO APAREZCAN MARCADOS COMO TRUE*/

        //:::::: EN ESTE BLOQUE SE AÑADE EL ESTADO COMO TRUE (MARCADO) - (PERMISO CONCEDIDO) 
        if (this.permisos[i]._id === this.grupoSeleccionado.permisos![j].idPermiso) {

          //SEPARA ESTE PERMISO PARA AÑADIRLO A LA LISTA Y POSTERIORMENTE MOSTRARLO 
          let p = new Permiso;
          p._id = this.grupoSeleccionado.permisos![j].idPermiso;
          p.estado = true;
          p.nombre = this.grupoSeleccionado.permisos![j].nombre;
          this.permisosPopUp.push(p);
          agregado = true;

          break;
        }

      }

      //:::::::  SI EL PERMISO NO FUE AGREGADO, LO AGREGA COMO PERMISO NO CONCEDIDO (ESTADO=FALSE)
      if (!agregado) {
        let p = new Permiso;
        p._id = this.permisos[i]._id;
        p.estado = false;
        p.nombre = this.permisos[i].nombre;
        this.permisosPopUp.push(p);

      }
    }


  }

  cambiarColorGrupoSeleccionado(_idGrupo?: String) {
    for (let i = 0; i < this.grupos.length; i++) {
      if (this.grupos[i]._id === _idGrupo) {
        this.grupos[i].color = this.colorGrupoSeleccionado;
        this.grupos[i].colorTexto = this.colorTextoGrupoSeleccionado;
      } else {
        this.grupos[i].color = "#fff";
        this.grupos[i].colorTexto = "#000";
      }
    }
  }




  //CAMBIA EL ESTADO DEL PERMISO SELECCIONDO, ESTO ES DE ENTRE LOS PERMISOS EXISTNTES EN EL SISTEMA COMBINADO CON LOS PERMISOS DE CADA GRUPO
  actualizarPermisoPopUp(_idPermiso: String, _estado: boolean) {

    for (let i = 0; i < this.permisosPopUp.length; i++) {

      if (this.permisosPopUp[i]._id === _idPermiso) {
        let _p = new Permiso();
        _p._id = this.permisosPopUp[i]._id;
        _p.estado = _estado;
        _p.nombre = this.permisosPopUp[i].nombre;
        this.permisosPopUp[i] = _p;
      }

    }

  }

  //RE-CREA LOS PERMISOS DE UN GRUPO, LO LIBERA Y NUEVAMENTE GENERA TODOS LOS PERMISOS PARA ESE GRUPO
  actualizarPermisoGrupo() {
    let _grupoActualizar = new Grupo();

    //REPITE TODOS LOS GRUPOS 
    for (let i = 0; i < this.grupos.length; i++) {

      //COMPARA SI EL GRUPO ES EL MISMO QUE FUE SELECCIONADO PARA AÑADIR PERMISOS 
      if (this.grupos[i]._id === this.idGrupoSeleccionado) {

        //LIBERA LOS PERMISOS DEL GRUPO SELECCIONADO
        this.grupos[i].permisos = [];

        /*REPITE LA LISTA DE LOS PERMISOS GENERADOS PARA EL POP-UP, CON TODOS SUS ESTADOS Y LOS QUE ESTAN EN TREUE (ACCESO),
        LOS AÑADE A LA LISTA DE LOS PERMISOS DEL GRUPO*/
        for (let j = 0; j < this.permisosPopUp.length; j++) {
          let _p = new PermisoG();
          _p.idPermiso = this.permisosPopUp[j]._id;
          _p.estado = this.permisosPopUp[j].estado;
          _p.nombre = this.permisosPopUp[j].nombre;
          this.grupos[i].permisos?.push(_p);
          _grupoActualizar = this.grupos[i];
        }
        break;

      }
    }


    this.grupoService.actualizarGrupoPermiso(this.idGrupoSeleccionado, _grupoActualizar);
    this.toastr.success('Permisos actualizados correctamente', 'Editar Permisos');

    this.idGrupoSeleccionado = "";
    this.grupoSeleccionado = new Grupo();
    this.permisosGrupoSeleccionado = [];

  }



  refrescarGrupo() {
    this.grupoService.consultarGrupo();
  }



}
