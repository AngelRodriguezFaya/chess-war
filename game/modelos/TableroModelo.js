/**
 * @file TableroModelo.js
 * @description Modela un tablero de ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */

/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as TWEEN from '../../libs/tween.module.js'

import { Posicion } from '../logica/Jugada.js';
import { TipoJugador } from '../logica/TiposUtils.js'
import { CasillaModelo } from './CasillaModelo.js';
import { AlfilModelo } from './AlfilModelo.js'
import { TorreModelo } from './TorreModelo.js'
import { ReinaModelo } from './ReinaModelo.js'
import { CaballoModelo } from './CaballoModelo.js'
import { PeonModelo } from './PeonModelo.js'
import { ReyModelo } from './ReyModelo.js'



/*############################################################################*/
// Clase Tablero

/**
 * @class TableroModelo
 * @description Modelo 3D de un tablero de ajedrez. Además se crean y posicionan las piezas.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */
export class TableroModelo extends THREE.Object3D
{
  /*############################################################################*/
  // Constructor

  constructor()
  {
    // Llamamos al constructor padre
    super();

    // Definimos los materiales
    this.definirMateriales();

    // Creación del modelo
    this.crearModelo();

    // Inicializar animaciones
    this.inicializarAnimaciones();
  }



  /*############################################################################*/
  // Creación del modelo

  definirMateriales()
  {
    var loader = new THREE.TextureLoader();
    var textura_casilla = loader.load('../../imgs/marmol.png');
    var textura_pieza = loader.load('../../imgs/madera_olivo.png');
    var textura_bump_pieza = loader.load('../../imgs/madera_bump.png');

    this.material_casilla_blanca = new THREE.MeshPhysicalMaterial({ color: 0xF5F5DC, map: textura_casilla, roughness: 0.0, metalness: 0.1 });
    this.material_casilla_negra = new THREE.MeshPhysicalMaterial({ color: 0x562B05, map: textura_casilla, roughness: 0.0, metalness: 0.1 });
    this.material_casilla_seleccionada = new THREE.MeshPhysicalMaterial({ color: 0x004000, map: textura_casilla, roughness: 0.0, metalness: 0.1 });
    this.material_casilla_libre = new THREE.MeshPhysicalMaterial({ color: 0x00ff00, map: textura_casilla, roughness: 0.0, metalness: 0.1 });
    this.material_casilla_come = new THREE.MeshPhysicalMaterial({ color: 0xff0000, map: textura_casilla, roughness: 0.0, metalness: 0.1 });
    this.material_piezas_negras = new THREE.MeshPhysicalMaterial({ color: 0x5A4545, map: textura_pieza, bumpMap: textura_bump_pieza, roughness: 0.25, metalness: 0.75, reflectivity: 1.0 });
    this.material_piezas_blancas = new THREE.MeshPhysicalMaterial({ color: 0xEAD9C2, map: textura_pieza, bumpMap: textura_bump_pieza, roughness: 0.25, metalness: 0.75, reflectivity: 1.0 });
  }
  


