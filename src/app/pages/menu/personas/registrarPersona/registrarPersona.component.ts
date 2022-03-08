import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Escuela } from 'src/app/dataModels/escuela';
import { Grupo } from 'src/app/dataModels/grupo';
import { Bautizmo, DatoBasicoPersona, DatosLlegada, OracionFe, OrigenPersona, Persona } from 'src/app/dataModels/persona';
import { Seminario } from 'src/app/dataModels/seminario';
import { TipoPersona } from 'src/app/dataModels/tipoPersona';
import { TipoProceso } from 'src/app/dataModels/tipoProceso';
import { Usuario } from 'src/app/dataModels/usuario';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { EscuelaService } from 'src/app/services/catalogos/escuela.service';
import { GrupoService } from 'src/app/services/catalogos/grupo.service';
import { SeminarioService } from 'src/app/services/catalogos/seminario.service';
import { TipoProcesoService } from 'src/app/services/catalogos/tipo-proceso.service';
import { UsuarioService } from 'src/app/services/catalogos/usuario.service copy';
import { UserDataService } from 'src/app/services/general/user-data.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';
import { TipoPersonaService } from 'src/app/services/persona/tipoPersona/tipoPersona.service';
import { UtilidadesService } from 'src/app/services/compartido/utilidades.service';
//import { v4 as uuidv4 } from 'uuid';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { MemoriaService } from 'src/app/services/compartido/memoria.service';
import { v4 as uuidv4 } from 'uuid';
//uuidv4();



@Component({
  selector: 'app-register-person',
  templateUrl: './registrarPersona.component.html',
  styleUrls: [],
})
export class RegisterPersonComponent implements OnInit {
  //::: LOGIN
  datosPersonaSesion: any;
  idPersona: String = '';

  //::: OTROS
  _id_persona_creada: boolean = false;
  personaFueCreada = false;
  mostrarBotonEditarOracionFeYBautizo = false;

  //::: COMUNES
  tipoPersona: TipoPersona[] = [];
  escuela: Escuela[] = [];
  persona: Persona[] = [];
  personaNueva: Persona;

  informacionEspiritualGuardada = false;

  //::: ORIGEN
  tiempoPermanencia: Number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  origenIglesiaSeleccionado = '';
  origenPersonaForm: FormGroup;
  origenPersona: OrigenPersona;
  tieneCartaAutorizacion = false;

  //::: DATOS LLEGADA
  datosLlegadaForm: FormGroup;
  datosLlegada: DatosLlegada;
  datoLlegadaSeleccionado = '';

  //::: ORACION DE FE
  oracionFeLugar = '';
  hizoOracionFe = false;
  oracionFeForm: FormGroup;
  oracionFe: OracionFe;

  //::: BAUTIZMO
  hizoBautizmo = false;
  bautizmoLugar = '';
  bautizmoForm: FormGroup;
  bautizmo: Bautizmo;

  //::: USUARIO
  usuarioForm: FormGroup;
  datoUsuario: Usuario;
  usuarioFueCreado = false;

  //::: PROCESOS
  tipoPersonaSeleccion = '';
  //:::     //:: ESCUELAS
  listaEscuelasTodas: Escuela[] = []; /*
    { _id: "1", tipo: "CEFI1", color: "#00BE56" },
    { _id: "2", tipo: "CEFI2", color: "#B1BE00" },
    { _id: "3", tipo: "CEFI3", color: "#7200BE" },
    { _id: "4", tipo: "CEFI4", color: "#0053BE" },
    { _id: "5", tipo: "CEFI5", color: "#BE00B9" },
  ];*/
  listaEscuelasSeleccion: Escuela[] = [];

  //:::     //::: TIPOS PROCESOS
  listaProcesosTodos: TipoProceso[] = []; /*
    { _id: "1", tipo: "Encuentro" },
    { _id: "2", tipo: "Re-Encuentro" },
    { _id: "3", tipo: "Campamento" },
    { _id: "4", tipo: "EDEM" },
    { _id: "5", tipo: "Retiro de Caballeros" }
  ];*/
  listaProcesosSeleccion: TipoProceso[] = [];

