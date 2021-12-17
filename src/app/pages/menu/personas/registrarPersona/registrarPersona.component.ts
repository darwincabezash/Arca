import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Escuela } from 'src/app/dataModels/escuela';
import { Grupo } from 'src/app/dataModels/grupo';
import { Bautizmo, DatoBasicoPersona, DatosLlegada, OracionFe, OrigenPersona, Persona } from 'src/app/dataModels/persona';
import { TipoProceso } from 'src/app/dataModels/tipoProceso';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';


@Component({
  selector: 'app-register-person',
  templateUrl: './registrarPersona.component.html',
  styleUrls: []
})
export class RegisterPersonComponent implements OnInit {

  //::: ORIGEN 
  tiempoPermanencia: Number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  origenIglesiaSeleccionado = "";
  origenPersonaForm: FormGroup;
  origenPersona: OrigenPersona

  //::: DATOS LLEGADA
  datosLlegadaForm: FormGroup;
  datosLlegada: DatosLlegada

  //::: ORACION DE FE
  oracionFeLugar = "";
  hizoOracionFe = false;
  oracionFeForm: FormGroup;
  oracionFe: OracionFe;

  //::: BAUTIZMO
  hizoBautizmo = false;
  bautizmoLugar = "";
  bautizmoForm: FormGroup;
  bautizmo: Bautizmo;



  //::: PROCESOS
  tipoPersonaSeleccion = "";
  //:::     //:: ESCUELAS
  listaEscuelasTodas: Escuela[] = [
    { _id: "1", tipo: "CEFI1", color: "#00BE56" },
    { _id: "2", tipo: "CEFI2", color: "#B1BE00" },
    { _id: "3", tipo: "CEFI3", color: "#7200BE" },
    { _id: "4", tipo: "CEFI4", color: "#0053BE" },
    { _id: "5", tipo: "CEFI5", color: "#BE00B9" },
  ];
  listaEscuelasSeleccion: Escuela[] = [];

  //:::     //::: TIPOS PROCESOS
  listaProcesosTodos: TipoProceso[] = [
    { _id: "1", tipo: "Encuentro"},
    { _id: "2", tipo: "Re-Encuentro"},
    { _id: "3", tipo: "Campamento"},
    { _id: "4", tipo: "EDEM"},
    { _id: "5", tipo: "Retiro de Caballeros"}
  ];
  listaProcesosSeleccion: TipoProceso[] = [];

  //:::     //::: GRUPOS
  listaGruposTodos: Grupo[] = [
    { _id: "1", tipo: "Alabanza" },
    { _id: "2", tipo: "Jovenes" },
    { _id: "3", tipo: "Damas" },
    { _id: "4", tipo: "Caballeros" }
  ];
  listaGruposSelecion: Grupo[] = [];





//::: PERSONAS
  personaForm: FormGroup;


  /*constructor() { 
    this.personaForm=new FormGroup({
      cedula:new FormControl(),

    });
  }*/


  constructor(private fbBautizmo: FormBuilder,private fbOracionFe: FormBuilder,private fbOrigenPersona: FormBuilder, private fbDatosLlegadaPersona: FormBuilder, private fb: FormBuilder, private router: Router, private personaService: PersonaService, private toastr: ToastrService, private sesion: RuteadorService) {

    //Valida si el usuario tene acceso a esta pagina
    sesion.existeUsuarioActivo();

    this.origenPersona = new OrigenPersona();
    this.datosLlegada = new DatosLlegada();
    this.oracionFe = new OracionFe();
    this.bautizmo= new Bautizmo();


    this.personaForm = this.fb.group({
      cedula: ["", Validators.required],
      primerNombre: ["", Validators.required],
      segundoNombre: [""],
      primerApellido: ["", Validators.required],
      segundoApellido: [""],
      fechaNacimiento: [""],
      telefono: [""],
      celular: [""],
      direccion: [""],
      email: [""],
      sexo: [""],
      foto: [""],
    });


    //ORIGEN PERSONA
    this.origenPersonaForm = this.fbOrigenPersona.group({
      nombreIglesiaOrigen: [""],
      cargoEjercido: [""],
      tiempoPermanencia: [""]
    });

    //DATOS LLEGADA
    this.datosLlegadaForm = this.fbDatosLlegadaPersona.group({
      fechaLlegada: [""],
      InvitadoPor: [""],
      actividadLlegada: [""]
    });

    //DORACION FE
    this.oracionFeForm = this.fbOracionFe.group({
      oracionfe: [""],
      fecha: [""],
      lugar: [""],
      responsable: [""]
    });

    //BAUTIZMO
    this.bautizmoForm = this.fbBautizmo.group({
      oracionfe: [""],
      fecha: [""],
      lugar: [""],
      responsable: [""]
    });

  }

