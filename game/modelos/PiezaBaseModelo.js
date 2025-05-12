/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'





/*############################################################################*/
// Clase Base para la creación de las piezas

export class PiezaBaseModelo extends THREE.Object3D
{
  /*############################################################################*/
  // Constructor

  constructor(board_position, type_piece, type_player)
  {
    // Llamamos al constructor padre
    super();

    // Guardamos la información relativa a la lógica del juego
    this.board_position = board_position.clone();
    this.type_piece = type_piece;
    this.type_player = type_player;
  }

  /*############################################################################*/
  // Getters/Setters

  getBoardPosition()
  {
    return this.board_position;
  }

  getTypePiece()
  {
    return this.type_piece;
  }

  getTypePlayer()
  {
    return this.type_player;
  }
}