  crearModelo()
  { 
    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------- Tablero -----------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------

    // Creamos el tablero, esta variable mantendrá referenciadas las piezas y casillas
    this.tablero = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ({ casilla: null, pieza: null })));

    // Constantes. 
    // Se definen las dimensiones de las casillas del tablero
    const ANCHO = 9;
    const ALTO = 2;
    const LARGO = 9;

    // La construcción de las 64 casillas que forman el tablero (8x8)
    for (let fila = 0; fila < 8; fila++) {
      for (let col = 0; col < 8; col++) {
        // Alternamos el material de las casillas
        var material = (fila + col) % 2 == 0 ? this.material_casilla_blanca : this.material_casilla_negra;

        // Se crea la casilla
        var casilla = new CasillaModelo(material, ANCHO, ALTO, LARGO, new Posicion(fila, col), TipoJugador.DESCONOCIDO);

        // Se posiciona la casilla
        casilla.position.set(col * ANCHO, -(ALTO/2), fila * LARGO);

        // Se añade la casilla al tablero
        this.add(casilla);

        // Guardamos la casilla en el tablero
        this.tablero[fila][col].casilla = casilla;
      }
    }

    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------- Piezas ------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------
    
    // Creamos las piezas negras
    this.crearPiezasNegras();

    // Creamos las piezas blancas
    this.crearPiezasBlancas();

    // Posicionamos las piezas, para ello llamamos al método para resetearlas
    this.resetearPiezas();
  }



  // ----------------------------- Creación de las piezas negras -----------------------------------

  crearPiezasNegras(){
    // Declaramos las piezas de las que sólo hay una unidad por jugador, es decir, el rey y la reina

    // Creamos la reina
    this.reina_negra = new ReinaModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);

    // Creamos el rey
    this.rey_negro = new ReyModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);


    // Declaramos los arrays de las piezas que hay 2 o más unidades por jugador
    this.torres_negras = [];    // 2 torres
    this.caballos_negros = [];  // 2 caballos
    this.alfiles_negros = [];   // 2 alfiles
    this.peones_negros = [];    // 8 peones


    // Creamos las torres, caballos y alfiles
    for(let i = 0; i < 2; i++){
      let torre = new TorreModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
      this.torres_negras.push(torre);

      let caballo = new CaballoModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
      caballo.rotateY(-Math.PI/2);
      this.caballos_negros.push(caballo);

      let alfil = new AlfilModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
      alfil.rotateY(Math.PI);
      this.alfiles_negros.push(alfil);
    }

    // Creamos los peones.
    for(let i = 0; i < 8; i++){
      let peon = new PeonModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
      this.peones_negros.push(peon);
    }

  }



  // ----------------------------- Creación de las piezas blancas -----------------------------------

  crearPiezasBlancas(){
    // Declaramos las piezas de las que sólo hay una unidad por jugador, es decir, el rey y la reina

    // Creamos la reina
    this.reina_blanca = new ReinaModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.reina_blanca.rotateY(Math.PI);

    // Creamos el rey
    this.rey_blanco = new ReyModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.rey_blanco.rotateY(Math.PI);


    // Declaramos los arrays de las piezas que hay 2 o más unidades por jugador
    this.torres_blancas = [];    // 2 torres
    this.caballos_blancos = [];  // 2 caballos
    this.alfiles_blancos = [];   // 2 alfiles
    this.peones_blancos = [];    // 8 peones


    // Creamos las torres, caballos y alfiles
    for(let i = 0; i < 2; i++){
      let torre = new TorreModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
      this.torres_blancas.push(torre);

      let caballo = new CaballoModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
      caballo.rotateY(Math.PI/2);
      this.caballos_blancos.push(caballo);

      let alfil = new AlfilModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
      this.alfiles_blancos.push(alfil);
    }

    // Creamos los peones.
    for(let i = 0; i < 8; i++){
      let peon = new PeonModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
      peon.rotateY(Math.PI);
      this.peones_blancos.push(peon);
    }

  }



  resetearPiezas()
  {
    // -----------------------------  Resetamos el tablero ---------------------------------
    for (let fila = 0; fila < 8; fila++){
      for (let col = 0; col < 8; col++){
        this.tablero[fila][col].pieza = null;
      }
    }


    // ----------------------- Reposicionamos las piezas negras -----------------------------

    // Reposicionamos la reina y el rey
    this.reposicionarPieza(this.reina_negra, new Posicion(0, 3));
    this.reposicionarPieza(this.rey_negro, new Posicion(0, 4));

    // Reposicionamos las torres
    this.reposicionarPieza(this.torres_negras[0], new Posicion(0, 0));
    this.reposicionarPieza(this.torres_negras[1], new Posicion(0, 7));

    // Reposicionamos los caballos
    this.reposicionarPieza(this.caballos_negros[0], new Posicion(0, 1));
    this.reposicionarPieza(this.caballos_negros[1], new Posicion(0, 6));

    // Reposicionamo los alfiles
    this.reposicionarPieza(this.alfiles_negros[0], new Posicion(0, 2));
    this.reposicionarPieza(this.alfiles_negros[1], new Posicion(0, 5));

    // Reposicionamos los peones
    for(let i = 0; i < 8; i++){
      this.reposicionarPieza(this.peones_negros[i], new Posicion(1, i));
    }


    // ----------------------- Reposicionamos las piezas blancas -----------------------------

    // Reposicionamos la reina y el rey
    this.reposicionarPieza(this.reina_blanca, new Posicion(7, 3));
    this.reposicionarPieza(this.rey_blanco, new Posicion(7, 4));

    // Reposicionamos las torres
    this.reposicionarPieza(this.torres_blancas[0], new Posicion(7, 0));
    this.reposicionarPieza(this.torres_blancas[1], new Posicion(7, 7));

    // Reposicionamos los caballos
    this.reposicionarPieza(this.caballos_blancos[0], new Posicion(7, 1));
    this.reposicionarPieza(this.caballos_blancos[1], new Posicion(7, 6));

    // Reposicionamos los alfiles  
    this.reposicionarPieza(this.alfiles_blancos[0], new Posicion(7, 2));
    this.reposicionarPieza(this.alfiles_blancos[1], new Posicion(7, 5));
    
    // Reposicionamos los peones
    for(let i = 0; i < 8; i++){
      this.reposicionarPieza(this.peones_blancos[i], new Posicion(6, i));
    }

  }



  reposicionarPieza(objeto_pieza, posicion_tablero)
  {
    // Añadimos el objeto a la escena
    if (!this.children.includes(objeto_pieza)) {
      this.add(objeto_pieza);
    }

    // Posicionamos la pieza tanto en el espacio como en el tablero
    objeto_pieza.position.set(posicion_tablero.getColumna() * 9, 0, posicion_tablero.getFila() * 9);
    objeto_pieza.setPosicionTablero(posicion_tablero);
    this.tablero[posicion_tablero.getFila()][posicion_tablero.getColumna()].pieza = objeto_pieza;
  }



  convertirEnReina(posicion)
  {

  }



  /*############################################################################*/
  // Acceso al tablero

  getCasillaPieza(posicion){ return this.tablero[posicion.getFila()][posicion.getColumna()]; }



  eliminaPieza(posicion)
  {
    var casilla_tablero = this.getCasillaPieza(posicion);

    if (casilla_tablero.pieza === null) {
      return;
    }

    this.remove(casilla_tablero.pieza);
    casilla_tablero.pieza = null;
  }



  muevePieza(posicion_actual, posicion_siguiente)
  {
    this.getCasillaPieza(posicion_siguiente).pieza = this.getCasillaPieza(posicion_actual).pieza;
    this.getCasillaPieza(posicion_actual).pieza = null;
    
    this.getCasillaPieza(posicion_siguiente).pieza.setPosicionTablero(posicion_siguiente);
    this.getCasillaPieza(posicion_siguiente).pieza.position.set(posicion_siguiente.getColumna() * 9, 0, posicion_siguiente.getFila() * 9);
  }



  /*############################################################################*/
  // Animaciones

  inicializarAnimaciones()
  {
    // Estados de la animación
    this.animando = false;
    this.termina_animacion = false;

    this.dentro_animacion = false;
  }



  animarMovimiento(jugada)
  {
    var posicion_actual = jugada.getMovimiento().getPosicionActual();
    var posicion_siguiente = jugada.getMovimiento().getPosicionSiguiente();
    var origen = { x: posicion_actual.getColumna() * 9, z: posicion_actual.getFila() * 9 };
    var destino = { x: posicion_siguiente.getColumna() * 9, z: posicion_siguiente.getFila() * 9 };
    var pieza = this.tablero[posicion_actual.getFila()][posicion_actual.getColumna()].pieza;

    // Animacion
    var movimiento = new TWEEN.Tween(origen)
      .to(destino, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onStart(() => { this.dentro_animacion = true; })
      .onUpdate(() => { pieza.position.x = origen.x; pieza.position.z = origen.z; })
      .onComplete(() => { this.dentro_animacion = false; })
      .repeat(0)
      .start();
    
    if (jugada.getDisponibleExtra()) {
      var posicion_actual_extra = jugada.getMovimientoExtra().getPosicionActual();
      var posicion_siguiente_extra = jugada.getMovimientoExtra().getPosicionSiguiente();
      var origen_extra = { x: posicion_actual_extra.getColumna() * 9, z: posicion_actual_extra.getFila() * 9 };
      var destino_extra = { x: posicion_siguiente_extra.getColumna() * 9, z: posicion_siguiente_extra.getFila() * 9 };
      var pieza_extra = this.tablero[posicion_actual_extra.getFila()][posicion_actual_extra.getColumna()].pieza;

      // Animacion
      var movimiento_extra = new TWEEN.Tween(origen_extra)
        .to(destino_extra, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onStart(() => { })
        .onUpdate(() => { pieza_extra.position.x = origen_extra.x; pieza_extra.position.z = origen_extra.z; })
        .onComplete(() => { })
        .repeat(0)
        .start();
    }

    if (jugada.getDisponibleCome()) {
      var pieza_come = this.getCasillaPieza(jugada.getPosicionCome()).pieza;
      var origen_come = { y: pieza_come.position.y };
      var destino_come = { y: 100 };

      // Animacion
      var movimiento_come = new TWEEN.Tween(origen_come)
        .to(destino_come, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => { pieza_come.position.y = origen_come.y; })
        .repeat(0)
        .start();
    }
  }



  terminaAnimacion(){ return this.termina_animacion; }



  /*############################################################################*/
  // Actualización de materiales

  actualizaMaterialCasilla(posicion, material)
  {
    this.getCasillaPieza(posicion).casilla.traverse((obj) => { obj.material = material; });
  }



  reseteaColorCasillas()
  {
    for (let fila = 0; fila < 8; fila++) {
      for (let col = 0; col < 8; col++) {
        var material = (fila + col) % 2 == 0 ? this.material_casilla_blanca : this.material_casilla_negra;

        this.actualizaMaterialCasilla(new Posicion(fila, col), material);
      }
    }
  }



  actualizaColorCasillas(jugadas)
  {
    this.reseteaColorCasillas();

    for (let i = 0; i < jugadas.length; i++) {
      this.actualizaMaterialCasilla(jugadas[i].getMovimiento().getPosicionActual(), this.material_casilla_seleccionada);
      this.actualizaMaterialCasilla(jugadas[i].getMovimiento().getPosicionSiguiente(), this.material_casilla_libre);
      
      // Hay un movimiento extra
      if (jugadas[i].getDisponibleExtra()) {
        this.actualizaMaterialCasilla(jugadas[i].getMovimientoExtra().getPosicionActual(), this.material_casilla_seleccionada);
        this.actualizaMaterialCasilla(jugadas[i].getMovimientoExtra().getPosicionSiguiente(), this.material_casilla_libre);
      }

      // Hay un movimiento para comer
      if (jugadas[i].getDisponibleCome()) {
        this.actualizaMaterialCasilla(jugadas[i].getPosicionCome(), this.material_casilla_come);
      }
    }
  }



  /*############################################################################*/
  // Método update del objeto

  actualizar()
  {
    for (let fila = 0; fila < 8; fila++) {
      for (let col = 0; col < 8; col++) {
        var casilla_tablero = this.tablero[fila][col];
        var casilla = casilla_tablero.casilla;
        var pieza = casilla_tablero.pieza;

        if (casilla !== null) {
          casilla.actualizar();
        }

        if (pieza !== null) {
          pieza.actualizar();
        }
      }
    }

    if (this.dentro_animacion) {
      this.animando = true;
      this.termina_animacion = false;
    }
    else {
      if (this.animando) {
        this.termina_animacion = true;
      }
      else {
        this.termina_animacion = false;
      }

      this.animando = false;
    }
  }

}
