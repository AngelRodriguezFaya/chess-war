/**
 * @file AlfilModelo.js
 * @description Modela un alfil de ajedrez.
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
// Clase Alfil

/**
 * @class AlfilModelo
 * @description Modelo 3D de un alfil de ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */
export class AlfilModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Variables de clase
  // Geometrías ------------------------------------------
  static RES = 20; // Resolución de las geometrías
  static geometriaCuerpo = null;
  static geometriaEsferaCabeza = null;
  static geometriaHuecoCabeza = null;


  /*############################################################################*/
  // Constructor

  constructor(material, posicion_en_tablero, tipo_jugador)
  {
    // Llamamos al constructor padre
    super(posicion_en_tablero, TipoPieza.ALFIL, tipo_jugador);

    // Creación del modelo
    this.crearModelo(material);
  }



  /*############################################################################*/
  // Creación del modelo
  
  crearModelo(material)
  {
    //------------ Definimos el cuerpo del alfil  -----------------
    if(AlfilModelo.geometriaCuerpo == null)
      AlfilModelo.geometriaCuerpo = this.crearGeometriaCuerpo();

    // Se construye el objeto Brush que modela el cuerpo del alfil
    var cuerpo = new CSG.Brush(AlfilModelo.geometriaCuerpo, material);    
    
  
    //------------ Damos los últimos detalles a la cabeza del alfil  -----------------
      
    // Se construyen los objetos Brush

    if(AlfilModelo.geometriaEsferaCabeza == null)
      AlfilModelo.geometriaEsferaCabeza = this.crearGeometriaEsferaCabeza();
    
    var esfera = new CSG.Brush(AlfilModelo.geometriaEsferaCabeza, material);
    

    if(AlfilModelo.geometriaHuecoCabeza == null)
      AlfilModelo.geometriaHuecoCabeza = this.crearGeometriaHuecoCabeza();
    
    var caja = new CSG.Brush(AlfilModelo.geometriaHuecoCabeza, material);

    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    // Realizamos las operaciones booleanas
    var result1 = evaluator.evaluate(cuerpo, esfera, CSG.ADDITION);
    var alfilFinal = evaluator.evaluate(result1, caja, CSG.SUBTRACTION);

    // Guardamos la userData
    alfilFinal.userData = this;

    this.add(alfilFinal);
  }



  /*############################################################################*/
  // Método para crear la geometría del cuerpo del modelo

  crearGeometriaCuerpo(){
    // Lo haremos por revolución, definiendo los objetos con un Shape
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(4, 0);
    shape.lineTo(4, 1);
    shape.lineTo(3.5, 1);
    shape.lineTo(3.5, 2);
    shape.lineTo(2.8, 2.5);
    shape.lineTo(2.8, 3.5);
    shape.lineTo(2.5, 3.8);
    shape.quadraticCurveTo(1, 7, 1, 9);
    shape.lineTo(2, 9);
    shape.lineTo(2, 9.5);
    shape.lineTo(1.5, 9.5);
    shape.lineTo(1.5, 10);
    shape.lineTo(1, 10);
    shape.lineTo(1, 10.5);
    shape.lineTo(0, 10.5);
    shape.lineTo(0, 0);
    shape.moveTo(0, 9.5);
    shape.quadraticCurveTo(3, 11.5, 0, 14);

    // Una vez definido el shape, se crea la geometría
    var points = shape.getPoints(); 
    var cuerpoGeom = new THREE.LatheGeometry(points, AlfilModelo.RES*4, 0, Math.PI * 2);

    return cuerpoGeom;
  }

  crearGeometriaEsferaCabeza(){
    // Se crean las geometrías necesarias
    var esferaGeom = new THREE.SphereGeometry(0.5, AlfilModelo.RES, AlfilModelo.RES);

    // Se posicionan 
    esferaGeom.translate(0, 14, 0);

    return esferaGeom;
  }

  crearGeometriaHuecoCabeza(){
    // Se define el hueco de la cabeza
    var cajaGeom = new THREE.BoxGeometry(3, 3, 0.3);

    // Se orienta y se posiciona
    cajaGeom.rotateX(-Math.PI / 6);
    cajaGeom.translate(0, 13.2, -1);

    return cajaGeom;
  }






  /*############################################################################*/
  // Método update del objeto

  actualizar()
  {
  }
}
