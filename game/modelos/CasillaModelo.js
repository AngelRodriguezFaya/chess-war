/**
 * @file CasillaModelo.js
 * @description Modela una casilla (o enroque) del tablero de ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */

/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'

import { TipoPieza } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'



/*############################################################################*/
// Clase Caballo

/**
 * @class CasillaModelo
 * @description Modelo 3D de una casilla (o enroque) del tablero de ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */
export class CasillaModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Variables de clase
  // Geometrías ------------------------------------------
  static geometriaCasilla = null;



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
    if(CasillaModelo.geometriaCasilla == null)
      CasillaModelo.geometriaCasilla = this.crearGeometriaCasilla(ancho, alto, largo);

    // Se crea la casilla
    this.casilla = new THREE.Mesh(CasillaModelo.geometriaCasilla, material);

    // Guardamos el userData
    this.casilla.userData = this;

    // Se añade el mesh
    this.add(this.casilla);
  }



  /*############################################################################*/
  // Método para crear la geometría de la casilla

  crearGeometriaCasilla(ancho, alto, largo){
    var casillaGeom = new THREE.BoxGeometry(ancho, alto, largo);

    return casillaGeom;
  }



  /*############################################################################*/
  // Método update del objeto

  actualizar()
  {
  }
}