  //ORIGEN PERSONA
  generarBloqueOrigenPersona() {

    //Verifica si la seleccion es diferente de "Otra" que significa que viene de otra iglesia
    let _origenPersona = new OrigenPersona();

    if (this.origenIglesiaSeleccionado !== "Otra") {
      _origenPersona.nombreIglesiaOrigen = this.origenIglesiaSeleccionado;

    } else {
      _origenPersona.nombreIglesiaOrigen = this.origenPersonaForm.get('nombreIglesiaOrigen')?.value,
        _origenPersona.cargoEjercido = this.origenPersonaForm.get('cargoEjercido')?.value,
        _origenPersona.tiempoPermanencia = this.origenPersonaForm.get('tiempoPermanencia')?.value
    }
    this.origenPersona = _origenPersona;

    this.toastr.info('Se actualizó el origen de la persona');

  }



  //DATOS LLEGADA 
  generarBloqueDatosLlegada() {

    let _datosLlegada = new DatosLlegada();

    _datosLlegada.fechaLlegada = this.datosLlegadaForm.get('fechaLlegada')?.value,
      _datosLlegada.InvitadoPor = this.datosLlegadaForm.get('InvitadoPor')?.value,
      _datosLlegada.actividadLlegada = this.datosLlegadaForm.get('actividadLlegada')?.value

    this.datosLlegada = _datosLlegada;

    console.log("DATOS: " + _datosLlegada.fechaLlegada + "   :   " + _datosLlegada.InvitadoPor + "   :   " + _datosLlegada.actividadLlegada);
    this.toastr.info('Se actualizaron los datos de llegada de la persona');

  }

  //ORACION FE
  generarBloqueOracionFe() {

    let _oracionFe = new OracionFe();

    //Verifica si marco "Hizo oracion de fe", si es asi llena todos los datos; si no, los completa todos como vacios
    if (this.hizoOracionFe) {
      _oracionFe.oracionFe = this.hizoOracionFe;
      _oracionFe.fecha = this.oracionFeForm.get('fecha')?.value;
        
        if (this.oracionFeLugar !== "Otra") {
          _oracionFe.lugar = this.oracionFeLugar;
        } else { 
          _oracionFe.lugar = this.oracionFeForm.get('lugar')?.value;
        }
      _oracionFe.responsable = this.oracionFeForm.get('responsable')?.value;

    } else {
      _oracionFe.oracionFe = false;
      _oracionFe.fecha = undefined;
      _oracionFe.lugar = "";
      _oracionFe.responsable = "";
    }

    console.log("datoooo: " + _oracionFe.fecha + "   :   " + _oracionFe.oracionFe + "   :   " + _oracionFe.lugar + "   :  " + _oracionFe.responsable);

    this.oracionFe = _oracionFe;

    this.toastr.info('Se actualizaron datos sobre la oración de fe');

  }




