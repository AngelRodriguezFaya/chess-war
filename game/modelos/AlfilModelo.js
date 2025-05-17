/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'

import { TipoPieza } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'





/*############################################################################*/
// Clase Alfil

export class AlfilModelo extends PiezaBaseModelo
{
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
    // CONSTANTE DE RESOLUCIÓN
    const RES = 4;

    // // Creamos el material
    // var material = new THREE.MeshNormalMaterial({ flatShading : true });
    var materialAlfil = material; // El material se pasa como parámetro al constructor


    // La construcción del alfil 

    //------------ Definimos el cuerpo del alfil  -----------------
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
    var cuerpoGeom = new THREE.LatheGeometry(points, RES*20, 0, Math.PI * 2);

    // Se construye el objeto Brush que modela el cuerpo del alfil
    this.cuerpo = new CSG.Brush(cuerpoGeom, materialAlfil);    
    
    //------------ Damos los últimos detalles a la cabeza del alfil  -----------------
    // Se crean las geometrías necesarias
    var esferaGeom = new THREE.SphereGeometry(0.5, RES*5, RES*5);
    var cajaGeom = new THREE.BoxGeometry(3, 3, 0.3);

    // Se posicionan y se orientan
    esferaGeom.translate(0, 14, 0);

    cajaGeom.rotateX(-Math.PI / 6);
    cajaGeom.translate(0, 13.2, -1);
    

    // Se construyen los objetos Brush
    this.esfera = new CSG.Brush(esferaGeom, materialAlfil);
    this.caja = new CSG.Brush(cajaGeom, materialAlfil);

    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    // Realizamos las operaciones booleanas
    this.result1 = evaluator.evaluate(this.cuerpo, this.esfera, CSG.ADDITION);
    this.final = evaluator.evaluate(this.result1, this.caja, CSG.SUBTRACTION);

    // Guardamos la userData
    this.final.userData = this;

    this.add(this.final);
  }

  /*############################################################################*/
  // Animación

  inicializarAnimacion()
  {
  }

  /*############################################################################*/
  // Método update del objeto

  actualizar()
  {
    super.actualizar(false);
  }
}
