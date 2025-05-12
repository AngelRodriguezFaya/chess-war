/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'


/*############################################################################*/
// Clase Tablero

export class TableroModelo extends THREE.Object3D
{
  /*############################################################################*/
  // Constructor

  constructor(gui, titleGui)
  {
    // Llamamos al constructor padre
    super();

    // Inicialización de los parámetros
    this.iniParam();
    
    // Se crea la parte de la interfaz de usuario
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
    // CONSTANTES
    const ANCHO = 9;
    const ALTO = 2;
    const LARGO = 9;


    // Creamos los materiales
    var materialBeige = new THREE.MeshStandardMaterial({ color: 0xF5F5DC});
    var materialMarrones = new THREE.MeshStandardMaterial({ color: 0x562B05});

    // Definimos la geometría de cada casilla (las casillas serán cajas)
    var geometriaCasilla = new THREE.BoxGeometry(ANCHO, ALTO, LARGO);

    // La construcción de las 64 casillas que forman el tablero (8x8)
    for (let fila = 0; fila < 8; fila++){
        for (let col = 0; col < 8; col++){
            // Alternamos el material de las casillas
            let material = (fila + col) % 2 == 0 ? materialBeige : materialMarrones;

            // Se crea la casilla
            var casilla = new THREE.Mesh(geometriaCasilla, material);

            // Se posiciona la casilla
            casilla.position.set(col * ANCHO, -(ALTO/2), fila * LARGO);

            // Se añade la casilla al tablero
            this.add(casilla);
        }
    }
  }

  /*############################################################################*/
  // Método update del objeto

  update()
  {
  }
}
