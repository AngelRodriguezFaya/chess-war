/**
 * @file CaballoModelo.js
 * @description Modela un caballo de ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */

/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'

import { TipoPieza } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'



/*############################################################################*/
// Clase Caballo

/**
 * @class CaballoModelo
 * @description Modelo 3D de un caballo de ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */
export class CaballoModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Variables de clase
  // Geometrías ------------------------------------------
  static RES = 20; // Resolución de las geometrías
  static geometriaBase = null;
  static geometriaCuerpo = null;


  /*############################################################################*/
  // Constructor

  constructor(material, posicion_en_tablero, tipo_jugador)
  {
    // Llamamos al constructor padre
    super(posicion_en_tablero, TipoPieza.CABALLO, tipo_jugador);

    // Creación del modelo
    this.crearModelo(material);
  }
  


  /*############################################################################*/
  // Creación del modelo
  
  crearModelo(material)
  {
    var evaluator = new CSG.Evaluator();

    // ------------ Base -----------------------------------------------

    if(CaballoModelo.geometriaBase == null)
      CaballoModelo.geometriaBase = this.crearGeometriaBase();

    // Convertimos a brush
    var base1 = new CSG.Brush(CaballoModelo.geometriaBase, material);
    var base2 = new CSG.Brush(CaballoModelo.geometriaBase, material);

    // Posicionamos la segunda base
    base2.scale.set(0.75, 0.75, 0.75);
    base2.position.set(0, 0.66, 0);

    // Hacemos las operaciones lógicas
    this.caballo = evaluator.evaluate(base1, base2, CSG.ADDITION);

    // ------------ Cuerpo -----------------------------------------------

    // Geometría
    if(CaballoModelo.geometriaCuerpo == null)
      CaballoModelo.geometriaCuerpo = this.crearGeometriaCuerpo();

    // Convertimos a brush
    var cuerpo = new CSG.Brush(CaballoModelo.geometriaCuerpo, material);

    // Hacemos las operaciones lógicas
    this.caballo = evaluator.evaluate(this.caballo, cuerpo, CSG.ADDITION);

    // Escalado final
    this.caballo.scale.set(4, 4, 4);

    // UserData
    this.caballo.userData = this;

    // Terminamos añadiendo el resultado final
    this.add(this.caballo);
  }



  /*############################################################################*/
  // Métodos para crear las geometrías de las partes del modelo
  
  crearGeometriaBase(){
    var baseShape = new THREE.Shape();
    baseShape.moveTo(0, 0);
    baseShape.lineTo(1, 0);
    baseShape.lineTo(0.9, 0.5);
    baseShape.lineTo(0.75, 0.66);
    baseShape.lineTo(0, 0.66);

    var basePoints = baseShape.getPoints(); 
    var baseGeom = new THREE.LatheGeometry(basePoints, CaballoModelo.RES, 0, Math.PI*2);

    return baseGeom;
  }

  crearGeometriaCuerpo(){
    var cuerpoShape = new THREE.Shape();
    cuerpoShape.moveTo(0, 0);
    cuerpoShape.lineTo(1, 0);
    cuerpoShape.lineTo(1.2, 1.1);
    cuerpoShape.lineTo(1.1, 1.5);
    cuerpoShape.lineTo(0.5, 2.25);
    cuerpoShape.lineTo(0.75, 2.4);
    cuerpoShape.lineTo(0.85, 2.25);
    cuerpoShape.lineTo(1, 2.2);
    cuerpoShape.lineTo(1.5, 2.35);
    cuerpoShape.lineTo(1.6, 2.75);
    cuerpoShape.lineTo(1.5, 3);
    cuerpoShape.lineTo(1.4, 3.1);
    cuerpoShape.lineTo(0.8, 4);
    cuerpoShape.lineTo(0, 4);
    cuerpoShape.lineTo(-0.4, 4.5);
    cuerpoShape.lineTo(-0.45, 4);
    cuerpoShape.lineTo(-1.2, 3);
    cuerpoShape.lineTo(-0.85, 1.25);
    cuerpoShape.lineTo(-1.25, 0.35);
    cuerpoShape.lineTo(-1, 0);

    var ojosChape = new THREE.Shape();
    ojosChape.absellipse(0.7, 3.25, 0.2, 0.2, 0, Math.PI*2);
    cuerpoShape.holes.push(ojosChape);

    var extrusionConfig = {curveSegments: CaballoModelo.RES, steps: CaballoModelo.RES, depth: 1, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.05, bevelSegments: 100}
    var cuerpoGeom = new THREE.ExtrudeGeometry(cuerpoShape, extrusionConfig);

    // Posicionamos la geometría
    // cuerpoGeom.translate(0, 0, -0.5);
    cuerpoGeom.scale(0.45, 0.5, 0.45);
    cuerpoGeom.translate(0, 0.66, -0.2);


    return cuerpoGeom;
  }

  /*############################################################################*/
  // Método update del objeto

  actualizar()
  {
  }
}
