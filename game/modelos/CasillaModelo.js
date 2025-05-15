/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'

import { TipoPieza } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'





/*############################################################################*/
// Clase Caballo

export class CasillaModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Constructor

  constructor(material, ancho, alto, largo, board_position, type_player)
  {
    // Llamamos al constructor padre
    super(board_position, TipoPieza.CASILLA, type_player);

    // Creación del modelo
    this.crearModelo(material, ancho, alto, largo);
  }

  /*############################################################################*/
  // Creación del modelo
  
  crearModelo(material, ancho, alto, largo)
  {
    // Geometria de la casilla
    var geometriaCasilla = new THREE.BoxGeometry(ancho, alto, largo);

    // Se crea la casilla
    this.casilla = new THREE.Mesh(geometriaCasilla, material);

    // Guardamos el userData
    this.casilla.userData = this;

    // Se añade el mesh
    this.add(this.casilla);
  }

  /*############################################################################*/
  // Método update del objeto

  update()
  {
  }
}
