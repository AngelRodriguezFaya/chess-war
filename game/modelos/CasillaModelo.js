/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'

import { TypePiece } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'





/*############################################################################*/
// Clase Caballo

export class CasillaModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Constructor

  constructor(gui, titleGui, material, ancho, alto, largo, board_position, type_player)
  {
    // Llamamos al constructor padre
    super(board_position, TypePiece.BOX, type_player);

    // Inicialización de los parámetros
    this.iniParam();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Creación del objeto
    this.createObject(material, ancho, alto, largo);
  }

  /*############################################################################*/
  // Inicialización de los parámetros

  iniParam()
  {
  }

  /*############################################################################*/
  // Interfaz de usuario

  createGUI(gui, titleGui)
  {
  }

  /*############################################################################*/
  // Creación del objeto

  /*########################################################*/
  // Creación
  
  createObject(material, ancho, alto, largo)
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
