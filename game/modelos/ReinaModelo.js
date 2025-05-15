/*############################################################################*/
// Importaciones

import { OBJLoader } from '../../libs/OBJLoader.js';

import { TipoPieza } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'





/*############################################################################*/
// Clase Dama

export class ReinaModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Constructor

  constructor(material, posicion_en_tablero, tipo_jugador)
  {
    // Llamamos al constructor padre
    super(posicion_en_tablero, TipoPieza.REINA, tipo_jugador);

    // Creación del modelo
    this.crearModelo(material);
  }

  /*############################################################################*/
  // Creación del modelo
  
  crearModelo(material)
  {
    // var material = new THREE.MeshNormalMaterial({ flatShading : true });
    // this.material = material; // El material se pasa como parámetro al constructor
    var objectLoader = new OBJLoader();

    objectLoader.load('../models/dama/dama.obj', (object) => {
      // Utilizamos el método traverse para asignar el material a cada hijo del objeto cargado
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = material;
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
