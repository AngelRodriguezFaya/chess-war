/*############################################################################*/
// Importaciones

import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'


/*############################################################################*/
// Clase Peon

export class Peon extends THREE.Object3D
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
    const RES = 200;
    const ROTACION_PIERNAS = Math.PI/50;
    var material = new THREE.MeshNormalMaterial({ flatShading : true });

    // Creamos las pies ----------------------------------------------

    // Creamos la forma 2D del pie
    const formaPie = new THREE.Shape();
    formaPie.moveTo(0, 0);
    formaPie.lineTo(3, 0);
    formaPie.lineTo(3, 0.4);
    formaPie.lineTo(1, 1);
    formaPie.lineTo(0, 1);
    formaPie.lineTo(0, 0);

    // Definimos la geometría del pie por extrusión
    var opciones = { depth : 0.7, steps : 2, bevelEnabled : true } ;
    var geomPieIzq = new THREE. ExtrudeGeometry ( formaPie , opciones );
    var geomPieDer = new THREE. ExtrudeGeometry ( formaPie , opciones );

    // Posicionamos y orientamos las geometrías
    geomPieIzq.rotateY(-Math.PI/2);
    geomPieIzq.translate(-1, 0, -0.2);

    geomPieDer.rotateY(-Math.PI/2);
    geomPieDer.translate(1.7, 0, -0.2);

    // Creamos los pies
    var pieIzq = new THREE.Mesh(geomPieIzq, material);
    var pieDer = new THREE.Mesh(geomPieDer, material);

    this.add(pieIzq);
    this.add(pieDer);




    // Espinillas ------------------------------------------------------------

    // Definimos las geometrías de las piernas
    var geomPiernaIzq = new THREE.CylinderGeometry(0.5, 0.4, 2.3, RES);
    var geomPiernaDer = new THREE.CylinderGeometry(0.5, 0.4, 2.3, RES);

    // Las posicionamos y orientamos
    geomPiernaIzq.rotateZ(-ROTACION_PIERNAS);
    geomPiernaIzq.translate(-1.3, 2.25, 0);

    geomPiernaDer.rotateZ(ROTACION_PIERNAS);
    geomPiernaDer.translate(1.3, 2.25, 0);

    // Creamos las piernas
    var piernaIzq = new THREE.Mesh(geomPiernaIzq, material);
    var piernaDer = new THREE.Mesh(geomPiernaDer, material);

    // Añadimos las piernas al peón
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
    this.add(cuello);
    
    // Cabeza ------------------------------------------------------------

    // Definimos la geometría de la cabeza
    var formaCabeza = new THREE.Shape();
    formaCabeza.moveTo(0, 0);
    formaCabeza.lineTo(0.6, 0);
    formaCabeza.quadraticCurveTo(0.9, 0.5, 0.9, 1);
    formaCabeza.quadraticCurveTo(0.7, 1.8, 0, 2);


    var puntosCabeza = formaCabeza.getPoints();
    var geomCabeza = new THREE. LatheGeometry ( puntosCabeza , RES, 0, Math.PI * 2) ;

    // La posicionamos
    geomCabeza.translate(0, 12.4, 0);
    // Creamos la cabeza
    this.cabeza = new CSG.Brush(geomCabeza, material);
    // Añadimos la cabeza

    var ojos = new THREE.BoxGeometry(2, 0.1, 2);
    ojos.rotateX(Math.PI / 20);
    ojos.translate(0, 13.3, 1.2);


    this.ojos = new CSG.Brush(ojos, material);

    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();
    
    // Realizamos las operaciones booleanas
    this.result1 = evaluator.evaluate(this.cabeza, this.ojos, CSG.SUBTRACTION);
    this.add(this.result1);

    


    // var geomCilCabeza = new THREE.CylinderGeometry(0.8, 0.6, 1, RES);
    // // La posicionamos
    // geomCilCabeza.translate(0, 12.8, 0);
    // // Creamos la cabeza
    // var cilCabeza = new THREE.Mesh(geomCilCabeza, material);
    // // Añadimos la cabeza
    // this.add(cilCabeza);

    //  var geomCabeza = new THREE.SphereGeometry(0.8, RES, RES);
    // // La posicionamos
    // geomCabeza.translate(0, 13.3, 0);
    // // Creamos la cabeza
    // var cabeza = new THREE.Mesh(geomCabeza, material);
    // // Añadimos la cabeza
    // this.add(cabeza);



  }

  /*############################################################################*/
  // Método update del objeto

  update()
  {
  }
}
