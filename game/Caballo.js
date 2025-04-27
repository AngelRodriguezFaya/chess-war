/*############################################################################*/
// Importaciones

import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'





/*############################################################################*/
// Clase Caballo

export class Caballo extends THREE.Object3D
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
    var evaluator = new CSG.Evaluator();

    // Materiales
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    /*####################################*/
    // Base

    // Geometría
    var base_shape = new THREE.Shape();

    base_shape.moveTo(0, 0);
    base_shape.lineTo(1, 0);
    base_shape.lineTo(0.9, 0.5);
    base_shape.lineTo(0.75, 0.66);
    base_shape.lineTo(0, 0.66);

    var base_points = base_shape.getPoints(); 
    var base_geometry = new THREE.LatheGeometry(base_points, 64, 0, Math.PI*2);

    // Convertimos a brush
    var base_geometry_brush = new CSG.Brush(base_geometry, material);

    // Test
    this.base_mesh = new THREE.Mesh(base_geometry, material);
    this.add(this.base_mesh);
  }

  /*############################################################################*/
  // Método update del objeto

  update()
  {
  }
}
