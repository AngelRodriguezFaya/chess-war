/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'

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
  }

  /*############################################################################*/
  // Creación del modelo

  definirMateriales()
  {
    var loader = new THREE.TextureLoader();
    var textura_casilla = loader.load('../../imgs/marmol.png');
    var textura_pieza = loader.load('../../imgs/madera_olivo.png');
    var textura_bump_pieza = loader.load('../../imgs/madera_bump.png');

    this.material_casilla_blanca = new THREE.MeshPhysicalMaterial({ color: 0xF5F5DC, map: textura_casilla, roughness: 0.75, metalness: 0.0, reflectivity: 0.5 });
    this.material_casilla_negra = new THREE.MeshPhysicalMaterial({ color: 0x562B05, map: textura_casilla, roughness: 0.75, metalness: 0.0, reflectivity: 0.5 });
    this.material_casilla_seleccionada = new THREE.MeshPhysicalMaterial({ color: 0x004000, map: textura_casilla, roughness: 0.75, metalness: 0.0, reflectivity: 0.5 });
    this.material_casilla_libre = new THREE.MeshPhysicalMaterial({ color: 0x00ff00, map: textura_casilla, roughness: 0.75, metalness: 0.0, reflectivity: 0.5 });
    this.material_casilla_come = new THREE.MeshPhysicalMaterial({ color: 0xff0000, map: textura_casilla, roughness: 0.75, metalness: 0.0, reflectivity: 0.5 });
    this.material_piezas_negras = new THREE.MeshPhysicalMaterial({ color: 0x3B2F2F, map: textura_pieza, bumpMap: textura_bump_pieza, roughness: 0.25,  metalness: 0.75, reflectivity: 0.5 });
    this.material_piezas_blancas = new THREE.MeshPhysicalMaterial({ color: 0xEAD9C2, map: textura_pieza, bumpMap: textura_bump_pieza, roughness: 0.25,  metalness: 0.75, reflectivity: 0.5 });
  }
  
  crearModelo()
  {
    // Creamos el tablero, esta variable mantendrá referenciadas las piezas y casillas
    this.tablero = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ({ casilla: null, pieza: null })));

    // Constantes
    var ancho = 9;
    var alto = 2;
    var largo = 9;

    // La construcción de las 64 casillas que forman el tablero (8x8)
    for (let fila = 0; fila < 8; fila++) {
      for (let col = 0; col < 8; col++) {
        // Alternamos el material de las casillas
        var material = (fila + col) % 2 == 0 ? this.material_casilla_blanca : this.material_casilla_negra;

        // Se crea la casilla
        var casilla = new CasillaModelo(material, ancho, alto, largo, new Posicion(fila, col), TipoJugador.DESCONOCIDO);

        // Se posiciona la casilla
        casilla.position.set(col * ancho, -(alto/2), fila * largo);

        // Se añade la casilla al tablero
        this.add(casilla);

        // Guardamos la casilla en el tablero
        this.tablero[fila][col].casilla = casilla;
      }
    }

    // Crear las torres negras
    this.torre_negra_1 = new TorreModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.torre_negra_2 = new TorreModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);

    // Crear los caballos negros
    this.caballo_negro_1 = new CaballoModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.caballo_negro_1.rotateY(-Math.PI/2);
    this.caballo_negro_2 = new CaballoModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.caballo_negro_2.rotateY(-Math.PI/2);

    // Crear los alfiles negros
    this.alfil_negro_1 = new AlfilModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.alfil_negro_1.rotateY(Math.PI);
    this.alfil_negro_2 = new AlfilModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.alfil_negro_2.rotateY(Math.PI);

    // Crear la reina negra
    this.reina_negra = new ReinaModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);

    // Crear el rey negro
    this.rey_negro = new ReyModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);

    // Crear los peones
    this.peon_negro_1 = new PeonModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.peon_negro_2 = new PeonModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.peon_negro_3 = new PeonModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.peon_negro_4 = new PeonModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.peon_negro_5 = new PeonModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.peon_negro_6 = new PeonModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.peon_negro_7 = new PeonModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);
    this.peon_negro_8 = new PeonModelo(this.material_piezas_negras, new Posicion(-1, -1), TipoJugador.NEGRO);

    // Crear las torres blancas
    this.torre_blanca_1 = new TorreModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.torre_blanca_2 = new TorreModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);

    // Crear los caballos blancos
    this.caballo_blanco_1 = new CaballoModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.caballo_blanco_1.rotateY(-Math.PI/2);
    this.caballo_blanco_1.rotateY(Math.PI);
    this.caballo_blanco_2 = new CaballoModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.caballo_blanco_2.rotateY(-Math.PI/2);
    this.caballo_blanco_2.rotateY(Math.PI);

    // Crear los alfiles blancos
    this.alfil_blanco_1 = new AlfilModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.alfil_blanco_2 = new AlfilModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);

    // Crear la reina blanca
    this.reina_blanca = new ReinaModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.reina_blanca.rotateY(Math.PI);

    // Crear el rey
    this.rey_blanco = new ReyModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.rey_blanco.rotateY(Math.PI);

    // Crear los peones
    this.peon_blanco_1 = new PeonModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.peon_blanco_1.rotateY(Math.PI);
    this.peon_blanco_2 = new PeonModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.peon_blanco_2.rotateY(Math.PI);
    this.peon_blanco_3 = new PeonModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.peon_blanco_3.rotateY(Math.PI);
    this.peon_blanco_4 = new PeonModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.peon_blanco_4.rotateY(Math.PI);
    this.peon_blanco_5 = new PeonModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.peon_blanco_5.rotateY(Math.PI);
    this.peon_blanco_6 = new PeonModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.peon_blanco_6.rotateY(Math.PI);
    this.peon_blanco_7 = new PeonModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.peon_blanco_7.rotateY(Math.PI);
    this.peon_blanco_8 = new PeonModelo(this.material_piezas_blancas, new Posicion(-1, -1), TipoJugador.BLANCO);
    this.peon_blanco_8.rotateY(Math.PI);

    // Posicionamos las piezas
    this.resetearPiezas();
  }

  resetearPiezas()
  {
    // Resetamos el tablero
    for (let fila = 0; fila < 8; fila++){
      for (let col = 0; col < 8; col++){
        this.tablero[fila][col].pieza = null;
      }
    }

    // Reposicionamos las piezas negras
    this.reposicionarPieza(this.torre_negra_1, new Posicion(0, 0));
    this.reposicionarPieza(this.caballo_negro_1, new Posicion(0, 1));
    this.reposicionarPieza(this.alfil_negro_1, new Posicion(0, 2));
    this.reposicionarPieza(this.reina_negra, new Posicion(0, 3));
    this.reposicionarPieza(this.rey_negro, new Posicion(0, 4));
    this.reposicionarPieza(this.alfil_negro_2, new Posicion(0, 5));
    this.reposicionarPieza(this.caballo_negro_2, new Posicion(0, 6));
    this.reposicionarPieza(this.torre_negra_2, new Posicion(0, 7));

    this.reposicionarPieza(this.peon_negro_1, new Posicion(1, 0));
    this.reposicionarPieza(this.peon_negro_2, new Posicion(1, 1));
    this.reposicionarPieza(this.peon_negro_3, new Posicion(1, 2));
    this.reposicionarPieza(this.peon_negro_4, new Posicion(1, 3));
    this.reposicionarPieza(this.peon_negro_5, new Posicion(1, 4));
    this.reposicionarPieza(this.peon_negro_6, new Posicion(1, 5));
    this.reposicionarPieza(this.peon_negro_7, new Posicion(1, 6));
    this.reposicionarPieza(this.peon_negro_8, new Posicion(1, 7));

    // Reposicionamos las piezas blancas
    this.reposicionarPieza(this.torre_blanca_1, new Posicion(7, 0));
    this.reposicionarPieza(this.caballo_blanco_1, new Posicion(7, 1));
    this.reposicionarPieza(this.alfil_blanco_1, new Posicion(7, 2));
    this.reposicionarPieza(this.reina_blanca, new Posicion(7, 3));
    this.reposicionarPieza(this.rey_blanco, new Posicion(7, 4));
    this.reposicionarPieza(this.alfil_blanco_2, new Posicion(7, 5));
    this.reposicionarPieza(this.caballo_blanco_2, new Posicion(7, 6));
    this.reposicionarPieza(this.torre_blanca_2, new Posicion(7, 7));

    this.reposicionarPieza(this.peon_blanco_1, new Posicion(6, 0));
    this.reposicionarPieza(this.peon_blanco_2, new Posicion(6, 1));
    this.reposicionarPieza(this.peon_blanco_3, new Posicion(6, 2));
    this.reposicionarPieza(this.peon_blanco_4, new Posicion(6, 3));
    this.reposicionarPieza(this.peon_blanco_5, new Posicion(6, 4));
    this.reposicionarPieza(this.peon_blanco_6, new Posicion(6, 5));
    this.reposicionarPieza(this.peon_blanco_7, new Posicion(6, 6));
    this.reposicionarPieza(this.peon_blanco_8, new Posicion(6, 7));
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

  getCasillaPieza(posicion)
  {
    return this.tablero[posicion.getFila()][posicion.getColumna()];
  }

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
  }
}
