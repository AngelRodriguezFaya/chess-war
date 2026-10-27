/**
 * @file PiezaBaseModelo.js
 * @description Clase padre de las piezas. 
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */

/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'



/*############################################################################*/
// Clase Base para la creación de las piezas

/**
 * @class PiezaBaseModelo
 * @description Clase base para la creación de las piezas del ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */
export class PiezaBaseModelo extends THREE.Object3D
{
  /*############################################################################*/
  // Constructor

  constructor(posicion_en_tablero, tipo_pieza, tipo_jugador)
  {
    // Llamamos al constructor padre
    super();

    // Guardamos la información relativa a la lógica del juego
    this._posicion_en_tablero = posicion_en_tablero.clone();
    this._tipo_pieza = tipo_pieza;
    this._tipo_jugador = tipo_jugador;

    // Estados de la animación
    this.animando = false;
    this.termina_animacion = false;
  }



  /*############################################################################*/
  // Getters y Setters

  getPosicionTablero(){ return this._posicion_en_tablero; }

  getTipoPieza(){ return this._tipo_pieza; }

  getTipoJugador(){ return this._tipo_jugador; }

  setPosicionTablero(posicion_en_tablero){ this._posicion_en_tablero = posicion_en_tablero;}

  setTipoPieza(tipo_pieza){ this._tipo_pieza = tipo_pieza; }

  setTipoJugador(tipo_jugador){ this._tipo_jugador = tipo_jugador; }

  terminaAnimacion(){ return this.termina_animacion; }


  
  /*############################################################################*/
  // Método update del objeto

  actualizar(animando)
  {
    if (animando) {
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