  //ORACION FE
  generarBloqueBautizmo() {

    let _bautizmo = new Bautizmo();

    //Verifica si marco "Hizo bautizmo", si es asi llena todos los datos; si no, los completa todos como vacios
    if (this.hizoBautizmo) {
      _bautizmo.bautizmo = this.hizoBautizmo;
      _bautizmo.fecha = this.bautizmoForm.get('fecha')?.value;

      if (this.bautizmoLugar !== "Otra") {
        _bautizmo.lugar = this.bautizmoLugar;
      } else {
        _bautizmo.lugar = this.bautizmoForm.get('lugar')?.value;
      }
      _bautizmo.responsable = this.bautizmoForm.get('responsable')?.value;

    } else {
      _bautizmo.bautizmo = false;
      _bautizmo.fecha = undefined;
      _bautizmo.lugar = "";
      _bautizmo.responsable = "";
    }

    console.log("datoooo: " + _bautizmo.fecha + "   :   " + _bautizmo.bautizmo + "   :   " + _bautizmo.lugar + "   :  " + _bautizmo.responsable);

    this.bautizmo = _bautizmo;

    this.toastr.info('Se actualizaron datos sobre el bautizmo');

  }

  agregarPersona() {
    console.log(this.personaForm);
    console.log("SEXO: " + this.personaForm.get('sexo')?.value);
    let sexo;
    const datoBasicoPersona: DatoBasicoPersona = {
      cedula: this.personaForm.get('cedula')?.value,
      primerNombre: this.personaForm.get('primerNombre')?.value,
      segundoNombre: this.personaForm.get('segundoNombre')?.value,
      primerApellido: this.personaForm.get('primerApellido')?.value,
      segundoApellido: this.personaForm.get('segundoApellido')?.value,
      fechaNacimiento: this.personaForm.get('fechaNacimiento')?.value,
      telefono: this.personaForm.get('telefono')?.value,
      celular: this.personaForm.get('celular')?.value,
      direccion: this.personaForm.get('direccion')?.value,
      email: this.personaForm.get('email')?.value,
      sexo: this.personaForm.get('sexo')?.value,
      foto: this.personaForm.get('foto')?.value,

    }

    console.log("DATOS DE PERSONA");
    console.log("cedula: " + datoBasicoPersona.cedula);
    console.log("primerNombre: " + datoBasicoPersona.primerNombre);
    console.log("segundoNombre: " + datoBasicoPersona.segundoNombre);
    console.log("primerApellido: " + datoBasicoPersona.primerApellido);
    console.log("segundoApellido: " + datoBasicoPersona.segundoApellido);
    console.log("fechaNacimiento: " + datoBasicoPersona.fechaNacimiento);
    console.log("telefono: " + datoBasicoPersona.telefono);
    console.log("celular: " + datoBasicoPersona.celular);
    console.log("direccion: " + datoBasicoPersona.direccion);
    console.log("email: " + datoBasicoPersona.email);
    console.log("sexo: " + datoBasicoPersona.sexo);
    console.log("foto: " + datoBasicoPersona.foto);


    let persona: Persona = new Persona();
    persona.datoBasicoPersona = datoBasicoPersona;
    this.personaService.agregarPersonas(persona);

    console.log("PERSONA: " + datoBasicoPersona.cedula);
    //    this.toastr.success('El producto fue registrado correctamente', 'Registro de Producto ');
    this.toastr.success('Persona registrada correctamente', 'Registro de Personas');

    this.limpiarCampos();
  }

  limpiarCampos() {

    this.personaForm.setValue({
      cedula: '',
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: '',
      telefono: '',
      celular: '',
      direccion: '',
      email: '',
      sexo: '',
      foto: ''
    });

  }

  ngOnInit(): void {
  }


  //::: ORIGEN
  onChangeIglesiaOrigen(_origenIglesiaSeleccionado: any) {
    this.origenIglesiaSeleccionado = _origenIglesiaSeleccionado.value;
  }
  onChangeIglesiaOrigenTiempoPermanencia(_origenIglesiaTiempoPermanencia: any) {

    this.origenPersonaForm.patchValue({
      tiempoPermanencia: _origenIglesiaTiempoPermanencia.value
    });
    console.log("datx: " + _origenIglesiaTiempoPermanencia.value);
  }