  //:::     //::: GRUPOS
  listaGruposTodos: Grupo[] = [];
  listaSeminariosTodos: Grupo[] = []; /*
    { _id: "1", tipo: "Alabanza" },
    { _id: "2", tipo: "Jovenes" },
    { _id: "3", tipo: "Damas" },
    { _id: "4", tipo: "Caballeros" }
  ];*/
  listaGruposSelecion: Grupo[] = [];
  listaSeminariosSelecion: Seminario[] = [];

  urlImagen: string = '';
  cargandourlImagen = false;

  //::: PERSONAS
  personaForm: FormGroup;
  mostrarBotonEditar:boolean = false;

  /*constructor() { 
    this.personaForm=new FormGroup({
      cedula:new FormControl(),

    });
  }*/

  constructor(
    private fbUsuario: FormBuilder,
    private fbBautizmo: FormBuilder,
    private fbOracionFe: FormBuilder,
    private fbOrigenPersona: FormBuilder,
    private fbDatosLlegadaPersona: FormBuilder,
    private fb: FormBuilder,
    private router: Router,
    private personaService: PersonaService,
    private toastr: ToastrService,
    private sesion: RuteadorService,
    private tipoPersonaService: TipoPersonaService,
    private escuelaService: EscuelaService,
    private tipoProcesoService: TipoProcesoService,
    private grupoService: GrupoService,
    private usuarioService: UsuarioService,
    private ruteadorService: RuteadorService,
    private userDataService: UserDataService,
    private seminarioService: SeminarioService,
    private utilidadesService: UtilidadesService,
    private memoriaService: MemoriaService
  ) {
    //Valida si el usuario tene acceso a esta pagina
    sesion.existeUsuarioActivo();

    this.origenPersona = new OrigenPersona();
    this.datosLlegada = new DatosLlegada();
    this.oracionFe = new OracionFe();
    this.bautizmo = new Bautizmo();
    this.datoUsuario = new Usuario();
    this.personaNueva = new Persona();

    //this.urlImagen

    this.personaForm = this.fb.group({
      cedula: ['', Validators.required],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      fechaNacimiento: [''],
      telefono: [''],
      celular: [''],
      direccion: [''],
      email: [''],
      sexo: ['', Validators.required],
      foto: [''],
    });

    //ORIGEN PERSONA
    this.origenPersonaForm = this.fbOrigenPersona.group({
      nombreIglesiaOrigen: [''],
      cargoEjercido: [''],
      tiempoPermanencia: [0],
    });

    //DATOS LLEGADA
    this.datosLlegadaForm = this.fbDatosLlegadaPersona.group({
      fechaLlegada: [''],
      invitadoPor: [''],
      invitadoPorNombre: [''],
      actividadLlegada: [''],
      observacionUbicacion: [''],
    });

    //DORACION FE
    this.oracionFeForm = this.fbOracionFe.group({
      oracionfe: [''],
      fecha: [''],
      lugar: [''],
      responsable: [''],
    });

    //BAUTIZMO
    this.bautizmoForm = this.fbBautizmo.group({
      oracionfe: [''],
      fecha: [''],
      lugar: [''],
      responsable: [''],
    });

    //USUARIO
    this.usuarioForm = this.fbUsuario.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
      repetirPassword: ['', Validators.required],
      _idPersona: [''],
    });
  }

  ngOnInit(): void {
    this.personaFueCreada = false;
    this.usuarioFueCreado = false;
    this.ruteadorService.servidorActivo(this.router.url);

    this.tipoPersonaService.consultarTipoPersonas();
    this.tipoPersonaService.obtenerTipoPersonas$().subscribe((tp) => {
      this.tipoPersona = tp;
    });

    this.escuelaService.consultarEscuela();
    this.escuelaService.obtenerEscuelas$().subscribe((tp) => {
      this.listaEscuelasTodas = tp;
    });

    this.tipoProcesoService.consultarTipoProceso();
    this.tipoProcesoService.obtenerTipoProcesos$().subscribe((tp) => {
      this.listaProcesosTodos = tp;
    });

    this.grupoService.consultarGrupo();
    this.grupoService.obtenerGrupos$().subscribe((tp) => {
      this.listaGruposTodos = tp;
    });

    this.personaService.consultarDatosBasicosPersonas();
    this.personaService.obtenerPersonas$().subscribe((tp) => {
      this.persona = tp;
    });

    this.seminarioService.consultarSeminario();
    this.seminarioService.obtenerSeminarios$().subscribe((tp) => {
      this.listaSeminariosTodos = tp;
    });
  }

  //ORIGEN PERSONA
  generarBloqueOrigenPersona() {
    //Verifica si la seleccion es diferente de "Otra" que significa que viene de otra iglesia
    let _origenPersona = new OrigenPersona();

    _origenPersona.tieneCartaAutorizacion = this.tieneCartaAutorizacion;

    if (this.origenIglesiaSeleccionado !== 'Otra') {
      _origenPersona.nombreIglesiaOrigen = this.origenIglesiaSeleccionado;
    } else {
      _origenPersona.nombreIglesiaOrigen = this.origenPersonaForm.get(
        'nombreIglesiaOrigen'
      )?.value;
      _origenPersona.cargoEjercido =
        this.origenPersonaForm.get('cargoEjercido')?.value;
      _origenPersona.tiempoPermanencia =
        this.origenPersonaForm.get('tiempoPermanencia')?.value;
    }
    this.origenPersona = _origenPersona;

    //ESTABLECE EL PARAMETRO QUE VERIFICA SI SE MUESTRA O NO LOS BOTONES "EDITAR" EN ORACION DE FE Y BAUTIZ
    if (this.origenIglesiaSeleccionado !== 'Otra') {
      this.mostrarBotonEditarOracionFeYBautizo = true;
    } else {
      if (this.tieneCartaAutorizacion) {
        this.mostrarBotonEditarOracionFeYBautizo = true;
      } else {
        this.mostrarBotonEditarOracionFeYBautizo = false;
      }
    }

    this.toastr.info('Se actualizó el origen de la persona');
  }

  //DATOS LLEGADA
  generarBloqueDatosLlegada() {
    let _datosLlegada = new DatosLlegada();

    _datosLlegada.fechaLlegada =
      this.datosLlegadaForm.get('fechaLlegada')?.value;
    _datosLlegada.actividadLlegada =
      this.datosLlegadaForm.get('actividadLlegada')?.value;

    if (this.datoLlegadaSeleccionado !== 'Otra') {
      _datosLlegada.invitadoPor = this.datoLlegadaSeleccionado;
    } else {
      _datosLlegada.observacionUbicacion = this.datosLlegadaForm.get(
        'observacionUbicacion'
      )?.value;
      _datosLlegada.invitadoPor =
        this.datosLlegadaForm.get('invitadoPorNombre')?.value;
    }

    this.datosLlegada = _datosLlegada;
  }

  //ORACION FE
  generarBloqueOracionFe() {
    let _oracionFe = new OracionFe();

    //Verifica si marco "Hizo oracion de fe", si es asi llena todos los datos; si no, los completa todos como vacios
    if (this.hizoOracionFe) {
      _oracionFe.oracionFe = this.hizoOracionFe;
      _oracionFe.fechaOracionFe = this.oracionFeForm.get('fecha')?.value;

      if (this.oracionFeLugar !== 'Otra') {
        _oracionFe.lugarOracionFe = this.oracionFeLugar;
      } else {
        _oracionFe.lugarOracionFe = this.oracionFeForm.get('lugar')?.value;
      }
      _oracionFe.responsableOracionFe =
        this.oracionFeForm.get('responsable')?.value;
    } else {
      _oracionFe.oracionFe = false;
      _oracionFe.fechaOracionFe = undefined;
      _oracionFe.lugarOracionFe = '';
      _oracionFe.responsableOracionFe = '';
    }

    this.oracionFe = _oracionFe;

    this.toastr.info('Se actualizaron datos sobre la oración de fe');
  }

  //ORACION FE
  generarBloqueBautizmo() {
    let _bautizmo = new Bautizmo();

    //Verifica si marco "Hizo bautizmo", si es asi llena todos los datos; si no, los completa todos como vacios
    if (this.hizoBautizmo) {
      _bautizmo.bautizmo = this.hizoBautizmo;
      _bautizmo.fechaBautizmo = this.bautizmoForm.get('fecha')?.value;

      if (this.bautizmoLugar !== 'Otra') {
        _bautizmo.lugarBautizmo = this.bautizmoLugar;
      } else {
        _bautizmo.lugarBautizmo = this.bautizmoForm.get('lugar')?.value;
      }
      _bautizmo.responsableBautizmo =
        this.bautizmoForm.get('responsable')?.value;
    } else {
      _bautizmo.bautizmo = false;
      _bautizmo.fechaBautizmo = undefined;
      _bautizmo.lugarBautizmo = '';
      _bautizmo.responsableBautizmo = '';
    }

    this.bautizmo = _bautizmo;

    this.toastr.info('Se actualizaron datos sobre el bautizmo');
  }

  async agregarPersona() {
    let sexo;
    const datoBasicoPersona: DatoBasicoPersona = {
      codIglesia: this.utilidadesService.obtenerCodIglesiaSesion(),
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
      foto: this.urlImagen,
      fechaRegistro: this.utilidadesService.obtenerFechaFormatoBasico(
        Date.now()
      ),
    };

    /*
    console.log(
      'ASI ES LA PERSONA:  ' + this.personaForm.get('fechaNacimiento')?.value
  );

    console.log(
      'FECHA DE HOY:  ' +
      this.utilidadesService.obtenerFechaFormatoBasico(Date.now())
    );*/

    this.personaNueva.datoBasicoPersona = datoBasicoPersona;
    //this.personaService.agregarPersonas(persona);
    await this.personaService
      .agregarPersonas(this.personaNueva)
      .then((_idPersonaCreada) => {
        if (_idPersonaCreada.length > 0) {
          localStorage.setItem('_id_persona_creada', _idPersonaCreada);
          this._id_persona_creada = true;
          this.toastr.success(
            'Persona registrada correctamente',
            'Registro de Personas'
          );

          this.userDataService.notificarPersonaNueva(_idPersonaCreada);
          this.personaFueCreada = true;
          this.personaNueva._id = _idPersonaCreada;
          this.mostrarBotonesEditar(true);
          this.limpiarCampos();
        }
      });

    //    this.toastr.success('El producto fue registrado correctamente', 'Registro de Producto ');
    //this.memoriaService.sendMessage();

    this.actualizarBase();
  }

  async actualizarBase() {
    this.personaService.consultarPersonas();

    await this.personaService.obtenerPersonas$().subscribe((personas) => {
      this.memoriaService.guardarLocalPersona(personas);
    });
  }

  agregarUsuario() {
    //ESTO NO DEBERIA IR AQUI PERO LO PONGO POR  ADELANTAR EL FLUJO NORMAL
    //localStorage.setItem("_id_persona_creada",_idPersonaCreada)

    this.datoUsuario = new Usuario();

    if (
      this.usuarioForm.get('password')?.value ===
      this.usuarioForm.get('repetirPassword')?.value
    ) {
      (this.datoUsuario.usuario = this.usuarioForm.get('usuario')?.value),
        (this.datoUsuario.password = this.usuarioForm.get('password')?.value),
        (this.datoUsuario._idPersona = this.personaNueva._id);
      //this.datoUsuario.codIglesia = '61fd5733a432a0b499e74252'; //@@@
      this.datoUsuario.codIglesia =
        this.utilidadesService.obtenerCodIglesiaSesion();
      //datoUsuario._idPersona = localStorage.getItem("_id_persona_creada")!;

      this.usuarioService
        .agregarUsuario(this.datoUsuario)
        .then((_idUsuarioCreado) => {
          if (_idUsuarioCreado.length > 0) {
            //localStorage.setItem("_id_persona_creada", _idPersonaCreada)
            //this._id_persona_creada = true;
            this.toastr.success(
              'Usuario registrado correctamente',
              'Registro de Usuario'
            );

            //this.userDataService.notificarPersonaNueva(_idPersonaCreada);

            this.usuarioFueCreado = true;

            this.limpiarCamposUsuario();
          } else {
            //this._id_persona_creada = false;
            this.toastr.error(
              'No se pudo guardar el usuario, por favor intentalo nuevamente',
              'Registro de Usuario'
            );
          }
        });
    } else {
      this.toastr.warning(
        'Los passwords ingresados, no coinciden.',
        'Registro de Usuario'
      );
    }

    // this.usuarioService.agregarUsuario(datoUsuario);

    //    this.toastr.success('El producto fue registrado correctamente', 'Registro de Producto ');

    this.actualizarBase();
  }

  limpiarCamposUsuario() {
    this.usuarioForm.setValue({
      usuario: '',
      password: '',
      repetirPassword: '',
      _idPersona: '',
    });
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
      foto: '',
    });
  }

  //::: ORIGEN
  onChangeIglesiaOrigen(_origenIglesiaSeleccionado: any) {
    this.origenIglesiaSeleccionado = _origenIglesiaSeleccionado.value;
  }

  onChangeIglesiaOrigenTiempoPermanencia(_origenIglesiaTiempoPermanencia: any) {
    this.origenPersonaForm.patchValue({
      tiempoPermanencia:
        _origenIglesiaTiempoPermanencia.value.length > 0
          ? _origenIglesiaTiempoPermanencia.value
          : 0,
    });
  }

  //::: DATOS DE LLEGADA
  onChangeIglesiaInvitadoPorDatoLlegada(_datoLlegadaSeleccionado: any) {
    this.datoLlegadaSeleccionado = _datoLlegadaSeleccionado.value;

    /*this.datosLlegadaForm.patchValue({
      InvitadoPor: _origenIglesiaInvitadoPorDatoLlegada.value
    });
    console.log("datx: " + _origenIglesiaInvitadoPorDatoLlegada.value);*/
  }

  onChangeTieneCartaAutorizacion(_tieneCartaAutorizacion: any) {
    //@@@@
    this.tieneCartaAutorizacion = _tieneCartaAutorizacion.currentTarget.checked;
  }

  //::: ORACION FE
  onChangeOracionFeLugar(_oracionFeLugar: any) {
    this.oracionFeLugar = _oracionFeLugar.value;
  }
  onChangeHizoOracionFe(_hizoOracionFe: any) {
    //@@@@
    this.hizoOracionFe = _hizoOracionFe.currentTarget.checked;
  }

  //::: BAUTIZMO
  onChangeHizoBautizmo(_hizoBautizmo: any) {
    this.hizoBautizmo = _hizoBautizmo.currentTarget.checked;
  }
  onChangeBautizmoIglesia(_bautizmoLugar: any) {
    this.bautizmoLugar = _bautizmoLugar.value;
  }

  //::: PROCESOS
  onChangeTipoPersona(_tipoPersonaSeleccion: any) {
    this.tipoPersonaSeleccion = _tipoPersonaSeleccion.value;
  }
  //::: //::: ESCUELAS
  marcarEscuelas(_id: String) {
    let _escuela = new Escuela();
    _escuela = this.listaEscuelasTodas.find((e) => e._id === _id)!;
    this.listaEscuelasSeleccion.push(_escuela);
    this.listaEscuelasTodas = this.listaEscuelasTodas.filter(
      (e) => e._id !== _escuela._id
    );
  }

  desmarcarEscuelas(_id: String) {
    let _escuela = new Escuela();
    _escuela = this.listaEscuelasSeleccion.find((e) => e._id === _id)!;
    this.listaEscuelasTodas.push(_escuela);
    this.listaEscuelasSeleccion = this.listaEscuelasSeleccion.filter(
      (e) => e._id !== _escuela._id
    );
  }

  //::: //::: TIPOS PROCESOS
  marcarTipoProcesos(_id: String) {
    let _tipoProceso = new TipoProceso();
    _tipoProceso = this.listaProcesosTodos.find((t) => t._id === _id)!;
    this.listaProcesosSeleccion.push(_tipoProceso);
    this.listaProcesosTodos = this.listaProcesosTodos.filter(
      (e) => e._id !== _tipoProceso._id
    );
  }

  desmarcarTipoProceso(_id: String) {
    let _tipoProceso = new TipoProceso();
    _tipoProceso = this.listaProcesosSeleccion.find((t) => t._id === _id)!;
    this.listaProcesosTodos.push(_tipoProceso);
    this.listaProcesosSeleccion = this.listaProcesosSeleccion.filter(
      (t) => t._id !== _tipoProceso._id
    );
  }

  //::: //::: GRUPOS
  marcarGrupos(_id: String) {
    let _grupo = new Grupo();
    _grupo = this.listaGruposTodos.find((g) => g._id === _id)!;
    this.listaGruposSelecion.push(_grupo);
    this.listaGruposTodos = this.listaGruposTodos.filter(
      (g) => g._id !== _grupo._id
    );
  }

  desmarcarGrupos(_id: String) {
    let _grupo = new Grupo();
    _grupo = this.listaGruposSelecion.find((g) => g._id === _id)!;
    this.listaGruposTodos.push(_grupo);
    this.listaGruposSelecion = this.listaGruposSelecion.filter(
      (g) => g._id !== _grupo._id
    );
  }

  //:::  //:::: SEMINARIO
  marcarSeminarios(_id: String) {
    let _seminario = new Seminario();
    _seminario = this.listaSeminariosTodos.find((s) => s._id === _id)!;
    this.listaSeminariosSelecion.push(_seminario);
    this.listaSeminariosTodos = this.listaSeminariosTodos.filter(
      (s) => s._id !== _seminario._id
    );
  }

  desmarcarSeminarios(_id: String) {
    let _seminario = new Seminario();
    _seminario = this.listaSeminariosSelecion.find((s) => s._id === _id)!;
    this.listaSeminariosTodos.push(_seminario);
    this.listaSeminariosSelecion = this.listaSeminariosSelecion.filter(
      (s) => s._id !== _seminario._id
    );
  }

  temp(a: any, b: string) {}

  nuevaPersona() {
    this.userDataService.notificarPersonaNueva('');
    this._id_persona_creada = false;

    this.personaFueCreada = false;
    this.usuarioFueCreado = false;

    this.origenPersona = new OrigenPersona();
    this.datosLlegada = new DatosLlegada();
    this.oracionFe = new OracionFe();
    this.bautizmo = new Bautizmo();
    this.datoUsuario = new Usuario();
    this.personaNueva = new Persona();

    this.personaForm.reset();
    this.origenPersonaForm.reset();
    this.origenPersonaForm.reset();
    this.oracionFeForm.reset();
    this.bautizmoForm.reset();
    this.usuarioForm.reset();
    this.datosLlegadaForm.reset();

    this.limpiarCampos();
    this.limpiarCamposUsuario();

    this.restaurarListaProcesos();

    //this.listaEscuelasTodas = [];
    this.listaEscuelasSeleccion = [];
    //this.listaProcesosTodos = [];
    this.listaProcesosSeleccion = [];
    //this.listaGruposTodos = [];
    this.listaGruposSelecion = [];
    //this.listaSeminariosTodos = [];
    this.listaSeminariosSelecion = [];

    this.informacionEspiritualGuardada = false;

    this.utilidadesService.eliminarUltimaImagenSubida();
  }

  restaurarListaProcesos() {
    //ESCUELAS
    this.listaEscuelasSeleccion.forEach((escuela) => {
      this.listaEscuelasTodas.push(escuela);
    });

    //PROCESOS
    this.listaProcesosSeleccion.forEach((proceso) => {
      this.listaProcesosTodos.push(proceso);
    });

    //GRUPOS
    this.listaGruposSelecion.forEach((grupo) => {
      this.listaGruposTodos.push(grupo);
    });

    //SEMINARIOS
    this.listaSeminariosSelecion.forEach((seminario) => {
      this.listaSeminariosTodos.push(seminario);
    });
  }

  async guardarInformacionEspiritual() {
    let contadorResultadosCorrectos = 0;
    //VERIFICANDO SI EXISTE EL ID DE LA PERSONA QUE SE VA A GUARDAR_INFORMACION_ESPIRITUAL
    //this.extraerPersonaDeBase();

    if (this.personaNueva._id!.length > 0) {
      //GUARDANDO ORIGEN PERSONA
      await this.personaService
        .actualizarOrigenPersona(this.personaNueva._id, this.origenPersona)
        .then((_idPersonaModificada) => {
          if (!_idPersonaModificada) {
            this.toastr.error(
              'No se pudo actualizar los datos de Origen de la Persona.'
            );
          } else {
            contadorResultadosCorrectos++;
          }
        });

      //GUARDANDO DATOS LLEGADA
      await this.personaService
        .actualizarDatosLlegada(this.personaNueva._id, this.datosLlegada)
        .then((_idPersonaModificada) => {
          if (!_idPersonaModificada) {
            this.toastr.error('No se pudo actualizar los datos de Llegada.');
          } else {
            contadorResultadosCorrectos++;
          }
        });

      //GUARDANDO DATOS ORACION DE FE
      await this.personaService
        .actualizarOracionFe(this.personaNueva._id, this.oracionFe)
        .then((_idPersonaModificada) => {
          if (!_idPersonaModificada) {
            this.toastr.error(
              'No se pudo actualizar los datos de oración de fe.'
            );
          } else {
            contadorResultadosCorrectos++;
          }
        });

      //GUARDANDO DATOS DE BAUTIZMO
      await this.personaService
        .actualizarBautizmo(this.personaNueva._id, this.bautizmo)
        .then((_idPersonaModificada) => {
          if (!_idPersonaModificada) {
            this.toastr.error('No se pudo actualizar los datos de bautizmo.');
          } else {
            contadorResultadosCorrectos++;
          }
        });

      //GUARDANDO TIPO PERSONA
      await this.personaService
        .actualizarProcesosTipoPersona(
          this.personaNueva._id,
          this.tipoPersonaSeleccion
        )
        .then((_idPersonaModificada) => {
          if (!_idPersonaModificada) {
            this.toastr.error(
              'No se pudo actualizar los datos de tipo persona.'
            );
          } else {
            contadorResultadosCorrectos++;
          }
        });

      //GUARDANDO ESCUELAS
      await this.personaService
        .actualizarProcesosEscuelas(
          this.personaNueva._id,
          this.listaEscuelasSeleccion
        )
        .then((_idPersonaModificada) => {
          if (!_idPersonaModificada) {
            this.toastr.error('No se pudo actualizar las escuelas.');
          } else {
            contadorResultadosCorrectos++;
          }
        });

      //GUARDANDO TIPO PROCESOS
      await this.personaService
        .actualizarProcesosTipoProcesos(
          this.personaNueva._id,
          this.listaProcesosSeleccion
        )
        .then((_idPersonaModificada) => {
          if (!_idPersonaModificada) {
            this.toastr.error('No se pudo actualizar los procesos.');
          } else {
            contadorResultadosCorrectos++;
          }
        });

      //GUARDANDO  GRUPOS
      await this.personaService
        .actualizarProcesosGrupos(
          this.personaNueva._id,
          this.listaGruposSelecion
        )
        .then((_idPersonaModificada) => {
          if (!_idPersonaModificada) {
            this.toastr.error('No se pudo actualizar los grupos.');
          } else {
            contadorResultadosCorrectos++;
          }
        });

      //GUARDANDO SEMINARIOS
      await this.personaService
        .actualizarProcesosSeminarios(
          this.personaNueva._id,
          this.listaSeminariosSelecion
        )
        .then((_idPersonaModificada) => {
          if (!_idPersonaModificada) {
            this.toastr.error('No se pudo actualizar los seminarios.');
          } else {
            contadorResultadosCorrectos++;
          }
        });

      //AQUI EN EL IF SE DEBE PONER LA CANTIDAD DE RETORNOS
      if (contadorResultadosCorrectos == 9) {
        this.toastr.success(
          'Se actualizó toda la información Espiritual de la persona.'
        );
        this.mostrarBotonesEditar(false);
      } else {
        this.toastr.warning('Actualizacion de datos espirituales incompleta.');
      }

      this.mostrarBotonEditarOracionFeYBautizo = false;
      this.informacionEspiritualGuardada = true;
    } else {
      alert(
        'Se ha producido un error al intentar guardar la información espiritual de la persona, por favor recarga la página o vuelve a iniciar sesión; si el problema persiste, por favor ponte en contacto con el administrador.'
      );
    }

    this.actualizarBase();
  }

  onUpload(e: any) {
    try {
      this.cargandourlImagen = true;
      this.urlImagen = '_';
      /*
        const id = Math.random().toString(36).substring(2);
        const file = e.target.files[0];
        const filePath = 'upload/imagen.png';
        const ref = this.storageFirebase.ref(filePath);
        const task = this.storageFirebase.upload(filePath, file);*/

      //const file = e.target.files[0];
      let fileFoto = e.target.files[0];
      //const id = Math.random().toString(36).substring(2);
      //console.log(Date.now());

      const idx = uuidv4();
      let reader = new FileReader();
      reader.readAsDataURL(fileFoto);

      reader.onloadend = () => {
        this.utilidadesService
          .subirImagenFirebase(
            idx,
            reader.result,
            this.utilidadesService.obtenerCodIglesiaSesion(),
            ""
          )
          .then((urlImagen) => {
            this.urlImagen = urlImagen;
            this.cargandourlImagen = false;
            //return urlImagen;
          });
      };
    } catch (e) {
      this.cargandourlImagen = false;
    }
  }

  async obtenerUrlImagen(): Promise<string> {
    let fileFoto: any;
    const idx = uuidv4();
    let reader = new FileReader();
    await reader.readAsDataURL(fileFoto);

    reader.onloadend = function (event) {
      // El texto del archivo se mostrará por consola aquí
    };

    reader.onloadend = () => {
      this.utilidadesService
        .subirImagenFirebase(
          idx,
          reader.result,
          this.utilidadesService.obtenerCodIglesiaSesion(),
          ""
        )
        .then((urlImagen) => {
          this.urlImagen = urlImagen;
          //return urlImagen;
        });
      return '';
    };

    return '';
  }

  mostrarBotonesEditar(_estado:boolean){
    if (_estado)
      this.mostrarBotonEditar = true;
    else
      this.mostrarBotonEditar = false;

  }

  ngOnDestroy() {
    this.userDataService.notificarPersonaNueva('');
  }
}

/**********************
 //console.log(reader.result);
          console.log("este esta 3");
          await this.utilidadesService.subirImagenFirebase(idx, reader.result).then((urlImagen) => {
          console.log("URL: " + urlImagen);
          console.log("entro seguro 2");      
          //return urlImagen;
           */