/*############################################################################*/
// Importaciones

import * as THREE from '../libs/three.module.js';
import { OBJLoader } from '../libs/OBJLoader.js';





/*############################################################################*/
// Clase Dama

export class Dama extends THREE.Object3D
{
  /*############################################################################*/
  // Constructor

  constructor(gui, titleGui)
  {
    // Llamamos al constructor padre
    super();

    // Inicialización de los parámetros
    this.iniParam();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Creación del objeto
    this.createObject();
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
  
  createObject()
  {
    var material = new THREE.MeshNormalMaterial({ flatShading : true });
    var objectLoader = new OBJLoader();

    objectLoader.load('../models/dama/dama.obj', (object) => {
      // Utilizamos el método traverse para asignar el material a cada hijo del objeto cargado
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = material;
        }
        });

        // Aqui se hacen todas las transformaciones necesarias para que el objeto se vea bien
        this.rotation.x = -Math.PI / 2;
        this.rotation.z = Math.PI;

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