  //::: DATOS DE LLEGADA
  onChangeIglesiaInvitadoPorDatoLlegada(_origenIglesiaInvitadoPorDatoLlegada: any) {

    this.datosLlegadaForm.patchValue({
      InvitadoPor: _origenIglesiaInvitadoPorDatoLlegada.value
    });
    console.log("datx: " + _origenIglesiaInvitadoPorDatoLlegada.value);
  }


  

  //::: ORACION FE
  onChangeOracionFeLugar(_oracionFeLugar: any) {
    this.oracionFeLugar = _oracionFeLugar.value;
  }
  onChangeHizoOracionFe(_hizoOracionFe: any) {//@@@@
    this.hizoOracionFe = _hizoOracionFe.currentTarget.checked;
    console.log(this.hizoOracionFe);
  }

  //::: BAUTIZMO
  onChangeHizoBautizmo(_hizoBautizmo: any) {
    this.hizoBautizmo = _hizoBautizmo.currentTarget.checked;
    console.log(this.hizoBautizmo);
  }
  onChangeBautizmoIglesia(_bautizmoLugar: any) {
    this.bautizmoLugar = _bautizmoLugar.value;
  }

  //::: PROCESOS
  onChangeTipoPersona(_tipoPersonaSeleccion: any) {
    this.tipoPersonaSeleccion = _tipoPersonaSeleccion.value;
    console.log(this.tipoPersonaSeleccion);
  }
  //::: //::: ESCUELAS
  marcarEscuelas(_id: String) {
    let _escuela= new Escuela();
    _escuela = this.listaEscuelasTodas.find(e => e._id === _id)!;
    this.listaEscuelasSeleccion.push(_escuela);
    this.listaEscuelasTodas = this.listaEscuelasTodas.filter(e => e._id !== _escuela._id);
  }

  desmarcarEscuelas(_id: String) {
    let _escuela = new Escuela();
    _escuela = this.listaEscuelasSeleccion.find(e => e._id === _id)!;
    this.listaEscuelasTodas.push(_escuela);
    this.listaEscuelasSeleccion = this.listaEscuelasSeleccion.filter(e => e._id !== _escuela._id);

  }

  //::: //::: TIPOS PROCESOS
  marcarTipoProcesos(_id: String) {
    let _tipoProceso = new TipoProceso();
    _tipoProceso = this.listaProcesosTodos.find(t => t._id === _id)!;
    this.listaProcesosSeleccion.push(_tipoProceso);
    this.listaProcesosTodos = this.listaProcesosTodos.filter(e => e._id !== _tipoProceso._id);
  }

  desmarcarTipoProceso(_id: String) {
    let _tipoProceso = new TipoProceso();
    _tipoProceso = this.listaProcesosSeleccion.find(t => t._id === _id)!;
    this.listaProcesosTodos.push(_tipoProceso);
    this.listaProcesosSeleccion = this.listaProcesosSeleccion.filter(t => t._id !== _tipoProceso._id);

  }

  //::: //::: GRUPOS
  marcarGrupos(_id: String) {
    let _grupo = new Grupo();
    _grupo = this.listaGruposTodos.find(g => g._id === _id)!;
    this.listaGruposSelecion.push(_grupo);
    this.listaGruposTodos = this.listaGruposTodos.filter(g => g._id !== _grupo._id);
  }

  desmarcarGrupos(_id: String) {
    let _grupo = new Grupo();
    _grupo = this.listaGruposSelecion.find(g => g._id === _id)!;
    this.listaGruposTodos.push(_grupo);
    this.listaGruposSelecion = this.listaGruposSelecion.filter(g => g._id !== _grupo._id);

  }




  temp(a: any, b: string) {

  }
}

