/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'





/*############################################################################*/
// Clase Base para la creación de las piezas

export class PiezaBaseModelo extends THREE.Object3D
{
  /*############################################################################*/
  // Constructor

  constructor(posicion_en_tablero, tipo_pieza, tipo_jugado)
  {
    // Llamamos al constructor padre
    super();

    // Guardamos la información relativa a la lógica del juego
    this._posicion_en_tablero = posicion_en_tablero.clone();
    this._tipo_pieza = tipo_pieza;
    this._tipo_jugador = tipo_jugado;
  }

  getPosicionTablero()
  {
    return this._posicion_en_tablero;
  }

  getTipoPieza()
  {
    return this._tipo_pieza;
  }

  getTipoJugador()
  {
    return this._tipo_jugador;
  }

  setPosicionTablero(posicion_en_tablero)
  {
    this._posicion_en_tablero = posicion_en_tablero;
  }

  setTipoPieza(tipo_pieza)
  {
    this._tipo_pieza = tipo_pieza;
  }

  setTipoJugador(tipo_jugador)
  {
    this._tipo_jugador = tipo_jugador;
  }
}
