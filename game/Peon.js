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
    const RES = 20;
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
    var geomPiernaIzq = new THREE.CylinderGeometry(0.6, 0.5, 2.3, RES);
    var geomPiernaDer = new THREE.CylinderGeometry(0.6, 0.5, 2.3, RES);

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
    var geomRodillaIzq = new THREE.SphereGeometry(0.65, RES, RES);
    var geomRodillaDer = new THREE.SphereGeometry(0.65, RES, RES);

    // Las posicionamos y orientamos
    geomRodillaIzq.translate(-1.24, 3.3, 0);
    geomRodillaDer.translate(1.24, 3.3, 0);

    // Creamos las rodillas
    var rodillaIzq = new THREE.Mesh(geomRodillaIzq, material);
    var rodillaDer = new THREE.Mesh(geomRodillaDer, material);

    // Añadimos las rodillas al peón
    this.add(rodillaIzq);
    this.add(rodillaDer);


    // Muslos ------------------------------------------------------------
    var geomMusloIzq = new THREE.CylinderGeometry(0.8, 0.65, 2.5, RES);
    var geomMusloDer = new THREE.CylinderGeometry(0.8, 0.65, 2.5, RES);

    // Las posicionamos y orientamos
    geomMusloIzq.rotateZ(-ROTACION_PIERNAS);
    geomMusloIzq.translate(-1.15, 4.65, 0);

    geomMusloDer.rotateZ(ROTACION_PIERNAS);
    geomMusloDer.translate(1.15, 4.65, 0);

    // Creamos los muslos
    var musloIzq = new THREE.Mesh(geomMusloIzq, material);
    var musloDer = new THREE.Mesh(geomMusloDer, material);

    // Añadimos los muslos al peón
    this.add(musloIzq);
    this.add(musloDer);

    // Cadera y tronco ------------------------------------------------------------

    const formaCadTron = new THREE.Shape();
    formaCadTron.moveTo(0, 0);
    formaCadTron.lineTo(1.6, 0);
    formaCadTron.lineTo(1.6, 2);
    formaCadTron.lineTo(1, 2.5);
    formaCadTron.lineTo(1.8, 5.5);
    formaCadTron.lineTo(1, 5.8);
    formaCadTron.quadraticCurveTo(0, 5, -1, 5.8)
    formaCadTron.lineTo(-1.8, 5.5);
    formaCadTron.lineTo(-1, 2.5);
    formaCadTron.lineTo(-1.2, 2);
    formaCadTron.lineTo(-1.2, 0);
    formaCadTron.lineTo(0, 0);

    var opciones = { depth : 1, steps : 2, bevelEnabled : true } ;
    var geomCadTron = new THREE. ExtrudeGeometry ( formaCadTron , opciones );

    // La posicionamos y orientamos
    geomCadTron.translate(0, 5.5, -0.5)
    
    // Creamos la cadera y el tronco
    var cadTron = new THREE.Mesh(geomCadTron, material);

    // Añadimos la cadera y el tronco al peón
    this.add(cadTron);
    

  }

  /*############################################################################*/
  // Método update del objeto

  update()
  {
  }
}
