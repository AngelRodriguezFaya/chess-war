/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'

import { TypePiece } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'





/*############################################################################*/
// Clase Caballo

export class CaballoModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Constructor

  constructor(gui, titleGui, material, board_position, type_player)
  {
    // Llamamos al constructor padre
    super(board_position, TypePiece.KNIGHT, type_player);

    // Inicialización de los parámetros
    this.iniParam();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Creación del objeto
    this.createObject(material);
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
  
  createObject(material)
  {
    var evaluator = new CSG.Evaluator();

    // // Materiales
    // var material = new THREE.MeshNormalMaterial();
    // material.flatShading = true;
    // material.needsUpdate = true;
    // this.material = material; // El material se pasa como parámetro al constructor


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
    var base_geometry_1 = new THREE.LatheGeometry(base_points, 64, 0, Math.PI*2);
    var base_geometry_2 = new THREE.LatheGeometry(base_points, 64, 0, Math.PI*2);

    // Aplicamos las transformaciones
    base_geometry_2.applyMatrix4(new THREE.Matrix4().makeScale(0.75, 0.5, 0.75));
    base_geometry_2.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.66, 0));

    // Convertimos a brush
    var base_geometry_1_brush = new CSG.Brush(base_geometry_1, material);
    var base_geometry_2_brush = new CSG.Brush(base_geometry_2, material);

    // Hacemos las operaciones lógicas
    this.model = evaluator.evaluate(base_geometry_1_brush, base_geometry_2_brush, CSG.ADDITION);

    /*####################################*/
    // Body

    // Geometría
    var body_shape = new THREE.Shape();
    body_shape.moveTo(0, 0);
    body_shape.lineTo(1, 0);
    body_shape.lineTo(1.2, 1.1);
    body_shape.lineTo(1.1, 1.5);
    body_shape.lineTo(0.5, 2.25);
    body_shape.lineTo(0.75, 2.4);
    body_shape.lineTo(0.85, 2.25);
    body_shape.lineTo(1, 2.2);
    body_shape.lineTo(1.5, 2.35);
    body_shape.lineTo(1.6, 2.75);
    body_shape.lineTo(1.5, 3);
    body_shape.lineTo(1.4, 3.1);
    body_shape.lineTo(0.8, 4);
    body_shape.lineTo(0, 4);
    body_shape.lineTo(-0.4, 4.5);
    body_shape.lineTo(-0.45, 4);
    body_shape.lineTo(-1.2, 3);
    body_shape.lineTo(-0.85, 1.25);
    body_shape.lineTo(-1.25, 0.35);
    body_shape.lineTo(-1, 0);

    var eye_chape = new THREE.Shape();
    eye_chape.absellipse(0.7, 3.25, 0.2, 0.2, 0, Math.PI*2);
    body_shape.holes.push(eye_chape);

    var extrusion_config = {curveSegments: 100, steps: 100, depth: 1, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.05, bevelSegments: 100}
    var body_geometry = new THREE.ExtrudeGeometry(body_shape, extrusion_config);

    // Aplicamos las transformaciones
    body_geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.5));
    body_geometry.applyMatrix4(new THREE.Matrix4().makeScale(0.45, 0.5, 0.45));
    body_geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.99, 0));

    // Convertimos a brush
    var body_geometry_brush = new CSG.Brush(body_geometry, material);

    // Hacemos las operaciones lógicas
    this.model = evaluator.evaluate(this.model, body_geometry_brush, CSG.ADDITION);

    // Escalado final
    this.model.scale.set(4, 4, 4);

    /*####################################*/
    // Mesh

    // UserData
    this.model.userData = this;

    // Terminamos añadiendo el resultado final
    this.add(this.model);
  }

  /*############################################################################*/
  // Método update del objeto

  update()
  {
  }
}
