/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'

import { TypePiece } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'





/*############################################################################*/
// Clase Peon

export class PeonModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Constructor

  constructor(gui, titleGui, material, board_position, type_player)
  {
    // Llamamos al constructor padre
    super(board_position, TypePiece.PAWN, type_player);

    // Inicialización de los parámetros
    this.iniParam();
    
    // Se crea la parte de la interfaz de usuario
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
    const RES = 20;
    const ROTACION_PIERNAS = Math.PI/50;
    // this.material = material; // El material se pasa como parámetro al constructor
    // var material = new THREE.MeshNormalMaterial({ flatShading : true });
    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    // Creamos las pies ----------------------------------------------

    // Creamos la forma 2D del pie
    const formaPie = new THREE.Shape();
    formaPie.moveTo(0, 0);
    formaPie.lineTo(2, 0);
    formaPie.lineTo(2, 0.4);
    formaPie.lineTo(0.8, 0.7);
    formaPie.lineTo(0, 0.7);
    formaPie.lineTo(0, 0);

    // Definimos la geometría del pie por extrusión
    var opciones = { depth : 0.6, steps : 2, bevelEnabled : true } ;
    var geomPieIzq = new THREE. ExtrudeGeometry ( formaPie , opciones );
    var geomPieDer = new THREE. ExtrudeGeometry ( formaPie , opciones );

    // Posicionamos y orientamos las geometrías
    geomPieIzq.rotateY(-Math.PI/2);
    geomPieIzq.translate(-1.1, 0, -0.4);

    geomPieDer.rotateY(-Math.PI/2);
    geomPieDer.translate(1.7, 0, -0.4);

    // Creamos los pies
    var pieIzq = new THREE.Mesh(geomPieIzq, material);
    var pieDer = new THREE.Mesh(geomPieDer, material);

    pieIzq.userData = this;
    pieDer.userData = this;
    this.add(pieIzq);
    this.add(pieDer);




    // Espinillas ------------------------------------------------------------

    // Definimos las geometrías de las piernas
    var geomPiernaIzq = new THREE.CylinderGeometry(0.5, 0.4, 2.6, RES);
    var geomPiernaDer = new THREE.CylinderGeometry(0.5, 0.4, 2.6, RES);

    // Las posicionamos y orientamos
    geomPiernaIzq.rotateZ(-ROTACION_PIERNAS);
    geomPiernaIzq.translate(-1.3, 2.10, 0);

    geomPiernaDer.rotateZ(ROTACION_PIERNAS);
    geomPiernaDer.translate(1.3, 2.10, 0);

    // Creamos las piernas
    var piernaIzq = new THREE.Mesh(geomPiernaIzq, material);
    var piernaDer = new THREE.Mesh(geomPiernaDer, material);

    // Añadimos las piernas al peón
    piernaIzq.userData = this;
    piernaDer.userData = this;
    this.add(piernaIzq);
    this.add(piernaDer);





    // Rodillas ------------------------------------------------------------
    var geomRodillaIzq = new THREE.SphereGeometry(0.52, RES, RES);
    var geomRodillaDer = new THREE.SphereGeometry(0.52, RES, RES);

    // Las posicionamos y orientamos
    geomRodillaIzq.translate(-1.22, 3.5, 0);
    geomRodillaDer.translate(1.22, 3.5, 0);

    // Creamos las rodillas
    var rodillaIzq = new THREE.Mesh(geomRodillaIzq, material);
    var rodillaDer = new THREE.Mesh(geomRodillaDer, material);

    // Añadimos las rodillas al peón
    rodillaIzq.userData = this;
    rodillaDer.userData = this;
    this.add(rodillaIzq);
    this.add(rodillaDer);


    // Muslos ------------------------------------------------------------
    var geomMusloIzq = new THREE.CylinderGeometry(0.8, 0.5, 2.7, RES);
    var geomMusloDer = new THREE.CylinderGeometry(0.8, 0.5, 2.7, RES);

    // Las posicionamos y orientamos
    geomMusloIzq.rotateZ(-ROTACION_PIERNAS);
    geomMusloIzq.translate(-1.15, 4.8, 0);

    geomMusloDer.rotateZ(ROTACION_PIERNAS);
    geomMusloDer.translate(1.15, 4.8, 0);

    // Creamos los muslos
    var musloIzq = new THREE.Mesh(geomMusloIzq, material);
    var musloDer = new THREE.Mesh(geomMusloDer, material);

    // Añadimos los muslos al peón
    musloIzq.userData = this;
    musloDer.userData = this;
    this.add(musloIzq);
    this.add(musloDer);

    // Cadera y tronco ------------------------------------------------------------

    const formaCadTron = new THREE.Shape();
    formaCadTron.moveTo(-0.4, 0);
    formaCadTron.quadraticCurveTo(0, 1, 0.4, 0);
    formaCadTron.lineTo(1.75, 0);
    formaCadTron.quadraticCurveTo(1.8, 1, 1.4, 2.5);
    formaCadTron.lineTo(1.8, 5.5);
    formaCadTron.lineTo(1, 5.8);
    formaCadTron.lineTo(-1, 5.8)
    formaCadTron.lineTo(-1.8, 5.5);
    formaCadTron.lineTo(-1.4, 2.5);
    formaCadTron.quadraticCurveTo(-1.8, 1, -1.75, 0);
    formaCadTron.lineTo(-0.4, 0);


    var opciones = { depth : 1.2, steps : 2, bevelEnabled : true } ;
    var geomCadTron = new THREE. ExtrudeGeometry ( formaCadTron , opciones );

    // La posicionamos y orientamos
    geomCadTron.translate(0, 6.1, -0.6)
    
    // Creamos la cadera y el tronco
    var cadTron = new THREE.Mesh(geomCadTron, material);

    // Añadimos la cadera y el tronco al peón
    cadTron.userData = this;
    this.add(cadTron);

    // Cuello ------------------------------------------------------------
    // Definimos la forma 2D del cuello
    var formaCuello = new THREE.Shape();
    formaCuello.moveTo(0, 0);
    formaCuello.quadraticCurveTo(0.2, -1.5, 1.1, 0.4);
    formaCuello.lineTo(0.6, 0.8);
    formaCuello.lineTo(0, 0); 

    // Definimos la geometría del cuello por revolución
    var puntosCuello = formaCuello.getPoints();
    var geomCuello = new THREE. LatheGeometry ( puntosCuello , RES, 0, Math.PI * 2) ;
    
    // La posicionamos 
    geomCuello.translate(0, 11.6, 0);

    // Creamos el cuello
    var cuello = new THREE.Mesh(geomCuello, material);

    // Añadimos el cuello
    cuello.userData = this;
    this.add(cuello);
    
    // Cabeza ------------------------------------------------------------

    // Definimos la forma 2D de la cabeza
    var formaCabeza = new THREE.Shape();
    formaCabeza.moveTo(0, 0);
    formaCabeza.lineTo(0.6, 0);
    formaCabeza.quadraticCurveTo(0.9, 0.5, 0.9, 1);
    formaCabeza.quadraticCurveTo(0.7, 1.8, 0, 2);

    // Definimos la geometría de la cabeza por revolución
    var puntosCabeza = formaCabeza.getPoints();
    var geomCabeza = new THREE. LatheGeometry ( puntosCabeza , RES, 0, Math.PI * 2) ;

    // Posicionamos la geometría de la cabeza
    geomCabeza.translate(0, 12.4, 0);

    // Creamos la cabeza
    this.cabeza = new CSG.Brush(geomCabeza, material);


    
    // Definimos la geometría de la apertura del casco para los ojos
    var ojos = new THREE.BoxGeometry(2, 0.1, 2);

    // La posicionamos y orientamos
    ojos.rotateX(Math.PI / 20);
    ojos.translate(0, 13.3, 1.4);

    // Creamos la apertura del casco para los ojos
    this.ojos = new CSG.Brush(ojos, material);

    
    
    // Realizamos las operaciones booleanas
    this.resultado = evaluator.evaluate(this.cabeza, this.ojos, CSG.SUBTRACTION);

    // Añadimos el resultado (Cabeza + aperura para los ojos) al peón
    this.resultado.userData = this;
    this.add(this.resultado);

    

    // Definimos la forma 2D del filo del casco
    var formafilo = new THREE.Shape();
    formafilo.moveTo(0, 0);
    formafilo.lineTo(0.15, 0);
    formafilo.lineTo(0, 0.25);
    formafilo.lineTo(-0.15, 0);
    formafilo.lineTo(0, 0);

    // Definimos el camino que seguirá el filo del casco
    var camino = new THREE.CatmullRomCurve3( [
      new THREE.Vector3(0, 14.1, 0.5),
      new THREE.Vector3(0, 14.3, 0),
      new THREE.Vector3(0.0, 14.1, -0.4),
      new THREE.Vector3(0.0, 13.8, -0.6),
      new THREE.Vector3(0.0, 13.3, -0.7),
      new THREE.Vector3(0.0, 12.8, -0.5),
    ] );

    // Indicamos las opciones necesarias para el barrido
    var opcionesGeom = {curveSegments: RES, steps: 80, extrudePath: camino};

    // Definimos la geometría del filo del casco por barrido
    var filoGeom = new THREE.ExtrudeGeometry(formafilo, opcionesGeom);

    var filoCasco = new THREE.Mesh(filoGeom, material);

    // Añadimos el filo del casco al peón
    filoCasco.userData = this;
    this.add(filoCasco);


    // Definimos la geometría para la defensa de la mandíbula
    var mandibGeom = new THREE.CylinderGeometry(0.9, 0.9, 1, RES, RES, false);
    var cajaAux = new THREE.BoxGeometry(3, 1.1, 3);

    // Las posicionamos y orientamos
    mandibGeom.rotateX(Math.PI / 20);
    mandibGeom.translate(0, 12.8, -2.5);

    cajaAux.rotateX(Math.PI / 4);
    cajaAux.translate(0, 12.35, -2.7);

    // Creamos la defensa de la mandíbula
    var mandibula = new CSG.Brush(mandibGeom, material);
    var cajaAux = new CSG.Brush(cajaAux, material);

    // Añadimos la defensa de la mandíbula al peón
    var defensa = evaluator.evaluate(mandibula, cajaAux, CSG.SUBTRACTION);
    defensa.userData = this;
    this.add(defensa);
    defensa.position.set(0, 0.15, 2.6);

    var cilindro1 = new THREE.CylinderGeometry(0.2, 0.2, 0.1, RES);
    var cilindro2 = new THREE.CylinderGeometry(0.2, 0.2, 0.1, RES); 

    // Las posicionamos y orientamos
    cilindro1.rotateZ(Math.PI / 2);
    cilindro1.translate(0.9, 13.3, 0);

    cilindro2.rotateZ(Math.PI / 2);
    cilindro2.translate(-0.9, 13.3, 0);

    // Creamos los cilindros
    var cilindro1 = new THREE.Mesh(cilindro1, material);
    var cilindro2 = new THREE.Mesh(cilindro2, material);

    // Añadimos los cilindros al peón
    cilindro1.userData = this;
    cilindro2.userData = this;
    this.add(cilindro1);
    this.add(cilindro2);


    // Brazos ------------------------------------------------------------
    // Brazo derecho -----------------------------------------------------

    // Definimos la geometría de la protección del hombro
    var prtHombroDchoGeom = new THREE.CylinderGeometry(0.9, 1, 1.2, RES);

    // La posicionamos y orientamos
    prtHombroDchoGeom.rotateZ(Math.PI/4);
    prtHombroDchoGeom.translate(1.5, 11.21, 0);

    // Creamos la protección del hombro
    var prtHombroDcho = new THREE.Mesh(prtHombroDchoGeom, material);

    // Añadimos la protección del hombro al peón
    prtHombroDcho.userData = this;
    this.add(prtHombroDcho);

    // Definimos la geometría de la parte superior del brazo
    var brazoSupGeom = new THREE.CylinderGeometry(0.5, 0.4, 2.7, RES);

    // La posicionamos y orientamos
    brazoSupGeom.rotateZ(Math.PI/5); 
    brazoSupGeom.translate(2.7, 10.1, 0);

    // Creamos la parte superior del brazo
    var brazoSupDcho = new THREE.Mesh(brazoSupGeom, material);

    // Añadimos la parte superior del brazo al peón
    brazoSupDcho.userData = this;
    this.add(brazoSupDcho);

    // Definimos la geometría del codo
    var codoDchoGeom = new THREE.SphereGeometry(0.42, RES, RES);

    // La posicionamos y orientamos
    codoDchoGeom.translate(3.55, 8.94, 0);

    // Creamos el codo
    var codoDcho = new THREE.Mesh(codoDchoGeom, material);

    // Añadimos el codo al peón
    codoDcho.userData = this;
    this.add(codoDcho);

    // Definimos la geometría de la parte inferior del brazo
    var brazoInfDchoGeom = new THREE.CylinderGeometry(0.4, 0.2, 2.5, RES);
    // La posicionamos y orientamos
    brazoInfDchoGeom.rotateX(-Math.PI/2);
    brazoInfDchoGeom.translate(3.55, 8.9, 1.4);
    // Creamos la parte inferior del brazo
    var brazoInf = new THREE.Mesh(brazoInfDchoGeom, material);
    // Añadimos la parte inferior del brazo al peón
    brazoInf.userData = this;
    this.add(brazoInf);

    // Definimos la geometría de la mano derecha
    // Será una caja a la que simulará la forma de la mano, que estará cerrada
    // sujetando una espada. La forma de los dedos y el interior de la mano se
    // realizará con operaciones booleanas
    var manoDchaGeom = new THREE.BoxGeometry(0.5, 0.5, 0.4);
    
    // La posicionamos y orientamos
    manoDchaGeom.translate(3.55, 8.9, 2.85);

    // Creamos la mano derecha
    var manoDcha = new CSG.Brush(manoDchaGeom, material);

    // Definimos la geometría de 4 dedos
    var dedos1DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos2DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos3DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos4DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos5DchaGeom = new THREE.BoxGeometry(0.4, 0.1, 0.03);

    // La posicionamos y orientamos
    dedos1DchaGeom.translate(3.3, 9.05, 2.95);
    dedos2DchaGeom.translate(3.3, 8.95, 2.95);
    dedos3DchaGeom.translate(3.3, 8.85, 2.95);
    dedos4DchaGeom.translate(3.3, 8.75, 2.95);    
    dedos5DchaGeom.translate(3.3, 9.1, 2.90);

    // Creamos los dedos
    var dedos1Dcha = new CSG.Brush(dedos1DchaGeom, material);
    var dedos2Dcha = new CSG.Brush(dedos2DchaGeom, material);
    var dedos3Dcha = new CSG.Brush(dedos3DchaGeom, material);
    var dedos4Dcha = new CSG.Brush(dedos4DchaGeom, material);
    var dedos5Dcha = new CSG.Brush(dedos5DchaGeom, material);


    // Realizamos las operaciones booleanas
    var result1ManoDcha = evaluator.evaluate(manoDcha, dedos1Dcha, CSG.SUBTRACTION);
    var result2ManoDcha = evaluator.evaluate(result1ManoDcha, dedos2Dcha, CSG.SUBTRACTION);
    var result3ManoDcha = evaluator.evaluate(result2ManoDcha, dedos3Dcha, CSG.SUBTRACTION);
    var result4ManoDcha = evaluator.evaluate(result3ManoDcha, dedos4Dcha, CSG.SUBTRACTION);
    var result5ManoDcha = evaluator.evaluate(result4ManoDcha, dedos5Dcha, CSG.SUBTRACTION);

    // Definimos la geometría del hueco de la mano
    var hueco1ManoDchaGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, RES);
    var hueco2ManoDchaGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, RES);


    // La posicionamos y orientamos
    hueco1ManoDchaGeom.translate(3.39, 8.7, 2.77);
    hueco2ManoDchaGeom.translate(3.52, 8.9, 2.85);

    // Creamos el hueco de la mano
    var huecoManoDcha = new CSG.Brush(hueco1ManoDchaGeom, material);
    var hueco2ManoDcha = new CSG.Brush(hueco2ManoDchaGeom, material);

    // Realizamos la operación booleana
    var result6ManoDcha = evaluator.evaluate(result5ManoDcha, huecoManoDcha, CSG.SUBTRACTION);
    var resultFinalManoDcha = evaluator.evaluate(result6ManoDcha, hueco2ManoDcha, CSG.SUBTRACTION);

    // Añado la mano Final al peón
    resultFinalManoDcha.userData = this;
    this.add(resultFinalManoDcha);   

    // Definimos la geometría para el protector de la muneca
    var prtMunecaDchaGeom = new THREE.CylinderGeometry(0.45, 0.25, 0.8, RES);
    // La posicionamos y orientamos
    prtMunecaDchaGeom.rotateX(-Math.PI/2);
    prtMunecaDchaGeom.translate(3.55, 8.9, 2.25);
    // Creamos el protector de la muñeca
    var prtMunecaDcha = new THREE.Mesh(prtMunecaDchaGeom, material);
    // Añadimos el protector de la muñeca al peón
    prtMunecaDcha.userData = this;
    this.add(prtMunecaDcha);
    

    // Brazo izquierdo -----------------------------------------------------
    // Definimos la geometría de la protección del hombro
    var prtHombroIzqGeom = new THREE.CylinderGeometry(0.9, 1, 1.2, RES);
    // La posicionamos y orientamos
    prtHombroIzqGeom.rotateZ(-Math.PI/4);
    prtHombroIzqGeom.translate(-1.5, 11.21, 0);
    // Creamos la protección del hombro
    var prtHombroIzq = new THREE.Mesh(prtHombroIzqGeom, material);
    // Añadimos la protección del hombro al peón
    prtHombroIzq.userData = this;
    this.add(prtHombroIzq);

    // Definimos la geometría de la parte superior del brazo
    var brazoSupIzqGeom = new THREE.CylinderGeometry(0.5, 0.4, 2.7, RES);
    // La posicionamos y orientamos
    brazoSupIzqGeom.rotateZ(-Math.PI/5);
    brazoSupIzqGeom.translate(-2.7, 10.1, 0);

    // Creamos la parte superior del brazo
    var brazoSupIzq = new THREE.Mesh(brazoSupIzqGeom, material);
    // Añadimos la parte superior del brazo al peón
    brazoSupIzq.userData = this;
    this.add(brazoSupIzq);
    // Definimos la geometría del codo
    var codoIzqGeom = new THREE.SphereGeometry(0.42, RES, RES);
    // La posicionamos y orientamos
    codoIzqGeom.translate(-3.55, 8.94, 0);

    // Creamos el codo
    var codoIzq = new THREE.Mesh(codoIzqGeom, material);
    // Añadimos el codo al peón
    codoIzq.userData = this;
    this.add(codoIzq);
    // Definimos la geometría de la parte inferior del brazo
    var brazoInfIzqGeom = new THREE.CylinderGeometry(0.4, 0.2, 2.5, RES);
    // La posicionamos y orientamos
    brazoInfIzqGeom.rotateX(-Math.PI/2);
    brazoInfIzqGeom.translate(-3.55, 8.9, 1.4);
    // Creamos la parte inferior del brazo
    var brazoInfIzq = new THREE.Mesh(brazoInfIzqGeom, material);
    // Añadimos la parte inferior del brazo al peón
    brazoInfIzq.userData = this;
    this.add(brazoInfIzq);

    
    // Definimos la geometría de la mano izquierda
    var manoIzqGeom = new THREE.BoxGeometry(0.5, 0.5, 0.4);
    // La posicionamos y orientamos
    manoIzqGeom.translate(-3.55, 8.9, 2.85);
    // Creamos la mano izquierda
    var manoIzq = new CSG.Brush(manoIzqGeom, material);
    // Definimos la geometría de 4 dedos
    var dedos1IzqGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos2IzqGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos3IzqGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos4IzqGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos5IzqGeom = new THREE.BoxGeometry(0.4, 0.1, 0.03);
    // La posicionamos y orientamos
    dedos1IzqGeom.translate(-3.3, 9.05, 2.95);
    dedos2IzqGeom.translate(-3.3, 8.95, 2.95);
    dedos3IzqGeom.translate(-3.3, 8.85, 2.95);
    dedos4IzqGeom.translate(-3.3, 8.75, 2.95);
    dedos5IzqGeom.translate(-3.3, 9.1, 2.90);
    // Creamos los dedos
    var dedos1Izq = new CSG.Brush(dedos1IzqGeom, material);
    var dedos2Izq = new CSG.Brush(dedos2IzqGeom, material);
    var dedos3Izq = new CSG.Brush(dedos3IzqGeom, material);
    var dedos4Izq = new CSG.Brush(dedos4IzqGeom, material);
    var dedos5Izq = new CSG.Brush(dedos5IzqGeom, material);
    // Realizamos las operaciones booleanas
    var result1ManoIzq = evaluator.evaluate(manoIzq, dedos1Izq, CSG.SUBTRACTION);
    var result2ManoIzq = evaluator.evaluate(result1ManoIzq, dedos2Izq, CSG.SUBTRACTION);
    var result3ManoIzq = evaluator.evaluate(result2ManoIzq, dedos3Izq, CSG.SUBTRACTION);
    var result4ManoIzq = evaluator.evaluate(result3ManoIzq, dedos4Izq, CSG.SUBTRACTION);
    var result5ManoIzq = evaluator.evaluate(result4ManoIzq, dedos5Izq, CSG.SUBTRACTION);
    // Definimos la geometría del hueco de la mano
    var hueco1ManoIzqGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, RES);
    var hueco2ManoIzqGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, RES);
    // La posicionamos y orientamos
    hueco1ManoIzqGeom.translate(-3.39, 8.7, 2.77);
    hueco2ManoIzqGeom.translate(-3.52, 8.9, 2.85);
    // Creamos el hueco de la mano
    var huecoManoIzq = new CSG.Brush(hueco1ManoIzqGeom, material);
    var hueco2ManoIzq = new CSG.Brush(hueco2ManoIzqGeom, material);
    // Realizamos la operación booleana
    var result6ManoIzq = evaluator.evaluate(result5ManoIzq, huecoManoIzq, CSG.SUBTRACTION);
    var resultFinalManoIzq = evaluator.evaluate(result6ManoIzq, hueco2ManoIzq, CSG.SUBTRACTION);
    // Añado la mano Final al peón
    resultFinalManoIzq.userData = this;
    this.add(resultFinalManoIzq);

    // Definimos la geometría para el protector de la muneca
    var prtMunecaIzqGeom = new THREE.CylinderGeometry(0.45, 0.25, 0.8, RES);
    // La posicionamos y orientamos
    prtMunecaIzqGeom.rotateX(-Math.PI/2);
    prtMunecaIzqGeom.translate(-3.55, 8.9, 2.25);
    // Creamos el protector de la muñeca
    var prtMunecaIzq = new THREE.Mesh(prtMunecaIzqGeom, material);
    // Añadimos el protector de la muñeca al peón
    prtMunecaIzq.userData = this;
    this.add(prtMunecaIzq);


    // Escudo ------------------------------------------------------------

    // Definimos la geometría del asa del escudo
    var asaEscudoGeom = new THREE.TorusGeometry(0.5, 0.1, RES);
    // La posicionamos y orientamos
    asaEscudoGeom.rotateY(Math.PI / 2);
    asaEscudoGeom.translate(-3.52, 8.9, 3.35);
    // Creamos el asa del escudo
    var asaEscudo = new CSG.Brush(asaEscudoGeom, material);

    // Realizamos una operación booleana para quedarnos con medio asa
    var cajaAux = new THREE.BoxGeometry(2, 2, 1);
    cajaAux.translate(-3.52, 8.9, 3.8);
    var cajaAux = new CSG.Brush(cajaAux, material);
    var asaFinalEscudo = evaluator.evaluate(asaEscudo, cajaAux, CSG.SUBTRACTION);

    // Añadimos el resultado al peón
    asaFinalEscudo.userData = this;
    this.add(asaFinalEscudo);


    // Definimos la forma 2D del escudo
    var formaEscudo = new THREE.Shape();
    // Dibujamos la parte superior del escudo (un arco)
    formaEscudo.absarc(0, 0, 2, 0, 2 * Math.PI, true);
    // Cerramos la forma
    formaEscudo.lineTo(0, 0);
    
    // Configuramos las opciones de extrusión
    var opcEscudoGeom = {
        depth: 0.3, // Grosor del escudo
        bevelEnabled: false, // Activar biselado
        bevelThickness: 0.1, // Grosor del bisel
        bevelSize: 0.1, // Tamaño del bisel
        bevelSegments: 5 // Segmentos del bisel
    };
    
    // Creamos la geometría del escudo por extrusión
    var geomEscudo = new THREE.ExtrudeGeometry(formaEscudo, opcEscudoGeom);

    // Posicionamos la geometría del escudo
    geomEscudo.translate(-3.55, 9, 3.3);  
      
    // Creamos el escudo
    var escudo = new THREE.Mesh(geomEscudo, material);

    // Añadimos el escudo al peón
    escudo.userData = this;
    this.add(escudo);


    // Espada ------------------------------------------------------------
    // Defino la forma 2D de la hoja de la espada
    var formHojaEspada = new THREE.Shape();
    formHojaEspada.moveTo(0, 0);
    formHojaEspada.lineTo(0.15, 0);
    formHojaEspada.lineTo(0.15, 6.5);
    formHojaEspada.lineTo(0, 7);
    formHojaEspada.lineTo(-0.15, 6.5);
    formHojaEspada.lineTo(-0.15, 0);
    formHojaEspada.lineTo(0, 0);



    // Definimos las geometrías 
    var mastil1EspadaGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.4, RES);
    var mastil2EspadaGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.7, RES);
    var opchojaEspadaGeom = { depth : 0.01, steps : RES, bevelEnabled : false } ;
    var hojaEspadaGeom = new THREE.ExtrudeGeometry ( formHojaEspada , opchojaEspadaGeom );

    // Las posicionamos y orientamos
    mastil1EspadaGeom.translate(3.55, 9, 2.85);
    mastil2EspadaGeom.rotateZ(Math.PI / 2);
    mastil2EspadaGeom.translate(3.55, 9.5, 2.85);
    hojaEspadaGeom.translate(3.55, 9.5, 2.85);

    // Creamos la espada
    var mastil1Espada = new THREE.Mesh(mastil1EspadaGeom, material);
    var mastil2Espada = new THREE.Mesh(mastil2EspadaGeom, material);
    var hojaEspada = new THREE.Mesh(hojaEspadaGeom, material);

    // Añadimos la espada al peón
    mastil1Espada.userData = this;
    mastil2Espada.userData = this;
    hojaEspada.userData = this;
    this.add(mastil1Espada);
    this.add(mastil2Espada);
    this.add(hojaEspada);

  }

  /*############################################################################*/
  // Método update del objeto

  update()
  {
  }
}
