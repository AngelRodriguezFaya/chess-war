/**
 * @file ReyModelo.js
 * @description Modela un rey de ajedrez.
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
// Clase Rey

/**
 * @class ReyModelo
 * @description Modelo 3D de un rey de ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */
export class ReyModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Variables de clase
  // Geometrías ------------------------------------------
  static RES = 20; // Resolución de las geometrías
  static geometriaPie = null;
  static geometriaEspinilla = null;
  static geometriaRodilla = null;
  static geometriaMuslo = null;
  static geometriaCadTron = null;
  static geometriaCuello = null;
  static geometriaCabeza = null;
  static geometriaOjo = null;
  static geometriaNariz = null;
  static geometriaBoca = null;
  static geometriaCorona = null;
  static geometriaHuecoCorona = null;
  static geometriaProtecHombroIzq = null;
  static geometriaParteSupBrazoIzq = null;
  static geometriaCodoIzq = null;
  static geometriaBrazoInfIzq = null;
  static geometriaProtecMunecaIzq = null;
  static geometriaProtecHombroDcho = null;
  static geometriaParteSupBrazoDcho = null;
  static geometriaCodoDcho = null;
  static geometriaBrazoInfDcho = null;
  static geometriaProtecMunecaDcho = null;


  // Transformaciones ------------------------------------
  static rotacionPiernas = Math.PI/50;

  
  /*############################################################################*/
  // Constructor

  constructor(material, posicion_en_tablero, tipo_jugador)
  {
    // Llamamos al constructor padre
    super(posicion_en_tablero, TipoPieza.REY, tipo_jugador);

    // Creación del modelo
    this.createObject(material);
  }

  /*############################################################################*/
  // Creación del modelo
  
  createObject(material){
    // Se crea el tren inferior
    this.crearTrenInferior(material);

    // Se añade el tren superior
    this.crearTrenSuperior(material);
  }     

  /*############################################################################*/
  // Métodos para crear las geometrías de las partes del modelo

  crearGeometriaPie(){
    // Creamos la forma 2D del pie
    const formaPie = new THREE.Shape();
    formaPie.moveTo(0, 0);
    formaPie.lineTo(2, 0);
    formaPie.lineTo(2, 0.4);
    formaPie.lineTo(0.8, 0.8);
    formaPie.lineTo(0, 0.8);
    formaPie.lineTo(0, 0);

    // Definimos la geometría del pie por extrusión
    var opciones = { depth : 0.6, steps : 2, bevelEnabled : true } ;
    var geomPie = new THREE. ExtrudeGeometry ( formaPie , opciones );

    // Rotamos la geometría
    geomPie.rotateY(-Math.PI / 2);

    return geomPie;
  }

  crearGeometriaEspinilla(){
    // Definimos la geometría de la espinilla
    var geomEspinilla = new THREE.CylinderGeometry(0.5, 0.4, 3, ReyModelo.RES);

    return geomEspinilla;
  }

  crearGeometriaRodilla(){
    // Definimos la geometría de la rodilla
    var geomRodilla = new THREE.SphereGeometry(0.52, ReyModelo.RES, ReyModelo.RES);

    return geomRodilla;
  }

  crearGeometriaMuslo(){
    var geomMuslo = new THREE.CylinderGeometry(0.8, 0.5, 3, ReyModelo.RES);

    return geomMuslo;
  }

  crearGeometriaCaderaTronco(){
    // Definimos la forma 2D de la cadera y el tronco
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

    // Definimos la geometría de la cadera y el tronco por extrusión
    var opciones = { depth : 1.2, steps : 2, bevelEnabled : true } ;
    var geomCadTron = new THREE. ExtrudeGeometry ( formaCadTron , opciones );

    // Posicionamos la geometría
    geomCadTron.translate(0, 6.7, -0.6);

    return geomCadTron;
  }

  crearGeometriaCuello(){
    // Definimos la forma 2D del cuello
    var formaCuello = new THREE.Shape();
    formaCuello.moveTo(0, 0);
    formaCuello.quadraticCurveTo(0.2, -1.5, 1.1, 0.4);
    formaCuello.lineTo(0.6, 0.8);
    formaCuello.lineTo(0, 0); 

    // Definimos la geometría del cuello por revolución
    var puntosCuello = formaCuello.getPoints();
    var geomCuello = new THREE. LatheGeometry ( puntosCuello , ReyModelo.RES, 0, Math.PI * 2) ;
    
    // La posicionamos 
    geomCuello.translate(0, 12.2, 0);

    return geomCuello;

  }

  crearGeometriaCabeza(){
    // Definimos la forma 2D de la cabeza
    var formaCabeza = new THREE.Shape();
    formaCabeza.moveTo(0, 0);
    formaCabeza.lineTo(0.6, 0);
    formaCabeza.quadraticCurveTo(1.2, 1.7, 0, 2);

    // Definimos la geometría de la cabeza por revolución
    var puntosCabeza = formaCabeza.getPoints();
    var geomCabeza = new THREE. LatheGeometry ( puntosCabeza , ReyModelo.RES, 0, Math.PI * 2) ;

    // La posicionamos
    geomCabeza.translate(0, 13, 0);

    return geomCabeza;
  }

  crearGeometriaOjo(){
    // Definimos la geometría de los ojos
    var ojoGeom = new THREE.SphereGeometry(0.1, ReyModelo.RES, ReyModelo.RES);

    return ojoGeom;
  }

  crearGeometriaNariz(){
    // Definimos la geometría de la nariz
    var narizGeom = new THREE.BoxGeometry(0.1, 0.4, 0.4);

    // Posicionamos y orientamos la geometría
    narizGeom.rotateX(-Math.PI / 8);
    narizGeom.translate(0, 13.7, 0.7);

    return narizGeom;
  }

  crearGeometriaBoca(){
    // Definimos la geometría de la boca
    var bocaGeom = new THREE.BoxGeometry(0.6, 0.1, 0.4);
    
    // La posicionamos 
    bocaGeom.translate(0, 13.3, 0.6);

    return bocaGeom;
  }

  crearGeometriaCorona(){
    // Definimos la geometría de la corona
    var geomCorona = new THREE.CylinderGeometry(0.8, 0.8, 1, ReyModelo.RES);

    // Posicionamos su geometría
    geomCorona.translate(-2, 14.8, 0);

    return geomCorona;
  }

  crearGeometriaHuecoCorona(){
    // Definimos la geometría del hueco de la corona
    var geomHuecoCorona = new THREE.CylinderGeometry(0.7, 0.7, 1.2, ReyModelo.RES);

    // Posicionamos su geometría
    geomHuecoCorona.translate(-2, 14.8, 0);

    return geomHuecoCorona;
  }

  crearGeometriaProtecHombroIzq(){
    var geomPrtHombroIzq = new THREE.CylinderGeometry(0.9, 1, 1.2, ReyModelo.RES);

    // La orientamos y posicionamos
    geomPrtHombroIzq.rotateZ(-Math.PI/7);
    geomPrtHombroIzq.translate(-1.4, 12, 0);

    return geomPrtHombroIzq;
  }

  crearGeometriaParteSupBrazoIzq(){
    // Definimos la geometría de la parte superior del brazo
    var geomParteSupBrazoIzq = new THREE.CylinderGeometry(0.5, 0.4, 3, ReyModelo.RES);

    // La orientamos y posicionamos
    geomParteSupBrazoIzq.rotateZ(-Math.PI/10);
    geomParteSupBrazoIzq.rotateX(-Math.PI/10);
    geomParteSupBrazoIzq.translate(-2.3, 10.5, 0.3);

    return geomParteSupBrazoIzq;
  }

  crearGeometriaCodoIzq(){
    // Definimos la geometría del codo
    var geomCodoIzq = new THREE.SphereGeometry(0.42, ReyModelo.RES, ReyModelo.RES);

    // La posicionamos 
    geomCodoIzq.translate(-2.75, 9.15, 0.75);

    return geomCodoIzq;
  }

  crearGeometriaParteInfBrazoIzq(){
    // Definimos la geometría de la parte inferior del brazo
    var geomParteInfBrazoIzq = new THREE.CylinderGeometry(0.4, 0.2, 3, ReyModelo.RES);

    // La orientamos y posicionamos
    geomParteInfBrazoIzq.rotateZ(Math.PI/2);
    geomParteInfBrazoIzq.rotateY(-Math.PI/8);
    geomParteInfBrazoIzq.translate(-1.2, 9.2, 1.4);

    return geomParteInfBrazoIzq;
  }

  crearGeometriaProtecMunecaIzq(){
    // Definimos la geometría para el protector de la muneca
    var geomPrtMunecaIzq = new THREE.CylinderGeometry(0.45, 0.25, 0.8, ReyModelo.RES);
    
    // La orientamos y posicionamos
    geomPrtMunecaIzq.rotateZ(Math.PI/2);
    geomPrtMunecaIzq.rotateY(-Math.PI/10);
    geomPrtMunecaIzq.translate(-0.2, 9.2, 1.8);

    return geomPrtMunecaIzq;
  }

  crearGeometriaProtecHombroDcho(){
    // Definimos la geometría de la protección del hombro
    var geomPrtHombroDcho = new THREE.CylinderGeometry(0.9, 1, 1.2, ReyModelo.RES);

    // La orientamos y posicionamos
    geomPrtHombroDcho.rotateZ(Math.PI/7);
    geomPrtHombroDcho.translate(1.4, 12, 0);

    return geomPrtHombroDcho;
  }

  crearGeometriaParteSupBrazoDcho(){
    // Definimos la geometría de la parte superior del brazo
    var geomParteSupBrazoDcho = new THREE.CylinderGeometry(0.5, 0.4, 3, ReyModelo.RES);

    // La orientamos y posicionamos
    geomParteSupBrazoDcho.rotateZ(Math.PI/7); 
    geomParteSupBrazoDcho.rotateX(-Math.PI/10);
    geomParteSupBrazoDcho.translate(2.5, 10.5, 0.3);

    return geomParteSupBrazoDcho;
  }

  crearGeometriaCodoDcho(){
    // Definimos la geometría del codo
    var geomCodoDcho = new THREE.SphereGeometry(0.42, ReyModelo.RES, ReyModelo.RES);

    // La posicionamos 
    geomCodoDcho.translate(3.2, 9.15, 0.75);

    return geomCodoDcho;
  }

  crearGeometriaParteInfBrazoDcho(){
    // Definimos la geometría de la parte inferior del brazo
    var geomParteInfBrazoDcho = new THREE.CylinderGeometry(0.4, 0.2, 3, ReyModelo.RES);
    
    // La orientamos y posicionamos
    geomParteInfBrazoDcho.rotateZ(-Math.PI/2.5);
    geomParteInfBrazoDcho.rotateY(-Math.PI/7);
    geomParteInfBrazoDcho.rotateX(-Math.PI);
    geomParteInfBrazoDcho.translate(1.9, 9.6, 1.35);

    return geomParteInfBrazoDcho;
  }

  crearGeometriaProtecMunecaDcho(){
    // Definimos la geometría para el protector de la muneca
    var geomPrtMunecaDcho = new THREE.CylinderGeometry(0.45, 0.25, 0.8, ReyModelo.RES);
    
    // La orientamos y posicionamos
    geomPrtMunecaDcho.rotateX(-Math.PI/2.5);
    geomPrtMunecaDcho.rotateY(-Math.PI/2.5);
    geomPrtMunecaDcho.rotateZ(-Math.PI/5);
    geomPrtMunecaDcho.translate(0.9, 10, 1.8);

    return geomPrtMunecaDcho;
    
  }


  /*############################################################################*/
  // Métodos para crear las partes del modelo

  crearTrenInferior(material){

    // --------------------------------------------------------------------------------
    //------------------------------- Pies --------------------------------------------
    // --------------------------------------------------------------------------------
    
    if(ReyModelo.geometriaPie == null)
      ReyModelo.geometriaPie = this.crearGeometriaPie();

    // Creamos los pies
    var pieIzq = new THREE.Mesh(ReyModelo.geometriaPie, material);
    var pieDer = new THREE.Mesh(ReyModelo.geometriaPie, material);

    // Posicionamos los pies
    pieIzq.position.set(-1.1, 0, -0.4);
    pieDer.position.set(1.7, 0, -0.4);
    
    // Añadimos los pies al rey
    pieIzq.userData = this;
    pieDer.userData = this;
    
    this.add(pieIzq);
    this.add(pieDer);


    // --------------------------------------------------------------------------------
    //------------------------------- Espinillas --------------------------------------
    // --------------------------------------------------------------------------------

    if(ReyModelo.geometriaEspinilla == null)
      ReyModelo.geometriaEspinilla = this.crearGeometriaEspinilla();

    // Creamos las partes inferiores de las piernas
    var espinillaIzq = new THREE.Mesh(ReyModelo.geometriaEspinilla , material);
    var espinillaDer = new THREE.Mesh(ReyModelo.geometriaEspinilla , material);

    // Orientamos y posicionamos las espinillas
    espinillaIzq.rotateZ(-ReyModelo.rotacionPiernas);
    espinillaIzq.position.set(-1.3, 2.3, 0);
    
    espinillaDer.rotateZ(ReyModelo.rotacionPiernas);
    espinillaDer.position.set(1.3, 2.3, 0);
    
    // Las añadimos al rey
    espinillaIzq.userData = this;
    espinillaDer.userData = this;
    this.add(espinillaIzq);
    this.add(espinillaDer);
  

    // --------------------------------------------------------------------------------
    //------------------------------- Rodillas ----------------------------------------
    // --------------------------------------------------------------------------------
    
    // Definimos las geometrías de las rodillas
    if(ReyModelo.geometriaRodilla == null)
      ReyModelo.geometriaRodilla = this.crearGeometriaRodilla();

    // Creamos las rodillas
    var rodillaIzq = new THREE.Mesh(ReyModelo.geometriaRodilla, material);
    var rodillaDer = new THREE.Mesh(ReyModelo.geometriaRodilla, material);

    // Posicionamos las rodillas
    rodillaIzq.position.set(-1.22, 3.7, 0);
    rodillaDer.position.set(1.22, 3.7, 0);  

    // Añadimos las rodillas al rey
    rodillaIzq.userData = this;
    rodillaDer.userData = this;
    this.add(rodillaIzq);
    this.add(rodillaDer);

  
    // --------------------------------------------------------------------------------
    //------------------------------- Muslos ------------------------------------------
    // --------------------------------------------------------------------------------

    if(ReyModelo.geometriaMuslo == null)
      ReyModelo.geometriaMuslo = this.crearGeometriaMuslo();
    
    // Creamos los muslos
    var musloIzq = new THREE.Mesh(ReyModelo.geometriaMuslo, material);
    var musloDer = new THREE.Mesh(ReyModelo.geometriaMuslo, material);

    // Posicionamos y orientamos los muslos
    musloIzq.rotateZ(-ReyModelo.rotacionPiernas);
    musloIzq.position.set(-1.13, 5.15, 0);

    musloDer.rotateZ(ReyModelo.rotacionPiernas);
    musloDer.position.set(1.13, 5.15, 0); 

    // Añadimos los muslos al rey
    musloIzq.userData = this;
    musloDer.userData = this;
    this.add(musloIzq);
    this.add(musloDer);

  }

  crearCaderaTronco(material){

    // --------------------------------------------------------------------------------
    //------------------------------- Cadera y tronco ----------------------------------
    // --------------------------------------------------------------------------------

    if(ReyModelo.geometriaCadTron == null)
      ReyModelo.geometriaCadTron = this.crearGeometriaCaderaTronco();
    
    // Creamos la cadera y el tronco
    var cadTron = new THREE.Mesh(ReyModelo.geometriaCadTron, material);

    // Añadimos la cadera y el tronco al rey
    cadTron.userData = this;
    this.add(cadTron);

  }
    

  crearCuello(material){
    // --------------------------------------------------------------------------------
    //------------------------------- Cuello ------------------------------------------
    // --------------------------------------------------------------------------------

    if(ReyModelo.geometriaCuello == null)
      ReyModelo.geometriaCuello = this.crearGeometriaCuello();

    // Creamos el cuello
    var cuello = new THREE.Mesh(ReyModelo.geometriaCuello, material);

    // Añadimos el cuello al rey
    cuello.userData = this;
    this.add(cuello);
  }

  crearCabeza(material){
    // --------------------------------------------------------------------------------
    //------------------------------- Cabeza ------------------------------------------
    // --------------------------------------------------------------------------------

    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    if(ReyModelo.geometriaCabeza == null)
      ReyModelo.geometriaCabeza = this.crearGeometriaCabeza();

    // Creamos la cabeza
    var cabeza = new CSG.Brush(ReyModelo.geometriaCabeza, material);
    
    // La cabeza la añadimos mas tarde, después de hacer las operaciones booleanas con la boca

    //------------------------------- Ojos, nariz y boca -------------------------------

    // Definimos las geometrías de los ojos
    if(ReyModelo.geometriaOjo == null)
      ReyModelo.geometriaOjo = this.crearGeometriaOjo();

    // Creamos los ojos
    var ojoIzq = new THREE.Mesh(ReyModelo.geometriaOjo, material);
    var ojoDer = new THREE.Mesh(ReyModelo.geometriaOjo, material);

    // Posicionamos los ojos
    ojoIzq.position.set(0.3, 14, 0.7);
    ojoDer.position.set(-0.3, 14, 0.7);  

    // Añadimos los ojos al rey
    ojoIzq.userData = this;
    ojoDer.userData = this;
    this.add(ojoIzq);
    this.add(ojoDer);



    if(ReyModelo.geometriaNariz == null)
      ReyModelo.geometriaNariz = this.crearGeometriaNariz();

    // Creamos la nariz
    var nariz = new THREE.Mesh(ReyModelo.geometriaNariz, material);

    // Añadimos la nariz al rey
    nariz.userData = this;
    this.add(nariz);


    if(ReyModelo.geometriaBoca == null)
      ReyModelo.geometriaBoca = this.crearGeometriaBoca();

    // Creamos la boca
    var boca = new CSG.Brush(ReyModelo.geometriaBoca, material);

    // Hacemos una operación booleana para hacer el hueco de la boca
    var cabezaFinal = evaluator.evaluate(cabeza, boca, CSG.SUBTRACTION);

    // Añadimos la boca al rey
    cabezaFinal.userData = this;
    this.add(cabezaFinal);

    // Añadimos la corona al rey
    this.crearCorona(material);
  }

  crearCorona(material){
    // --------------------------------------------------------------------------------
    //------------------------------- Corona ------------------------------------------
    // --------------------------------------------------------------------------------

    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    if(ReyModelo.geometriaCorona == null)
      ReyModelo.geometriaCorona = this.crearGeometriaCorona();
    
    // Creamos la corona
    var corona = new CSG.Brush(ReyModelo.geometriaCorona, material);

    // La corona final la añadimos más tarde, después de hacer las operaciones booleanas para hacer sus detalles.

    // Definimos el hueco de la corona
    if(ReyModelo.geometriaHuecoCorona == null)
      ReyModelo.geometriaHuecoCorona = this.crearGeometriaHuecoCorona();
    
    // Creamos el hueco de la corona
    var huecoCorona = new CSG.Brush(ReyModelo.geometriaHuecoCorona, material);

    // Realizamos la operación booleana
    var corona1 = evaluator.evaluate(corona, huecoCorona, CSG.SUBTRACTION);
    
    
    // Definimos la geometría para hacer los detalles superiores de la corona
    var muescaCoronaGeom1 = new THREE.BoxGeometry(0.2, 0.2, 2);
    var muescaCoronaGeom2 = new THREE.BoxGeometry(0.2, 0.2, 2);
    var muescaCoronaGeom3 = new THREE.BoxGeometry(0.2, 0.2, 2);
    var muescaCoronaGeom4 = new THREE.BoxGeometry(0.2, 0.2, 2);

    // Posicionamos y orientamos las geometrías
    muescaCoronaGeom1.translate(-2, 15.2, 0);
    muescaCoronaGeom2.rotateY(Math.PI / 4);
    muescaCoronaGeom2.translate(-2, 15.2, 0);
    muescaCoronaGeom3.rotateY(-Math.PI / 4);
    muescaCoronaGeom3.translate(-2, 15.2, 0);
    muescaCoronaGeom4.rotateY(Math.PI / 2);
    muescaCoronaGeom4.translate(-2, 15.2, 0);

    // Creamos los detalles de la corona
    var muescaCorona1 = new CSG.Brush(muescaCoronaGeom1, material);
    var muescaCorona2 = new CSG.Brush(muescaCoronaGeom2, material);
    var muescaCorona3 = new CSG.Brush(muescaCoronaGeom3, material);
    var muescaCorona4 = new CSG.Brush(muescaCoronaGeom4, material);

    // Hacemos las operaciones booleanas para hacer los detalles de la corona
    var corona2 = evaluator.evaluate(corona1, muescaCorona1, CSG.SUBTRACTION);
    var corona3 = evaluator.evaluate(corona2, muescaCorona2, CSG.SUBTRACTION);
    var corona4 = evaluator.evaluate(corona3, muescaCorona3, CSG.SUBTRACTION);
    var coronaFinal = evaluator.evaluate(corona4, muescaCorona4, CSG.SUBTRACTION);

    // Añadimos la corona al rey
    coronaFinal.userData = this;
    this.add(coronaFinal);
    coronaFinal.position.set(2, 0, 0);
  }

  crearBrazoIzquierdo(material){
    // -------------------------------------------------------------------------------- 
    // ------------------------------- Brazo izquierdo --------------------------------
    // --------------------------------------------------------------------------------
    
    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();
    
    // ---------------------------- Protección del hombro -----------------------------

    // Definimos la geometría de la protección del hombro 
    if(ReyModelo.geometriaProtecHombroIzq == null)
      ReyModelo.geometriaProtecHombroIzq = this.crearGeometriaProtecHombroIzq();
    
    // Creamos la protección del hombro
    var prtHombroIzq = new THREE.Mesh(ReyModelo.geometriaProtecHombroIzq , material);

    // Añadimos la protección del hombro al rey
    prtHombroIzq.userData = this;
    this.add(prtHombroIzq);

    // --------------------- Parte superior del brazo --------------------------------

    if(ReyModelo.geometriaParteSupBrazoIzq == null)
      ReyModelo.geometriaParteSupBrazoIzq = this.crearGeometriaParteSupBrazoIzq();

    // Creamos la parte superior del brazo
    var brazoSupIzq = new THREE.Mesh(ReyModelo.geometriaParteSupBrazoIzq, material);

    // Añadimos la parte superior del brazo al rey
    brazoSupIzq.userData = this;
    this.add(brazoSupIzq);

    // ------------------------------- Codo ------------------------------------------

    if(ReyModelo.geometriaCodoIzq == null)
      ReyModelo.geometriaCodoIzq = this.crearGeometriaCodoIzq();
    
    // Creamos el codo
    var codoIzq = new THREE.Mesh(ReyModelo.geometriaCodoIzq, material);

    // Añadimos el codo al rey
    codoIzq.userData = this;
    this.add(codoIzq);

    // --------------------- Parte inferior del brazo --------------------------------

    if(ReyModelo.geometriaBrazoInfIzq == null)
      ReyModelo.geometriaBrazoInfIzq = this.crearGeometriaParteInfBrazoIzq();

    // Creamos la parte inferior del brazo
    var brazoIzqInf = new THREE.Mesh(ReyModelo.geometriaBrazoInfIzq, material);

    // Añadimos la parte inferior del brazo al rey
    brazoIzqInf.userData = this;
    this.add(brazoIzqInf);

    // ------------------------------- Mano Izquierda --------------------------------

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

    // La posicionamos y orientamos
    dedos1IzqGeom.translate(-3.3, 9.05, 2.95);
    dedos2IzqGeom.translate(-3.3, 8.95, 2.95);
    dedos3IzqGeom.translate(-3.3, 8.85, 2.95);
    dedos4IzqGeom.translate(-3.3, 8.75, 2.95);

    // Creamos los dedos
    var dedos1Izq = new CSG.Brush(dedos1IzqGeom, material);
    var dedos2Izq = new CSG.Brush(dedos2IzqGeom, material);
    var dedos3Izq = new CSG.Brush(dedos3IzqGeom, material);
    var dedos4Izq = new CSG.Brush(dedos4IzqGeom, material);

    // Realizamos las operaciones booleanas
    var result1ManoIzq = evaluator.evaluate(manoIzq, dedos1Izq, CSG.SUBTRACTION);
    var result2ManoIzq = evaluator.evaluate(result1ManoIzq, dedos2Izq, CSG.SUBTRACTION);
    var result3ManoIzq = evaluator.evaluate(result2ManoIzq, dedos3Izq, CSG.SUBTRACTION);
    var result4ManoIzq = evaluator.evaluate(result3ManoIzq, dedos4Izq, CSG.SUBTRACTION);

    // Definimos la geometría del hueco de la mano
    var hueco1ManoIzqGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, ReyModelo.RES);
    var hueco2ManoIzqGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, ReyModelo.RES);
    
    // La posicionamos y orientamos
    hueco1ManoIzqGeom.translate(-3.39, 8.7, 2.77);
    hueco2ManoIzqGeom.translate(-3.52, 8.9, 2.85);

    // Creamos el hueco de la mano
    var huecoManoIzq = new CSG.Brush(hueco1ManoIzqGeom, material);
    var hueco2ManoIzq = new CSG.Brush(hueco2ManoIzqGeom, material);

    // Realizamos la operación booleana
    var result5ManoIzq = evaluator.evaluate(result4ManoIzq, huecoManoIzq, CSG.SUBTRACTION);
    var resultFinalManoIzq = evaluator.evaluate(result5ManoIzq, hueco2ManoIzq, CSG.SUBTRACTION);

    // Añado la mano Final al rey
    resultFinalManoIzq.position.set(3.9, 0.3, -0.9); // Cambiamos la posición de la mano
    resultFinalManoIzq.userData = this;
    this.add(resultFinalManoIzq);
    
    // ------------------------------- Protector de la muñeca ------------------------

    if(ReyModelo.geometriaProtecMunecaIzq == null)
      ReyModelo.geometriaProtecMunecaIzq = this.crearGeometriaProtecMunecaIzq();
    
    // Creamos el protector de la muñeca
    var prtMunecaIzqda = new THREE.Mesh(ReyModelo.geometriaProtecMunecaIzq , material);
    
    // Añadimos el protector de la muñeca al rey
    prtMunecaIzqda.userData = this;
    this.add(prtMunecaIzqda);
  }

  crearBrazoDerecho(material){
    // --------------------------------------------------------------------------------
    // ----------------------------- Brazo derecho ------------------------------------
    // --------------------------------------------------------------------------------

    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    // ---------------------------- Protección del hombro -----------------------------

    if(ReyModelo.geometriaProtecHombroDcho == null)
      ReyModelo.geometriaProtecHombroDcho = this.crearGeometriaProtecHombroDcho();
    
    // Creamos la protección del hombro
    var prtHombroDcho = new THREE.Mesh(ReyModelo.geometriaProtecHombroDcho, material);

    // Añadimos la protección del hombro al rey
    prtHombroDcho.userData = this;
    this.add(prtHombroDcho);


    // --------------------- Parte superior del brazo --------------------------------   

    if(ReyModelo.geometriaParteSupBrazoDcho == null)
      ReyModelo.geometriaParteSupBrazoDcho = this.crearGeometriaParteSupBrazoDcho();

    // Creamos la parte superior del brazo
    var brazoSupDcho = new THREE.Mesh(ReyModelo.geometriaParteSupBrazoDcho, material);

    // Añadimos la parte superior del brazo al rey
    brazoSupDcho.userData = this;
    this.add(brazoSupDcho);

    // ------------------------------- Codo ------------------------------------------

    if(ReyModelo.geometriaCodoDcho == null)
      ReyModelo.geometriaCodoDcho = this.crearGeometriaCodoDcho();

    // Creamos el codo
    var codoDcho = new THREE.Mesh(ReyModelo.geometriaCodoDcho, material);

    // Añadimos el codo al rey
    codoDcho.userData = this;
    this.add(codoDcho);


    // --------------------- Parte inferior del brazo --------------------------------

    if(ReyModelo.geometriaBrazoInfDcho == null)
      ReyModelo.geometriaBrazoInfDcho = this.crearGeometriaParteInfBrazoDcho();

    // Creamos la parte inferior del brazo
    var brazoDchoInf = new THREE.Mesh(ReyModelo.geometriaBrazoInfDcho, material);

    // Añadimos la parte inferior del brazo al rey
    brazoDchoInf.userData = this;
    this.add(brazoDchoInf);

    // ------------------------------- Mano Derecha --------------------------------

    // Definimos la geometría de la mano derecha
    // Será una caja a la que simulará la forma de la mano, que estará cerrada
    // sujetando una espada. La forma de los dedos y el interior de la mano se
    // realizará con operaciones booleanas
    var manoDchaGeom = new THREE.BoxGeometry(0.5, 0.5, 0.4);
    
    // La posicionamo
    manoDchaGeom.translate(3.55, 8.9, 2.85);

    // Creamos la mano derecha
    var manoDcha = new CSG.Brush(manoDchaGeom, material);

    // Definimos la geometría de 4 dedos
    var dedos1DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos2DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos3DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos4DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
    var dedos5DchaGeom = new THREE.BoxGeometry(0.4, 0.1, 0.03);

    // Las posicionamos 
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
    var hueco1ManoDchaGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, ReyModelo.RES);
    var hueco2ManoDchaGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, ReyModelo.RES);

    // La posicionamos 
    hueco1ManoDchaGeom.translate(3.39, 8.7, 2.77);
    hueco2ManoDchaGeom.translate(3.52, 8.9, 2.85);

    // Creamos el hueco de la mano
    var huecoManoDcha = new CSG.Brush(hueco1ManoDchaGeom, material);
    var hueco2ManoDcha = new CSG.Brush(hueco2ManoDchaGeom, material);

    // Realizamos la operación booleana
    var result6ManoDcha = evaluator.evaluate(result5ManoDcha, huecoManoDcha, CSG.SUBTRACTION);
    var resultFinalManoDcha = evaluator.evaluate(result6ManoDcha, hueco2ManoDcha, CSG.SUBTRACTION);

    // Añado la mano Final al rey
    resultFinalManoDcha.position.set(-3.2, 1.2, -0.9);
    resultFinalManoDcha.userData = this;
    this.add(resultFinalManoDcha);  


    // ------------------------------- Protector de la muñeca ------------------------
    if(ReyModelo.geometriaProtecMunecaDcho == null)
      ReyModelo.geometriaProtecMunecaDcho = this.crearGeometriaProtecMunecaDcho();

    // Creamos el protector de la muñeca
    var prtMunecaDcha = new THREE.Mesh(ReyModelo.geometriaProtecMunecaDcho , material);
    
    // Añadimos el protector de la muñeca al rey
    prtMunecaDcha.userData = this;
    this.add(prtMunecaDcha);
  }

  crearEspada(material){
    // --------------------------------------------------------------------------------
    // ------------------------------- Espada ----------------------------------------
    // --------------------------------------------------------------------------------

    // Defino la forma 2D de la hoja de la espada
    var formHojaEspada = new THREE.Shape();
    formHojaEspada.moveTo(0, 0);
    formHojaEspada.lineTo(0.3, 0);
    formHojaEspada.lineTo(0.3, 7);
    formHojaEspada.lineTo(0, 8);
    formHojaEspada.lineTo(-0.3, 7);
    formHojaEspada.lineTo(-0.3, 0);
    formHojaEspada.lineTo(0, 0);

    // Definimos las geometrías 
    var mastil1EspadaGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.7, ReyModelo.RES);
    var mastil2EspadaGeom = new THREE.CylinderGeometry(0.15, 0.15, 2.2, ReyModelo.RES);
    var opchojaEspadaGeom = { depth : 0.01, steps : ReyModelo.RES, bevelEnabled : false } ;
    var hojaEspadaGeom = new THREE.ExtrudeGeometry ( formHojaEspada , opchojaEspadaGeom );

    // Las posicionamos y orientamos
    mastil1EspadaGeom.translate(0.35, 9.6, 1.95);
    mastil2EspadaGeom.rotateZ(Math.PI / 2);
    mastil2EspadaGeom.translate(0.35, 8.8, 1.95);
    hojaEspadaGeom.rotateX(Math.PI);
    hojaEspadaGeom.translate(0.35, 8.7, 1.95);

    // Creamos la espada
    var mastil1Espada = new THREE.Mesh(mastil1EspadaGeom, material);
    var mastil2Espada = new THREE.Mesh(mastil2EspadaGeom, material);
    var hojaEspada = new THREE.Mesh(hojaEspadaGeom, material);

    // Añadimos la espada al rey
    mastil1Espada.userData = this;
    mastil2Espada.userData = this;
    hojaEspada.userData = this;
    this.add(mastil1Espada);
    this.add(mastil2Espada);
    this.add(hojaEspada);
  }

  crearTrenSuperior(material){
    // Creamos la cadera y el tronco
    this.crearCaderaTronco(material);

    // Creamos el cuello
    this.crearCuello(material);

    // Creamos la cabeza
    this.crearCabeza(material);

    // Creamos el brazo izquierdo
    this.crearBrazoIzquierdo(material);

    // Creamos el brazo derecho
    this.crearBrazoDerecho(material);

    // Creamos la espada
    this.crearEspada(material);
  }

  /*############################################################################*/
  // Método update del objeto

  actualizar()
  {
  }
}
