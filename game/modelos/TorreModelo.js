/**
 * @file TorreModelo.js
 * @description Modela una torre de ajedrez.
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
// Clase Torre

/**
 * @class TorreModelo
 * @description Modelo 3D de una torre de ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */
export class TorreModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Variables de clase
  // Geometrías ------------------------------------------
  static RES = 40; // Resolución de las geometrías
  static geometriaCuerpo = null;
  static geometriaToro1 = null;
  static geometriaToro2 = null;
  static geometriaToro3 = null;
  static geometriaToro4 = null;
  static geometriaToro5 = null;
  static geometriaCaja1 = null;
  static geometriaCaja2 = null;
  static geometriaCaja3 = null;



  /*############################################################################*/
  // Constructor

  constructor(material, posicion_en_tablero, tipo_jugador)
  {
    // Llamamos al constructor padre
    super(posicion_en_tablero, TipoPieza.TORRE, tipo_jugador);

    // Creación del modelo
    this.crearModelo(material);
  }



  /*############################################################################*/
  // Creación del modelo
  
  crearModelo(material)
  {
    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();
    
    //------------ Creamos la torre -----------------
    if(TorreModelo.geometriaCuerpo == null)
      TorreModelo.geometriaCuerpo = this.crearGeometriaCuerpo();   
    
    // Se construye el objeto Brush que modela la torre
    var torre = new CSG.Brush (TorreModelo.geometriaCuerpo, material);


    //---------- Ahora creamos los toros que se van a añadir a la torre ----------------

    if(TorreModelo.geometriaToro1 == null)
      TorreModelo.geometriaToro1 = this.crearGeometriaToro1();
  
    var toro1 = new CSG.Brush (TorreModelo.geometriaToro1, material);


    if(TorreModelo.geometriaToro2 == null)
      TorreModelo.geometriaToro2 = this.crearGeometriaToro2();

    var toro2 = new CSG.Brush (TorreModelo.geometriaToro2, material);
    

    if(TorreModelo.geometriaToro3 == null)
      TorreModelo.geometriaToro3 = this.crearGeometriaToro3();

    var toro3 = new CSG.Brush (TorreModelo.geometriaToro3, material);


    if(TorreModelo.geometriaToro4 == null)
      TorreModelo.geometriaToro4 = this.crearGeometriaToro4();

    var toro4 = new CSG.Brush (TorreModelo.geometriaToro4, material);
    

    if(TorreModelo.geometriaToro5 == null)
      TorreModelo.geometriaToro5 = this.crearGeometriaToro5();

    var toro5 = new CSG.Brush (TorreModelo.geometriaToro5, material);   
    

    // Usamos el evaluador para unir los toros a la torre
    var result1 = evaluator.evaluate(torre, toro1, CSG.ADDITION);
    var result2 = evaluator.evaluate(result1, toro2, CSG.ADDITION);
    var result3 = evaluator.evaluate(result2, toro3, CSG.ADDITION);
    var result4 = evaluator.evaluate(result3, toro4, CSG.ADDITION);
    var result5 = evaluator.evaluate(result4, toro5, CSG.SUBTRACTION);


    //------------ Se crean los agujeros de la cima de la torre con cajas -----------------

    if(TorreModelo.geometriaCaja1 == null)
      TorreModelo.geometriaCaja1 = this.crearGeometriaCaja1();

    var caja1 = new CSG.Brush (TorreModelo.geometriaCaja1, material); 
  
  
    if(TorreModelo.geometriaCaja2 == null)  
      TorreModelo.geometriaCaja2 = this.crearGeometriaCaja2();
      
    var caja2 = new CSG.Brush (TorreModelo.geometriaCaja2, material);
    
    
    if(TorreModelo.geometriaCaja3 == null)
      TorreModelo.geometriaCaja3 = this.crearGeometriaCaja3();
    
    var caja3 = new CSG.Brush (TorreModelo.geometriaCaja3, material);


    // Usamos el evaluador para restar las cajas a la torre
    var result6 = evaluator.evaluate(result5, caja1, CSG.SUBTRACTION);
    var result7 = evaluator.evaluate(result6, caja2, CSG.SUBTRACTION);
    var torreFinal = evaluator.evaluate(result7, caja3, CSG.SUBTRACTION); 

    // Añadimos la torre (resultado final)
    torreFinal.userData = this;
    this.add(torreFinal);
  }



  /*############################################################################*/
  // Método para crear las geometrías de las partes del modelo

  crearGeometriaCuerpo(){
    // Definimos los puntos que definen la geometría de la torre
    // Ya que la haremos por revolución.
    this.points = [
      new THREE.Vector2(0, 0),  // Punto de inicio
      new THREE.Vector2(4, 0),
      new THREE.Vector2(4, 1),
      new THREE.Vector2(3.5, 1),
      new THREE.Vector2(3, 2.9),
      new THREE.Vector2(2.7, 3.1),
      new THREE.Vector2(2, 8.5),
      new THREE.Vector2(2.5, 9),
      new THREE.Vector2(2.5, 11),
      new THREE.Vector2(2, 11),
      new THREE.Vector2(2, 10),
      new THREE.Vector2(0, 10),
      new THREE.Vector2(0, 0)  // De vuelta al origen
    ];

    var torreGeom = new THREE.LatheGeometry(this.points, TorreModelo.RES, 0, Math.PI * 2);

    return torreGeom;
  }



  crearGeometriaToro1(){
    // Definimos la geometría
    var toro1Geom = new THREE.TorusGeometry(3.3, 0.4, TorreModelo.RES, TorreModelo.RES);

    // Se orienta y se posiciona
    toro1Geom.rotateX(Math.PI / 2);
    toro1Geom.translate(0, 1.3, 0);

    return toro1Geom;
  }



  crearGeometriaToro2(){
    // Definimos la geometría
    var toro2Geom = new THREE.TorusGeometry(3, 0.2, TorreModelo.RES, TorreModelo.RES);

    // Se orienta y se posiciona
    toro2Geom.rotateX(Math.PI / 2);
    toro2Geom.translate(0, 2.8, 0);

    return toro2Geom;
  }



  crearGeometriaToro3(){
    // Definimos la geometría
    var toro3Geom = new THREE.TorusGeometry(2.7, 0.2, TorreModelo.RES, TorreModelo.RES);

    // Se orienta y se posiciona
    toro3Geom.rotateX(Math.PI / 2);
    toro3Geom.translate(0, 3.1, 0);

    return toro3Geom;
  }



  crearGeometriaToro4(){
    // Definimos la geometría
    var toro4Geom = new THREE.TorusGeometry(2.1, 0.25, TorreModelo.RES, TorreModelo.RES);

    // Se orienta y se posiciona
    toro4Geom.rotateX(Math.PI / 2);
    toro4Geom.translate(0, 8.4, 0);

    return toro4Geom;
  }



  crearGeometriaToro5(){
    // Definimos la geometría
    var toro5Geom = new THREE.TorusGeometry(2.4, 0.2, 3, TorreModelo.RES);

    // Se orienta y se posiciona
    toro5Geom.rotateX(Math.PI / 2);
    toro5Geom.translate(0, 9.4, 0);   

    return toro5Geom;
  }



  crearGeometriaCaja1(){
    // Definimos la geometría
    var caja1Geom = new THREE.BoxGeometry(8, 1, 1);

    // Se posiciona
    caja1Geom.translate(0, 11, 0); 

    return caja1Geom;
  }



  crearGeometriaCaja2(){
    // Definimos la geometría
    var caja2Geom = new THREE.BoxGeometry(8, 1, 1);

    // Se orienta y se posiciona
    caja2Geom.translate(0, 11, 0); 
    caja2Geom.rotateY(Math.PI / 3);

    return caja2Geom;
  }



  crearGeometriaCaja3(){
    // Definimos la geometría
    var caja3Geom = new THREE.BoxGeometry(8, 1, 1);

    // Se orienta y se posiciona
    caja3Geom.translate(0, 11, 0); 
    caja3Geom.rotateY(-Math.PI / 3);

    return caja3Geom;
  }



  /*############################################################################*/
  // Método update del objeto

  actualizar()
  {
  }
}
