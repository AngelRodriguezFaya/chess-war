/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js';
import { OBJLoader } from '../../libs/OBJLoader.js';

import { TipoPieza } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'





/*############################################################################*/
// Clase Dama

export class ReinaModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Constructor

  constructor(gui, titleGui, materialDama, board_position, type_player)
  {
    // Llamamos al constructor padre
    super(board_position, TipoPieza.REINA, type_player);

    // Inicialización de los parámetros
    this.iniParam();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Creación del objeto
    this.createObject(materialDama);
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
  
  createObject(materialDama)
  {
    // var material = new THREE.MeshNormalMaterial({ flatShading : true });
    // this.material = material; // El material se pasa como parámetro al constructor
    var objectLoader = new OBJLoader();

    objectLoader.load('../models/dama/dama.obj', (object) => {
      // Utilizamos el método traverse para asignar el material a cada hijo del objeto cargado
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = materialDama;
          child.geometry.center();
          child.userData = this;
        }
        });

        // Aqui se hacen todas las transformaciones necesarias para que el objeto se vea bien
        object.scale.set(0.7, 0.7, 0.7);
        object.translateY(8);
        object.rotateX(-Math.PI / 2);

        // Se añade el objeto a la escena
        this.add(object);
        
    }, null, null);
  }

  /*############################################################################*/
  // Método update del objeto

  update()
  {
  }
}
