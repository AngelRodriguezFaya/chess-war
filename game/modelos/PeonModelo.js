/**
 * @file PeonModelo.js
 * @description Modelo de un peón del juego de ajedrez.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */

/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'
import * as TWEEN from '../../libs/tween.module.js' // Para las animaciones

import { TipoPieza } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'



/*############################################################################*/
// Clase Peon

/**
 * @class PeonModelo
 * @description Modelo 3D de un peón del juego del ajedrez. Representado como un guerrero medieval.
 * @author Francisco Victoriano Pérez Morales
 * @author Ángel Rodríguez Faya
 * @date Última modificación: 23/05/2025
 */
export class PeonModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Variables de clase
  // Geometrías ------------------------------------------
  static RES = 20; // Resolución de las geometrías
  static geometriaPie = null;
  static geometriaEspinilla = null; 
  static geometriaRodilla = null;
  static geometriaMuslo = null;
  static geometriaCadera = null;
  static geometriaTorso = null;
  static geometriaCuello = null;
  static geometriaFormaCabeza = null;
  static geometriaOjos = null;
  static geometriaFiloCasco = null;
  static geometriaMano = null;
  static geometriaParteInfBrazo = null;
  static geometriaCodo = null;
  static geometriaParteSupBrazo = null;
  static geometriaProtecHombroIzq = null;
  static geometriaProtecHombroDcho = null;
  static geometriaEspada = null;
  static geometriaMastil2Espada = null;
  static geometriaHojaEspada = null;
  static geometriaAsaEscudo = null;
  static geometriaEscudo = null;

  // Transformaciones ------------------------------------
  static rotacionPiernas = Math.PI/50;


  // Medidas ---------------------------------------------

    // Pie
  static wPie = 0.6;  // Anchura
  static hPie = 0.7;  // Altura
  static dPie = 2;  // Profundidad

    // Espinilla
  static rSEspinilla = 0.5; // Radio Superior 
  static rIEspinilla = 0.4; // Radio Inferior
  static hEspinilla = 2.6;  // Altura

    // Rodilla
  static rRodilla = 0.52; // Radio

    // Muslo
  static rSMuslo = 0.8; // Radio Superior
  static rIMuslo = 0.5; // Radio Inferior
  static hMuslo = 2.7;  // Altura

    // Cadera
  static wCadera = 3.5; // Anchura
  static hCadera = 2.5; // Altura
  static dCadera = 1.2; // Profundidad

    // Tren inferior
  static hTrenInferior = PeonModelo.hPie + PeonModelo.hEspinilla + PeonModelo.hMuslo + PeonModelo.hCadera; // Altura del tren inferior

    // Torso
  static wTorso = 1.8; // Anchura
  static hTorso = 3.3;   // Altura
  static dTorso = 1.2; // Profundidad

    // Cuello
  static rCuello = 1.1 // Radio
  static hCuello = 0.8; // Altura

    // Cabeza

      // Forma de la cabeza
  static rFormaCabeza = 0.9; // Radio 
  static hFormaCabeza = 2; // Altura

      // Ojos 
  static wOjos = 2; // Anchura
  static hOjos = 0.1; // Altura
  static dOjos = 2; // Profundidad 

    // Brazos
      // Mano
  static wMano = 0.5; // Anchura
  static hMano = 0.5; // Altura
  static dMano = 0.4; // Profundidad

      // Parte inferior del brazo
  static rSInfBrazo = 0.4; // Radio Superior
  static rIInfBrazo = 0.2; // Radio Inferior
  static hInfBrazo = 2.5; // Altura

      // Codo
  static rCodo = 0.42; // Radio 

      // Parte superior del brazo
  static rSSupBrazo = 0.5;  // Radio Superior
  static rISupBrazo = 0.4;  // Radio Inferior
  static hSupBrazo = 2.7;   // Altura 

      // Protección del hombro
  static rSProtecHombro = 0.9; // Radio Superior
  static rIProtecHombro = 0.1; // Radio Inferior
  static hProtecHombro = 1.2; // Altura



  /*############################################################################*/
  // Constructor

  constructor(material, posicion_en_tablero, tipo_jugador)
  {
    // Llamamos al constructor padre
    super(posicion_en_tablero, TipoPieza.PEON, tipo_jugador);

    // Creación del modelo
    this.crearModelo(material);
  }



  /*############################################################################*/
  // Creación del modelo

  crearModelo(material){
    // Parámetros para establecer la postura inicial del peón
      // Brazo izquierdo
    this.rot_X_brazoInfIzq = - Math.PI/2;  
    this.rot_Y_brazoInfIzq = 0;
    this.rot_Z_brazoInfIzq = 0;

    this.rot_X_brazoSupIzq = Math.PI/10;
    this.rot_Y_brazoSupIzq = 0;
    this.rot_Z_brazoSupIzq = 0;

      // Brazo derecho
    this.rot_X_brazoInfDcho = - Math.PI/2;
    this.rot_Y_brazoInfDcho = 0;
    this.rot_Z_brazoInfDcho = 0;

    this.rot_X_brazoSupDcho = 0;
    this.rot_Y_brazoSupDcho = 0;
    this.rot_Z_brazoSupDcho = - Math.PI/10;

      // Tren Superior
    this.rot_X_TrenSuperior = 0; 
    
    this.pos_X_TrenSuperior = 0; 
    this.pos_Y_TrenSuperior = PeonModelo.hTrenInferior; 
    this.pos_Z_TrenSuperior = 0; 


    // Creamos el peón

      // Creamos el tren inferior
    this.crearTrenInferior(material);

      // Creamos el tren superior
    this.crearTrenSuperior(material);

    // Inicializar animaciones
    this.inicializarAnimaciones();
  }



  /*############################################################################*/
  // Métodos para crear las geometrías de las partes del modelo

  crearGeometriaPie(){
    // Creamos la forma 2D del pie
    const formaPie = new THREE.Shape();
    formaPie.moveTo(0, 0);
    formaPie.lineTo(PeonModelo.dPie, 0);    // (2, 0)  
    formaPie.lineTo(PeonModelo.dPie, 0.4);  // (2, 0.4)
    formaPie.lineTo(0.8, PeonModelo.hPie);  // (0.8, 0.7)
    formaPie.lineTo(0, PeonModelo.hPie);    // (0, 0.7)
    formaPie.lineTo(0, 0);

    // Definimos la geometría del pie por extrusión
    var opciones = { depth : PeonModelo.wPie, steps : 2, bevelEnabled : true } ;
    var geomPie = new THREE. ExtrudeGeometry ( formaPie , opciones );

    // Posicionamos y orientamos la geometría
    geomPie.rotateY(-Math.PI/2);
    geomPie.translate(PeonModelo.wPie/2, -PeonModelo.hPie, -0.4);

    return geomPie;
  }



  crearGeometriaEspinilla(){
    // Definimos las geometría de la parte inferior de la pierna (Espinilla)
    var geomEspinilla = new THREE.CylinderGeometry(PeonModelo.rSEspinilla, PeonModelo.rIEspinilla, 
      PeonModelo.hEspinilla, PeonModelo.RES);

    // Posicionamos y orientamos la geometría
    // geomEspinilla.rotateZ(-PeonModelo.rotacionPiernas);

    // Se crea con el origen centrado, por lo que la trasladamos la mitad de su altura
    geomEspinilla.translate(0, -PeonModelo.hEspinilla/2, 0);

    return geomEspinilla;
  }



  crearGeometriaRodilla(){
    // Definimos la geometría de la rodilla
    var geomRodilla = new THREE.SphereGeometry(PeonModelo.rRodilla, PeonModelo.RES, PeonModelo.RES);

    // Posicionamos la geometría
    geomRodilla.translate(0, -PeonModelo.rRodilla/2, 0);

    return geomRodilla;
  }



  crearGeometriaMuslo(){
    // Definimos la geometría de la parte superior de la pierna (Muslo)
    var geomMuslo = new THREE.CylinderGeometry(PeonModelo.rSMuslo, PeonModelo.rIMuslo, 
      PeonModelo.hMuslo, PeonModelo.RES);
    
    // Posicionamos la geometría
    geomMuslo.translate(0, -PeonModelo.hMuslo/2, 0);

    return geomMuslo;
  }



  crearGeometriaCadera(material){
    // Definimos la forma 2D de la cadera
    const formaCadera = new THREE.Shape();
    formaCadera.moveTo(-0.4, 0);
    formaCadera.quadraticCurveTo(0, 1, 0.4, 0);
    formaCadera.lineTo(PeonModelo.wCadera/2, 0); // (1.75, 0)
    formaCadera.quadraticCurveTo(1.8, 1, 1.4, PeonModelo.hCadera); // (1.8, 1, 1.4, 2.5)
    formaCadera.lineTo(-1.4, PeonModelo.hCadera); // (-1.4, 2.5)
    formaCadera.quadraticCurveTo(-1.8, 1, -(PeonModelo.wCadera/2), 0); // (-1.8, 1, -1.75, 0)
    formaCadera.lineTo(-0.4, 0);

    // Definimos la geometría de la cadera y el tronco por extrusión
    var opciones = { depth : PeonModelo.dCadera, steps : 2, bevelEnabled : true } ;
    var geomCadera = new THREE. ExtrudeGeometry ( formaCadera , opciones );

    // Posicionamos la geometría
    geomCadera.translate(0, -PeonModelo.hCadera, -PeonModelo.dCadera/2);
    
    return geomCadera;
  }



  crearGeometriaTorso(){
    // Definimos la forma 2D del torso
    const formaCadTron = new THREE.Shape();
    formaCadTron.moveTo(0, 0);
    formaCadTron.lineTo(1.4, 0);
    formaCadTron.lineTo(PeonModelo.wTorso, 3); // (1.8, 3)
    formaCadTron.lineTo(1, PeonModelo.hTorso); // (1, 3.3)
    formaCadTron.lineTo(-1, PeonModelo.hTorso) // (-1, 3.3)
    formaCadTron.lineTo(-PeonModelo.wTorso, 3); // (-1.8, 3)
    formaCadTron.lineTo(-1.4, 0); 
    formaCadTron.lineTo(0, 0);

    // Definimos la geometría del torso
    var opciones = { depth : PeonModelo.dTorso, steps : 2, bevelEnabled : true } ;
    var geomTorso = new THREE. ExtrudeGeometry ( formaCadTron , opciones );

    // Posicionamos la geometría
    geomTorso.translate(0, 0, -PeonModelo.dTorso/2);

    return geomTorso;
  }



  crearGeometriaCuello(){
    // Definimos la forma 2D del cuello
    var formaCuello = new THREE.Shape();
    formaCuello.moveTo(0, 0);
    formaCuello.quadraticCurveTo(0.2, -1.5, PeonModelo.rCuello, 0.4); // (0.2, -1.5, 1.1, 0.4) 
    formaCuello.lineTo(0.6, PeonModelo.hCuello); // (0.6, 0.8)
    formaCuello.lineTo(0, 0); 

    // Definimos la geometría del cuello por revolución
    var puntosCuello = formaCuello.getPoints();
    var geomCuello = new THREE. LatheGeometry ( puntosCuello , PeonModelo.RES, 0, Math.PI * 2) ;
    
    return geomCuello;
  }



  crearGeometriaFormaCabeza(){
    // Definimos la forma 2D de la cabeza
    var formaCabeza = new THREE.Shape();
    formaCabeza.moveTo(0, 0);
    formaCabeza.lineTo(0.6, 0);
    formaCabeza.quadraticCurveTo(0.9, 0.5, 0.9, 1);
    formaCabeza.quadraticCurveTo(0.7, 1.8, 0, 2);

    // Definimos la geometría de la cabeza por revolución
    var puntosCabeza = formaCabeza.getPoints();
    var geomFormaCabeza = new THREE. LatheGeometry ( puntosCabeza , PeonModelo.RES, 0, Math.PI * 2);

    return geomFormaCabeza;
  }



  crearGeometriaOjos(){
    // Definimos la geometría de la apertura del casco para los ojos
    var geomOjos = new THREE.BoxGeometry(PeonModelo.wOjos, PeonModelo.hOjos, PeonModelo.dOjos);

    // La posicionamos y orientamos
    geomOjos.rotateX(Math.PI / 20);
    geomOjos.translate(0, 0.9, 1.4);

    return geomOjos;
  }



  crearGeometriaFiloCasco(){
    // Definimos la forma 2D del filo del casco
    var formaFilo = new THREE.Shape();
    formaFilo.moveTo(0, 0);
    formaFilo.lineTo(0.15, 0);
    formaFilo.lineTo(0, 0.25);
    formaFilo.lineTo(-0.15, 0);
    formaFilo.lineTo(0, 0);

    // Definimos el camino que seguirá el filo del casco
    var camino = new THREE.CatmullRomCurve3( [
      new THREE.Vector3(0, 1.7, 0.5),
      new THREE.Vector3(0, 1.9, 0),
      new THREE.Vector3(0.0, 1.7, -0.4),
      new THREE.Vector3(0.0, 1.4, -0.6),
      new THREE.Vector3(0.0, 0.9, -0.7),
      new THREE.Vector3(0.0, 0.4, -0.5),
    ] );

    // Indicamos las opciones necesarias para el barrido
    var opcionesGeom = {curveSegments: PeonModelo.RES, steps: 80, extrudePath: camino};

    // Definimos la geometría del filo del casco por barrido
    var filoGeom = new THREE.ExtrudeGeometry(formaFilo, opcionesGeom);
    
    return filoGeom;
  }



  crearGeometriaMano(){
    // Definimos la geometría de la mano 
    var manoGeom = new THREE.BoxGeometry(PeonModelo.wMano, PeonModelo.hMano, PeonModelo.dMano);

    // Posicionamos la geometría
    manoGeom.translate(0, -PeonModelo.hMano/2, 0);

    return manoGeom;
  }



  crearGeometriaParteInfBrazo(){
    // Definimos la geometría de la parte inferior del brazo
    var brazoInfGeom = new THREE.CylinderGeometry(PeonModelo.rSInfBrazo, PeonModelo.rIInfBrazo,
      PeonModelo.hInfBrazo, PeonModelo.RES);

    // Posicionamos la geometría
    brazoInfGeom.translate(0, -PeonModelo.hInfBrazo/2, 0);

    return brazoInfGeom;
  }



  crearGeometriaCodo(){
    // Definimos la geometría del codo
    var codoGeom = new THREE.SphereGeometry(PeonModelo.rCodo, PeonModelo.RES, PeonModelo.RES);
  
    // Posicionamos la geometría
    codoGeom.translate(0, -PeonModelo.rCodo, 0);

    return codoGeom;
  }



  crearGeometriaParteSupBrazo(){
    // Definimos la geometría de la parte superior del brazo
    var brazoSupGeom = new THREE.CylinderGeometry(PeonModelo.rSSupBrazo, PeonModelo.rISupBrazo,
    PeonModelo.hSupBrazo, PeonModelo.RES);

    // Posicionamos y orientamos la geometría
    brazoSupGeom.translate(0, -PeonModelo.hSupBrazo/2, 0);

    return brazoSupGeom;
  }



  crearGeometriaProtecHombroIzq(){
    // Definimos la geometría de la protección del hombro
    var prtHombroIzqGeom = new THREE.CylinderGeometry(PeonModelo.rSHombro, PeonModelo.rIHombro,
      PeonModelo.hHombro, PeonModelo.RES);
    
    // Posicionamos y orientamos la geometría
    prtHombroIzqGeom.rotateZ(Math.PI/4);
    prtHombroIzqGeom.translate(0, - PeonModelo.hProtecHombro/2 - 0.2, 0);

    return prtHombroIzqGeom;
  }



  crearGeometriaProtecHombroDcho(){
    // Definimos la geometría de la protección del hombro
    var prtHombroDchoGeom = new THREE.CylinderGeometry(PeonModelo.rSHombro, PeonModelo.rIHombro,
      PeonModelo.hHombro, PeonModelo.RES);

    // Posicionamos y orientamos la geometría
    prtHombroDchoGeom.rotateZ(-Math.PI/4);
    prtHombroDchoGeom.translate(0, - PeonModelo.hProtecHombro/2 - 0.2, 0);

    return prtHombroDchoGeom;
  }



  crearGeometriaEspada(){
    // Definimos la geometría de la espada (será el mástil por donde se agarrará)
    var espadaGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.4, PeonModelo.RES);

    // Posicionamos la geometría
    espadaGeom.translate(0, 0, 0);

    return espadaGeom;
  }



  crearGeometriaMastil2Espada(){
    // Definimos la geometría del mástil de la espada
    var mastil2EspadaGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.7, PeonModelo.RES);

    // Posicionamos y orientamos la geometría
    mastil2EspadaGeom.rotateZ(Math.PI / 2);
    mastil2EspadaGeom.translate(0, 0.5, 0);

    return mastil2EspadaGeom;
  }



  crearGeometriaHojaEspada(){
     // Defino la forma 2D de la hoja de la espada
    var formaHojaEspada = new THREE.Shape();
    formaHojaEspada.moveTo(0, 0);
    formaHojaEspada.lineTo(0.15, 0);
    formaHojaEspada.lineTo(0.15, 6.5);
    formaHojaEspada.lineTo(0, 7);
    formaHojaEspada.lineTo(-0.15, 6.5);
    formaHojaEspada.lineTo(-0.15, 0);
    formaHojaEspada.lineTo(0, 0);
    
    // Definimos las geometrías 
    var opc_hojaEspadaGeom = { depth : 0.01, steps : PeonModelo.RES, bevelEnabled : false } ;
    var hojaEspadaGeom = new THREE.ExtrudeGeometry ( formaHojaEspada , opc_hojaEspadaGeom );
    
    // Posicionamos la geometría
    hojaEspadaGeom.translate(0, 0.5, 0);
    
    return hojaEspadaGeom;
  }



  crearGeometriaAsaEscudo(){
    // Definimos la geometría del asa del escudo
    var asaEscudoGeom = new THREE.TorusGeometry(0.5, 0.1, PeonModelo.RES);

    // Posicionamos y orientamos la geometría
    asaEscudoGeom.rotateY(Math.PI / 2);
    asaEscudoGeom.translate(0, 0, 0);

    return asaEscudoGeom;
  }



  crearGeometriaEscudo(){
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
    geomEscudo.translate(0, 0, 0);

    return geomEscudo;
  }



  /*############################################################################*/
  // Métodos para crear las partes del modelo

  // ---------------------------------------------------------------------------
  // ---------------------  Tren Inferior  -------------------------------------
  // ---------------------------------------------------------------------------
  
  // ---------------------  Pie Izquierdo  -------------------------------------

  crearPieIzquierdo(material){
    // Usamos la variable de clase para la geometría del pie
    if (PeonModelo.geometriaPie == null)
      PeonModelo.geometriaPie = this.crearGeometriaPie();
    
    // Creamos el pie izquierdo
    var pieIzq = new THREE.Mesh (PeonModelo.geometriaPie, material);

    // Posicionamos el pie
    pieIzq.position.y = -(PeonModelo.hEspinilla + PeonModelo.rRodilla + PeonModelo.hMuslo) + 0.35;
    pieIzq.position.x = 0.35;
    
    pieIzq.userData = this;
    return pieIzq;
  }


  
  // ---------------------  Pie Derecho  -------------------------------------

  crearPieDerecho(material){
    // Usamos la variable de clase para la geometría del pie
    if (PeonModelo.geometriaPie == null)
      PeonModelo.geometriaPie = this.crearGeometriaPie();
    
    // Creamos el pie derecho
    var pieDer = new THREE.Mesh (PeonModelo.geometriaPie, material);

    // Posicionamos el pie
    pieDer.position.y = - (PeonModelo.hEspinilla + PeonModelo.rRodilla + PeonModelo.hMuslo) + 0.35;
    pieDer.position.x = - 0.35;
    
    pieDer.userData = this;
    return pieDer;
  }



  // ---------------------  Espinilla Izquierda y Derecha  ---------------------

  // Espinilla izquierda y derecha
  crearEspinilla(material){
    // Usamos la variable de clase para la geometría de la espinilla
    if (PeonModelo.geometriaEspinilla == null)
      PeonModelo.geometriaEspinilla = this.crearGeometriaEspinilla();

    // Creamos la espinilla izquierda
    var espinilla = new THREE.Mesh(PeonModelo.geometriaEspinilla, material);

    espinilla.position.y = -PeonModelo.rRodilla + 0.2;
    
    espinilla.userData = this;
    return espinilla;
  }



  // ---------------------  Rodilla Izquierda y Derecha  ---------------------

  // Rodilla izquierda y derecha
  crearRodilla(material){
    // Usamos la variable de clase para la geometría de la rodilla
    if (PeonModelo.geometriaRodilla == null)
      PeonModelo.geometriaRodilla = this.crearGeometriaRodilla();

    // Creamos la rodilla
    var rodilla = new THREE.Mesh(PeonModelo.geometriaRodilla, material);

    // Añadimos la espinilla
    rodilla.add(this.crearEspinilla(material));

    // Posicionamos la rodilla y la espinilla
    rodilla.position.y = -PeonModelo.hMuslo + 0.2;

    rodilla.userData = this;
    return rodilla;
  }



  // ---------------------  Muslo Izquierdo ----------------------------------

  crearMusloIzquierdo(material){
    // Usamos la variable de clase para la geometría del muslo
    if (PeonModelo.geometriaMuslo == null)
      PeonModelo.geometriaMuslo = this.crearGeometriaMuslo();
    
    // Creamos el muslo
    var musloIzq = new THREE.Mesh(PeonModelo.geometriaMuslo, material);

    // Añadimos la rodilla (y la espinilla) al muslo
    musloIzq.add(this.crearRodilla(material));

    // Orientamos el muslo
    musloIzq.rotation.z = PeonModelo.rotacionPiernas;

    musloIzq.userData = this;
    return musloIzq;
  }



  // ---------------------  Muslo Derecho ----------------------------------

  crearMusloDerecho(material, RES, ROTACION_PIERNAS){
    // Usamos la variable de clase para la geometría del muslo
    if (PeonModelo.geometriaMuslo == null)
      PeonModelo.geometriaMuslo = this.crearGeometriaMuslo();
    
    // Creamos el muslo
    var musloDer = new THREE.Mesh(PeonModelo.geometriaMuslo, material);

    // Añadimos la rodilla (y la espinilla) al muslo
    musloDer.add(this.crearRodilla(material));

    // Orientamos el muslo
    musloDer.rotation.z = - PeonModelo.rotacionPiernas;

    musloDer.userData = this;
    return musloDer;
  }


  // ---------------------  Pierna Izquierda -------------------------------

  crearPiernaIzquierda(material){
    var piernaIzq = new THREE.Object3D();

    // Añadimos el pie izquierdo
    piernaIzq.add(this.crearPieIzquierdo(material));

    // Añadimos el muslo (y rodilla y espinilla) izquierdo
    piernaIzq.add(this.crearMusloIzquierdo(material));

    // Posicionamos la pierna
    piernaIzq.position.set((PeonModelo.wCadera/2 - PeonModelo.rSMuslo + 0.05), -PeonModelo.hCadera, 0);

    //piernaIzq.userData = this;
    return piernaIzq;
  }



  // ---------------------  Pierna Derecha -------------------------------

  crearPiernaDerecha(material){
    var piernaDer = new THREE.Object3D();

    // Añadimos el pie derecho
    piernaDer.add(this.crearPieDerecho(material));

    // Añadimos el muslo (y rodilla y espinilla) derecho
    piernaDer.add(this.crearMusloDerecho(material));

    // Posicionamos la pierna
    piernaDer.position.set((-(PeonModelo.wCadera/2) + PeonModelo.rSMuslo - 0.05), -PeonModelo.hCadera, 0);

    //piernaDer.userData = this;
    return piernaDer;
  }
  


  // ---------------------  Cadera ----------------------------------

  crearCadera(material){
    // Usamos la variable de clase para la geometría del cadera
    if (PeonModelo.geometriaCadera == null)
      PeonModelo.geometriaCadera = this.crearGeometriaCadera();
    
    // Creamos la cadera
    var cadera = new THREE.Mesh(PeonModelo.geometriaCadera, material);

    cadera.userData = this;
    return cadera;
  }


  // ---------------------  Tren Inferior ----------------------------------

  crearTrenInferior(material){
    var trenInferior = new THREE.Object3D();

    // Añadimos la pierna izquierda
    trenInferior.add(this.crearPiernaIzquierda(material));

    // Añadimos la pierna derecha
    trenInferior.add(this.crearPiernaDerecha(material));

    // Añadimos la cadera
    trenInferior.add(this.crearCadera(material));

    // Posicionamos el tren inferior
    trenInferior.position.y = PeonModelo.hTrenInferior;

    trenInferior.userData = this;
    this.add(trenInferior);
  }



  // ---------------------------------------------------------------------------
  // ---------------------  Tren Superior  -------------------------------------
  // ---------------------------------------------------------------------------

  // ---------------------  Torso ----------------------------------

  crearTorso(material){
    // Usamos la variable de clase para la geometría del torso
    if (PeonModelo.geometriaTorso == null)
      PeonModelo.geometriaTorso = this.crearGeometriaTorso();
    
    // Creamos el torso
    var torso = new THREE.Mesh(PeonModelo.geometriaTorso, material);

    torso.userData = this;
    return torso;
  } 



  // ---------------------  Cuello ----------------------------------

  crearCuello(material){
    // Usamos la variable de clase para la geometría del cuello
    if (PeonModelo.geometriaCuello == null)
      PeonModelo.geometriaCuello = this.crearGeometriaCuello();
  
    // Creamos el cuello
    var cuello = new THREE.Mesh(PeonModelo.geometriaCuello, material);

    // Posicionamos el cuello
    cuello.position.y = PeonModelo.hTorso - PeonModelo.hCuello/2;

    cuello.userData = this;
    return cuello;
  }


  // ---------------------  Cabeza ----------------------------------

  crearFormaCabeza(material){
    // Usamos la variable de clase para la geometría de la forma de lacabeza
    if (PeonModelo.geometriaFormaCabeza == null)
      PeonModelo.geometriaFormaCabeza = this.crearGeometriaFormaCabeza();

    // Creamos la forma de la cabeza
    var formaCabeza = new CSG.Brush(PeonModelo.geometriaFormaCabeza, material);
  
    formaCabeza.userData = this;
    return formaCabeza;
  }


  // ---------------------  Apertura para los ojos ------------------

  crearOjos(material){
    // Usamos la variable de clase para la geometría de la apertura del casco para los ojos
    if (PeonModelo.geometriaOjos == null)
      PeonModelo.geometriaOjos = this.crearGeometriaOjos();
    
    // Creamos la apertura del casco para los ojos
    var ojos = new CSG.Brush(PeonModelo.geometriaOjos, material);

    // Creamos un Evaluador que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    // Realizamos las operaciones booleanas
    var formaCabeza = this.crearFormaCabeza(material);
    var cabezaOjos = evaluator.evaluate(formaCabeza, ojos, CSG.SUBTRACTION);

    // Añadimos el resultado cabezaOjos (Cabeza + aperura para los ojos) al peón
    cabezaOjos.userData = this;
    return cabezaOjos;
    
  }



  // ---------------------  Filo del casco ----------------------------

  crearFiloCasco(material){
    // Usamos la variable de clase para la geometría del filo del casco
    if (PeonModelo.geometriaFiloCasco == null)
      PeonModelo.geometriaFiloCasco = this.crearGeometriaFiloCasco();

    // Creamos el filo del casco
    var filoCasco = new THREE.Mesh(PeonModelo.geometriaFiloCasco, material);

    filoCasco.userData = this;
    return filoCasco;
  }



  // ---------------------  Defensa de la mandíbula ------------------

  crearDefensaMandibula(material){
    var evaluator = new CSG.Evaluator();
    
    // Definimos las geometrías para la defensa de la mandíbula
    var mandibGeom = new THREE.CylinderGeometry(0.9, 0.9, 1, PeonModelo.RES, PeonModelo.RES, false);
    var cajaAux = new THREE.BoxGeometry(3, 1.1, 3);

    // Posicionamos y orientamos las geometrías
    mandibGeom.rotateX(Math.PI / 20);
    mandibGeom.translate(0, 12.8, -2.5);

    cajaAux.rotateX(Math.PI / 4);
    cajaAux.translate(0, 12.35, -2.7);

    // Creamos la defensa de la mandíbula
    var mandibula = new CSG.Brush(mandibGeom, material);
    var cajaAux = new CSG.Brush(cajaAux, material);

    var defensa = evaluator.evaluate(mandibula, cajaAux, CSG.SUBTRACTION);
    defensa.userData = this;
    defensa.position.set(0, 0.15, 2.6);

    // Cilindros de la defensa de la mandíbula

    // Definimos la geometría de los cilindros
    var cilindro1 = new THREE.CylinderGeometry(0.2, 0.2, 0.1, PeonModelo.RES);
    var cilindro2 = new THREE.CylinderGeometry(0.2, 0.2, 0.1, PeonModelo.RES); 

    // Posicionamos y orientamos los cilindros
    cilindro1.rotateZ(Math.PI / 2);
    cilindro1.translate(0.9, 13.3, -2.6);

    cilindro2.rotateZ(Math.PI / 2);
    cilindro2.translate(-0.9, 13.3, -2.6);

    // Creamos los cilindros
    var cilindro1 = new THREE.Mesh(cilindro1, material);
    var cilindro2 = new THREE.Mesh(cilindro2, material);

    // Añadimos los cilindros al peón
    cilindro1.userData = this;
    cilindro2.userData = this;
    defensa.add(cilindro1);
    defensa.add(cilindro2);

    defensa.position.set(0, -12.2, 2.6);

    return defensa;
  }



  // ---------------------  Cabeza ----------------------------------

  crearCabeza(material){
    var cabeza = new THREE.Object3D();

    // Añadimos la forma de la cabeza + apertura para los ojos
    cabeza.add(this.crearOjos(material));

    // Añadimos el filo del casco
    cabeza.add(this.crearFiloCasco(material));

    // Añadimos la defensa de la mandíbula
    cabeza.add(this.crearDefensaMandibula(material));

    cabeza.userData = this;
    cabeza.position.y = PeonModelo.hTorso + PeonModelo.hCuello/2;

   return cabeza;
  }

  
  // -----------------------------------------------------------------
  // ------------------------ Brazo Izquierdo ------------------------
  // -----------------------------------------------------------------

  // ---------------------  Mano Izquierda ---------------------------

  crearManoIzquierda(material){
    // Usamos la variable de clase para la geometría de la mano.
    if (PeonModelo.geometriaMano == null)
      PeonModelo.geometriaMano = this.crearGeometriaMano();

    // Creamos la mano izquierda
    var manoIzq = new CSG.Brush(PeonModelo.geometriaMano, material);

    // Añadimos el escudo a la mano izquierda
    manoIzq.add(this.crearEscudo(material));

    // Posicionamos la mano
    manoIzq.position.y = -PeonModelo.hInfBrazo;

    manoIzq.userData = this;
    return manoIzq;
  }



  // ---------------------  Parte Inferior del Brazo Izquierdo ---------

  crearParteInfBrazoIzquierdo(material){
    // Usamos la variable de clase para la geometría de la parte inferior del brazo
    if (PeonModelo.geometriaParteInfBrazo == null)
      PeonModelo.geometriaParteInfBrazo = this.crearGeometriaParteInfBrazo();
    
    // Creamos la parte inferior del brazo
    // Se crea como this.brazoInfIzq para poder acceder a él fuera de este método
    this.brazoInfIzq = new THREE.Mesh(PeonModelo.geometriaParteInfBrazo, material);

    // Añadimos la mano izquierda al brazo
    this.brazoInfIzq.add(this.crearManoIzquierda(material));

    // Aplicamos las rotaciones necesarias
    this.brazoInfIzq.rotation.set(this.rot_X_brazoInfIzq, this.rot_Y_brazoInfIzq, this.rot_Z_brazoInfIzq);
    // this.brazoInfIzq.rotation.set (-Math.PI/2, 0, 0);

    // Posicionamos el antebrazo y la mano
    this.brazoInfIzq.position.y = - PeonModelo.rCodo;

    this.brazoInfIzq.userData = this;
  }



  // ---------------------  Codo Izquierdo ----------------------------

  crearCodoIzquierdo(material){
    // Usamos la variable de clase para la geometría del codo
    if (PeonModelo.geometriaCodo == null)
      PeonModelo.geometriaCodo = this.crearGeometriaCodo();
        
    // Creamos el codo
    var codoIzq = new THREE.Mesh(PeonModelo.geometriaCodo, material);

    // Añadimos la parte inferior del brazo izquierdo al codo
    this.crearParteInfBrazoIzquierdo(material);
    codoIzq.add(this.brazoInfIzq);

    // Posicionamos 
    codoIzq.position.y = -PeonModelo.hSupBrazo + 0.3;
  
    codoIzq.userData = this;
    return codoIzq;
  }
    


  // ---------------------  Parte Superior del Brazo Izquierdo ---------
  
  crearParteSupBrazoIzquierdo(material){
    // Usamos la variable de clase para la geometría de la parte superior del brazo
    if (PeonModelo.geometriaParteSupBrazo == null)
      PeonModelo.geometriaParteSupBrazo = this.crearGeometriaParteSupBrazo();
    
    // Creamos la parte superior del brazo
    // Se crea como this.brazoSupIzq para poder acceder a él fuera de este método
    this.brazoSupIzq = new THREE.Mesh(PeonModelo.geometriaParteSupBrazo, material);

    // Añadimos el codo izquierdo al brazo
    this.brazoSupIzq.add(this.crearCodoIzquierdo(material));

    // Aplicamos las rotaciones necesarias
    this.brazoSupIzq.rotation.set(this.rot_X_brazoSupIzq, this.rot_Y_brazoSupIzq, this.rot_Z_brazoSupIzq);
    // this.brazoSupIzq.rotation.set(Math.PI/10, 0, 0);

    // Posicionamos
    this.brazoSupIzq.position.y = - PeonModelo.hProtecHombro + 0.1;

    this.brazoSupIzq.userData = this;
  }



  // ---------------------  Protección del Hombro Izquierdo ------------

  crearProteccionHombroIzquierdo(material){
    // Usamos la variable de clase para la geometría de la protección del hombro
    if (PeonModelo.geometriaProtecHombroIzq == null)
      PeonModelo.geometriaProtecHombroIzq = this.crearGeometriaProtecHombroIzq();   
    
    // Creamos la protección del hombro
    var prtHombroIzq = new THREE.Mesh(PeonModelo.geometriaProtecHombroIzq, material);
    
    prtHombroIzq.userData = this;

    return prtHombroIzq;
  }


  // ---------------------  Brazo Izquierdo ----------------------------

  crearBrazoIzquierdo(material){
    // Creamos el brazo izquierdo
    var brazoIzq = new THREE.Object3D();

    // Añadimos la parte superior del brazo izquierdo ( y el codo y la parte inferior y la mano izquierda agarrando el escudo)
    this.crearParteSupBrazoIzquierdo(material);
    brazoIzq.add(this.brazoSupIzq);

    // Añadimos la protección del hombro izquierdo
    brazoIzq.add(this.crearProteccionHombroIzquierdo(material));

    // Posicionamos el brazo
    brazoIzq.position.set(PeonModelo.wTorso, PeonModelo.hTorso, 0);

    brazoIzq.userData = this;
    return brazoIzq;
  }


  // -----------------------------------------------------------------
  // ------------------------ Brazo Derecho --------------------------
  // -----------------------------------------------------------------

  // ---------------------  Mano Derecha -----------------------------

  crearManoDerecha(material){
    // Usamos la variable de clase para la geometría de la mano.
    if (PeonModelo.geometriaMano == null)
      PeonModelo.geometriaMano = this.crearGeometriaMano();
  
    // Creamos la mano derecha
    var manoDcha = new CSG.Brush(PeonModelo.geometriaMano, material);

    // Añadimos la espada
    manoDcha.add(this.crearEspada(material));

    // Posicionamos la mano
    manoDcha.position.y = -PeonModelo.hInfBrazo;

    manoDcha.userData = this;
    return manoDcha;
  }



  // ---------------------  Parte Inferior del Brazo Derecho ---------

  crearParteInfBrazoDerecho(material){
    // Usamos la variable de clase para la geometría de la parte inferior del brazo
    if (PeonModelo.geometriaParteInfBrazo == null)
      PeonModelo.geometriaParteInfBrazo = this.crearGeometriaParteInfBrazo();

    // Creamos la parte inferior del brazo
    // Se crea como this.brazoInfDcho para poder acceder a él fuera de este método
    this.brazoInfDcho = new THREE.Mesh(PeonModelo.geometriaParteInfBrazo, material);

    // Añadimos la mano derecha al brazo
    this.brazoInfDcho.add(this.crearManoDerecha(material));

    // Aplicamos las rotaciones necesarias
    this.brazoInfDcho.rotation.set(this.rot_X_brazoInfDcho, this.rot_Y_brazoInfDcho, this.rot_Z_brazoInfDcho);

    // Posicionamos el antebrazo y la mano
    this.brazoInfDcho.position.y = - PeonModelo.rCodo;
    
    this.brazoInfDcho.userData = this;
  }



  // ---------------------  Codo Derecho -----------------------------

  crearCodoDerecho(material){
    // Usamos la variable de clase para la geometría del codo
    if (PeonModelo.geometriaCodo == null)
      PeonModelo.geometriaCodo = this.crearGeometriaCodo();

    // Creamos el codo
    var codoDcho = new THREE.Mesh(PeonModelo.geometriaCodo, material);

    // Añadimos la parte inferior del brazo derecho al codo
    this.crearParteInfBrazoDerecho(material);
    codoDcho.add(this.brazoInfDcho);

    // Posicionamos 
    codoDcho.position.y = -PeonModelo.hSupBrazo + 0.3;

    codoDcho.userData = this;
    return codoDcho;
  }



  // ---------------------  Parte Superior del Brazo Derecho ---------

  crearParteSupBrazoDerecho(material){
    // Usamos la variable de clase para la geometría de la parte superior del brazo
    if (PeonModelo.geometriaParteSupBrazo == null)
      PeonModelo.geometriaParteSupBrazo = this.crearGeometriaParteSupBrazo();

    // Creamos la parte superior del brazo
    // Se crea como this.brazoSupDcho para poder acceder a él fuera de este método
    this.brazoSupDcho = new THREE.Mesh(PeonModelo.geometriaParteSupBrazo, material);

    // Añadimos el codo derecho al brazo
    this.brazoSupDcho.add(this.crearCodoDerecho(material));

    // Aplicamos las rotaciones necesarias
    this.brazoSupDcho.rotation.set(this.rot_X_brazoSupDcho, this.rot_Y_brazoSupDcho, this.rot_Z_brazoSupDcho);

    // Posicionamos
    this.brazoSupDcho.position.y = - PeonModelo.hProtecHombro + 0.1;

    this.brazoSupDcho.userData = this;
  }



  // ---------------------  Protección del Hombro Derecho ------------

  crearProteccionHombroDerecho(material){
    // Usamos la variable de clase para la geometría de la protección del hombro
    if (PeonModelo.geometriaProtecHombroDcho == null)
      PeonModelo.geometriaProtecHombroDcho = this.crearGeometriaProtecHombroDcho();
    
    // Creamos la protección del hombro
    var prtHombroDcho = new THREE.Mesh(PeonModelo.geometriaProtecHombroDcho, material);

    prtHombroDcho.userData = this;
    return prtHombroDcho;
  }



  // ---------------------  Brazo Derecho -----------------------------

  crearBrazoDerecho(material){
    // Creamos el brazo derecho
    var brazoDcho = new THREE.Object3D();
    
    // Añadimos la parte superior del brazo derecho ( y el codo y la parte inferior y la mano derecha con la espada)
    this.crearParteSupBrazoDerecho(material);
    brazoDcho.add(this.brazoSupDcho);
    
    // Añadimos la protección del hombro derecho
    brazoDcho.add(this.crearProteccionHombroDerecho(material));
    
    // Posicionamos el brazo
    brazoDcho.position.set(-PeonModelo.wTorso, PeonModelo.hTorso, 0);

    brazoDcho.userData = this;
    return brazoDcho;
  }

  

  // --------------------------- Tren Superior -----------------------------

  crearTrenSuperior(material){
    this.trenSuperior = new THREE.Object3D();

    // Añadimos el torso
    this.trenSuperior.add(this.crearTorso(material));

    // Añadimos el cuello
    this.trenSuperior.add(this.crearCuello(material));

    // Añadimos la cabeza
    this.trenSuperior.add(this.crearCabeza(material));

    // Añadimos el brazo izquierdo
    this.trenSuperior.add(this.crearBrazoIzquierdo(material));

    // Añadimos el brazo derecho
    this.trenSuperior.add(this.crearBrazoDerecho(material));

    // Añadimos las rotaciones necesarias
    this.trenSuperior.rotation.x = this.rot_X_TrenSuperior;

    // Posicionamos el tren superior
    this.trenSuperior.position.set(this.pos_X_TrenSuperior, this.pos_Y_TrenSuperior, this.pos_Z_TrenSuperior);

    this.trenSuperior.userData = this;
    this.add(this.trenSuperior);
  }


  // ---------------------------------------------------------------------------
  // ---------------------  Espada y Escudo  ----------------------------------
  // ---------------------------------------------------------------------------

  // ---------------------  Espada ----------------------------------

  crearEspada(material){
    // Usamos la variable de clase para la geometría de la espada
    if (PeonModelo.geometriaEspada == null)
      PeonModelo.geometriaEspada = this.crearGeometriaEspada();

    // Creamos la espada
    var espada = new THREE.Mesh(PeonModelo.geometriaEspada, material);

    // Usamos la variable de clase para la geometría del mastil2
    if (PeonModelo.geometriaMastil2Espada == null)
      PeonModelo.geometriaMastil2Espada = this.crearGeometriaMastil2Espada();

    // Creamos el mastil2 (horizontal) 
    var mastil2Espada = new THREE.Mesh(PeonModelo.geometriaMastil2Espada, material);

    // Usamos la variable de clase para la geometría de la hoja
    if (PeonModelo.geometriaHojaEspada == null)
      PeonModelo.geometriaHojaEspada = this.crearGeometriaHojaEspada();

    // Creamos la hoja  
    var hojaEspada = new THREE.Mesh(PeonModelo.geometriaHojaEspada, material);  

    // Añadimos el mastil2 (el horizontal) y la hoja al mastil1 (el vertical, por donde se agarra)
    espada.add(mastil2Espada);
    espada.add(hojaEspada);

    // Rotamos la espada
    espada.rotation.x = Math.PI / 2;

    // Posicionamos la espada
    espada.position.set(0, -PeonModelo.hMano + 0.1, 0);
    
    espada.userData = this;
    return espada;
  }



  // ---------------------  Escudo ----------------------------------

  crearEscudo(material){
    // Usamos la variable de clase para la geometría del escudo
    if (PeonModelo.geometriaAsaEscudo == null)
      PeonModelo.geometriaAsaEscudo = this.crearGeometriaAsaEscudo();
      
    // Creamos el asa del escudo
    var asaEscudo = new CSG.Brush(PeonModelo.geometriaAsaEscudo, material);

    // Creamos un Evaluador que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    // Realizamos una operación booleana para quedarnos con medio asa
    var cajaAux = new THREE.BoxGeometry(2, 2, 1);
    cajaAux.translate(0, 0, 0.45);
    var cajaAux = new CSG.Brush(cajaAux, material);
    var asaFinalEscudo = evaluator.evaluate(asaEscudo, cajaAux, CSG.SUBTRACTION);

    asaFinalEscudo.userData = this;

    // Usamos la variable de clase para la geometría del escudo
    if (PeonModelo.geometriaEscudo == null)
      PeonModelo.geometriaEscudo = this.crearGeometriaEscudo();
      
    // Creamos el escudo
    var escudo = new THREE.Mesh(PeonModelo.geometriaEscudo, material);

    // Añadimos el asa al escudo
    escudo.add(asaFinalEscudo);

    // Rotamos el escudo
    escudo.rotation.x = Math.PI / 2;

    // Posicionamos el escudo
    escudo.position.set(0, -PeonModelo.hMano - 0.2, 0);

    escudo.userData = this;
    return escudo;
  }




  
  /*############################################################################*/
  // Animación

  inicializarAnimaciones()
  {
    this.dentro_animacion = false;
  }

  // ------------------------------------------------------------------------------------------------------
  // ----------------------  Animaciones del ataque  ------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------

  // ----- 1. Peón atacante: cuando levanta la espada (solo el brazo derecho) -----------------------------
  animacionAtacar1(){

    // Definimos la posición inicial y final de la animación
    var origen = { brazoInfDcho_rot_X: this.rot_X_brazoInfDcho, brazoInfDcho_rot_Y: this.rot_Y_brazoInfDcho, brazoInfDcho_rot_Z: this.rot_Z_brazoInfDcho,    // Brazo derecho Parte Inferior                    
                    brazoSupDcho_rot_X: this.rot_X_brazoSupDcho, brazoSupDcho_rot_Y: this.rot_Y_brazoSupDcho, brazoSupDcho_rot_Z: this.rot_Z_brazoSupDcho};  // Brazo derecho Parte Superior

    var destino = { brazoInfDcho_rot_X: 0, brazoInfDcho_rot_Y: -1, brazoInfDcho_rot_Z: 0,                    // Brazo derecho Parte Inferior
                    brazoSupDcho_rot_X: -Math.PI/4, brazoSupDcho_rot_Y: 0, brazoSupDcho_rot_Z: -Math.PI/4};  // Brazo derecho Parte Superior

    
    // Animacion
    var movimiento = new TWEEN.Tween(origen)
      .to(destino, 750)
      .easing(TWEEN.Easing.Quadratic.In) // Control de velocidad: acelerado
      .onStart(() => { this.dentro_animacion = true; })
      .onUpdate(() => { this.brazoInfDcho.rotation.set(origen.brazoInfDcho_rot_X, origen.brazoInfDcho_rot_Y, origen.brazoInfDcho_rot_Z),
                        this.brazoSupDcho.rotation.set(origen.brazoSupDcho_rot_X, origen.brazoSupDcho_rot_Y, origen.brazoSupDcho_rot_Z); })
      .onComplete(() => { this.animacionAtacar2(); })
      .repeat(0)
      .start();
  }



  // - 2. Peón atacante: cuando baja la espada y esta toca al otro peón (solo el brazo derecho) ------------
  animacionAtacar2(){

    // Definimos la posición inicial y final de la animación
    var origen = { brazoInfDcho_rot_X: this.brazoInfDcho.rotation.x, brazoInfDcho_rot_Y: this.brazoInfDcho.rotation.y, brazoInfDcho_rot_Z: this.brazoInfDcho.rotation.z,    // Brazo derecho Parte Inferior
                    brazoSupDcho_rot_X: this.brazoSupDcho.rotation.x, brazoSupDcho_rot_Y: this.brazoSupDcho.rotation.y, brazoSupDcho_rot_Z: this.brazoSupDcho.rotation.z};  // Brazo derecho Parte Superior
    
    var destino = { brazoInfDcho_rot_X: 0, brazoInfDcho_rot_Y: Math.PI/9, brazoInfDcho_rot_Z: 0,                    // Brazo derecho Parte Inferior
                    brazoSupDcho_rot_X: -Math.PI/7, brazoSupDcho_rot_Y: 0, brazoSupDcho_rot_Z: -Math.PI/10};        // Brazo derecho Parte Superior
    
    // Animacion
    var movimiento = new TWEEN.Tween(origen)
      .to(destino, 500)
      .easing(TWEEN.Easing.Quadratic.In)
      .onStart(() => { this.dentro_animacion = true; })
      .onUpdate(() => { this.brazoInfDcho.rotation.set(origen.brazoInfDcho_rot_X, origen.brazoInfDcho_rot_Y, origen.brazoInfDcho_rot_Z),
                        this.brazoSupDcho.rotation.set(origen.brazoSupDcho_rot_X, origen.brazoSupDcho_rot_Y, origen.brazoSupDcho_rot_Z); })
      .onComplete(() => { this.animacionAtacar3(); })
      .repeat(0)
      .start();
  }



  // - 3. Peón atacante: cuando ha atacado y ha terminado de cortar al otro peón (solo el brazo derecho) --
  animacionAtacar3(){

    // Definimos la posición inicial y final de la animación
    var origen = { brazoInfDcho_rot_X: this.brazoInfDcho.rotation.x, brazoInfDcho_rot_Y: this.brazoInfDcho.rotation.y, brazoInfDcho_rot_Z: this.brazoInfDcho.rotation.z,    // Brazo derecho Parte Inferior
                    brazoSupDcho_rot_X: this.brazoSupDcho.rotation.x, brazoSupDcho_rot_Y: this.brazoSupDcho.rotation.y, brazoSupDcho_rot_Z: this.brazoSupDcho.rotation.z};  // Brazo derecho Parte Superior

    var destino = { brazoInfDcho_rot_X: 0, brazoInfDcho_rot_Y: Math.PI/2, brazoInfDcho_rot_Z: 0,                    // Brazo derecho Parte Inferior
                    brazoSupDcho_rot_X: -Math.PI/4, brazoSupDcho_rot_Y: 0, brazoSupDcho_rot_Z: -Math.PI/8};  // Brazo derecho Parte Superior
    
    // Animacion
    var movimiento = new TWEEN.Tween(origen)
      .to(destino, 500)
      .easing(TWEEN.Easing.Bounce.Out) 
      .onStart(() => { this.dentro_animacion = true; })
      .onUpdate(() => { this.brazoInfDcho.rotation.set(origen.brazoInfDcho_rot_X, origen.brazoInfDcho_rot_Y, origen.brazoInfDcho_rot_Z),
                        this.brazoSupDcho.rotation.set(origen.brazoSupDcho_rot_X, origen.brazoSupDcho_rot_Y, origen.brazoSupDcho_rot_Z); })
      .onComplete(() => { this.animacionAtacar4(); })
      .repeat(0)
      .start();
  }



  // ------ 4. Peón atacante: regresa a la posición inicial (solo el brazo derecho) ---------------------
  animacionAtacar4(){

    // Definimos la posición inicial y final de la animación
    var origen = { brazoInfDcho_rot_X: this.brazoInfDcho.rotation.x, brazoInfDcho_rot_Y: this.brazoInfDcho.rotation.y, brazoInfDcho_rot_Z: this.brazoInfDcho.rotation.z,    // Brazo derecho Parte Inferior
                    brazoSupDcho_rot_X: this.brazoSupDcho.rotation.x, brazoSupDcho_rot_Y: this.brazoSupDcho.rotation.y, brazoSupDcho_rot_Z: this.brazoSupDcho.rotation.z};  // Brazo derecho Parte Superior                

    var destino = { brazoInfDcho_rot_X: this.rot_X_brazoInfDcho, brazoInfDcho_rot_Y: this.rot_Y_brazoInfDcho, brazoInfDcho_rot_Z: this.rot_Z_brazoInfDcho,    // Brazo derecho Parte Inferior                    
                    brazoSupDcho_rot_X: this.rot_X_brazoSupDcho, brazoSupDcho_rot_Y: this.rot_Y_brazoSupDcho, brazoSupDcho_rot_Z: this.rot_Z_brazoSupDcho};  // Brazo derecho Parte Superior
   
    // Animacion
    var movimiento = new TWEEN.Tween(origen)
      .to(destino, 1000)
      .easing(TWEEN.Easing.Quadratic.In) 
      .onStart(() => { this.dentro_animacion = true; })
      .onUpdate(() => { this.brazoInfDcho.rotation.set(origen.brazoInfDcho_rot_X, origen.brazoInfDcho_rot_Y, origen.brazoInfDcho_rot_Z),
                        this.brazoSupDcho.rotation.set(origen.brazoSupDcho_rot_X, origen.brazoSupDcho_rot_Y, origen.brazoSupDcho_rot_Z); })
      .onComplete(() => { this.dentro_animacion = false; })
      .repeat(0)
      .start();
  }



  // ----------------------------------------------------------------------------------------------------
  // ----------------------  Animaciones de la defensa  -------------------------------------------------
  // ----------------------------------------------------------------------------------------------------

  // ------ 1. Peón atacado: mueve el escudo para defenderse (brazo izquierdo) --------------------------
  animacionDefender1(){

    // Definimos la posición inicial y final de la animación
    var origen = { brazoInfIzq_rot_X: this.rot_X_brazoInfIzq, brazoInfIzq_rot_Y: this.rot_Y_brazoInfIzq, brazoInfIzq_rot_Z: this.rot_Z_brazoInfIzq,    // Brazo izquierdo Parte Inferior
                    brazoSupIzq_rot_X: this.rot_X_brazoSupIzq, brazoSupIzq_rot_Y: this.rot_Y_brazoSupIzq, brazoSupIzq_rot_Z: this.rot_Z_brazoSupIzq};  // Brazo izquierdo Parte Superior
    
    var destino = { brazoInfIzq_rot_X: -Math.PI/1.5, brazoInfIzq_rot_Y: 0, brazoInfIzq_rot_Z:0,            // Brazo izquierdo Parte Inferior
                        brazoSupIzq_rot_X: Math.PI/10, brazoSupIzq_rot_Y: 0, brazoSupIzq_rot_Z: Math.PI/6};      // Brazo izquierdo Parte Superior
    
        
    // Animacion
    var movimiento = new TWEEN.Tween(origen)
      .to(destino, 2000)
      .easing(TWEEN.Easing.Linear.None) // Control de velocidad: acelerado
      .onStart(() => { this.dentro_animacion = true; })
      .onUpdate(() => { this.brazoInfIzq.rotation.set(origen.brazoInfIzq_rot_X, origen.brazoInfIzq_rot_Y, origen.brazoInfIzq_rot_Z),
                        this.brazoSupIzq.rotation.set(origen.brazoSupIzq_rot_X, origen.brazoSupIzq_rot_Y, origen.brazoSupIzq_rot_Z); })        
      .onComplete(() => { this.animacionDefender2(); })
      .repeat(0)
      .start();
  }



  // ----- 2. Peón atacado: se parte por la mitad, cayendo el tren superior hacia atrás ----------------
  animacionDefender2(){
    // Definimos la posición inicial y final de la animación
    var origen = { pos_X: 0, pos_Y: PeonModelo.hTrenInferior, pos_Z: 0,
                   rot_X: 0, rot_Y: 0, rot_Z: 0};

    var destino = { pos_X: 0, pos_Y: 0.5, pos_Z: -2,
                    rot_X: -1.5, rot_Y: 0, rot_Z: 0};

    // Animacion
    var movimiento = new TWEEN.Tween(origen)
    .to(destino, 2000)
    .easing(TWEEN.Easing.Bounce.Out) // Control de velocidad: acelerado
    .onStart(() => { this.dentro_animacion = true; })
    .onUpdate(() => { this.trenSuperior.position.set(origen.pos_X, origen.pos_Y, origen.pos_Z),
                      this.trenSuperior.rotation.set(origen.rot_X, origen.rot_Y, origen.rot_Z); })
    .onComplete(() => { this.animacionDefender3(); })
    .repeat(0)
    .start();
  }



  // ---- 3. Peón atacado: se mantiene medio segundo en la posición anterior antes de desaparecer del juego. 
  animacionDefender3(){
    // Definimos la posición inicial y final de la animación
    var origen = { pos_X: 0, pos_Y: 0.5, pos_Z: -2,
                  rot_X: -1.5, rot_Y: 0, rot_Z: 0};

    var destino = { pos_X: 0, pos_Y: 0.5, pos_Z: -2,
                    rot_X: -1.5, rot_Y: 0, rot_Z: 0};

    // Animacion
    var movimiento = new TWEEN.Tween(origen)
    .to(destino, 500)
    .easing(TWEEN.Easing.Quadratic.In) // Control de velocidad: acelerado
    .onStart(() => { this.dentro_animacion = true; })
    .onUpdate(() => { this.trenSuperior.position.set(origen.pos_X, origen.pos_Y, origen.pos_Z),
                      this.trenSuperior.rotation.set(origen.rot_X, origen.rot_Y, origen.rot_Z); })
    .onComplete(() => { this.dentro_animacion = false; })
    .repeat(0)
    .start();
  }



  animarAtaca()
  {
    this.animacionAtacar1();
  }



  animarDefiende()
  {
    this.animacionDefender1();
  }


  /*############################################################################*/
  // Método update del objeto

  actualizar()
  {
    super.actualizar(this.dentro_animacion);
  }

}
