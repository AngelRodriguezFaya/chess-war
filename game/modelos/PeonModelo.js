/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'

import { TipoPieza } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'



/*############################################################################*/
// Clase Peon

export class PeonModelo extends THREE.Object3D // PiezaBaseModelo
{
  /*############################################################################*/
  // Variables de clase
  // Geometrías ------------------------------------------
  static resolucion = 20; // Resolución de las geometrías
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

  constructor(material) // , posicion_en_tablero, tipo_jugador)
  {
    // Llamamos al constructor padre
    //super(posicion_en_tablero, TipoPieza.PEON, tipo_jugador);
    super();

    // Creación del modelo
    this.crearModelo(material);
  }

  /*############################################################################*/
  // Creación del modelo

  crearModelo(material){
    const RES = 20; // Constante para la resolución de las geometrías
    // this.material = material; // El material se pasa como parámetro al constructor
    // var material = new THREE.MeshNormalMaterial({ flatShading : true });
    // Se construye un Evaluator que utilizaremos para las operaciones booleanas

    // Pierna izquierda
    // this.crearPiernaIzquierda(material, RES, ROTACION_PIERNAS);

    // // Pierna derecha
    // this.crearPiernaDerecha(material, RES, ROTACION_PIERNAS);

    // // // Tronco y cadera
    // this.crearCaderaTronco(material);

    // // // Cuello 
    // // this.crearCuello(material, RES);

    // // // Cabeza
    // // this.crearCabeza(material, RES);

    // // // Brazo izquierdo con espada
    // // this.crearBrazoIzquierdoEspada(material, RES);

    // // // Brazo derecho con escudo
    // // this.crearBrazoDerechoEscudo(material, RES);

    // this.crearPiernaIzquierda(material);
    // // // this.crearEspinillaIzquierda(material, RES);
    // // this.crearPiernaDerecha(material, RES);
    // // this.crearPieIzquierdo(material);
    this.crearTrenInferior(material);
    this.crearTrenSuperior(material);

    
    this.rot_Z_ParteInfBrazoIzq = 0;
    this.rot_X_ParteInfBrazoIzq = 0;
    this.rot_Z_BrazoIzq = 0;
    this.rot_X_BrazoIzq = 0;
    this.rot_Z_ParteInfBrazoDcho = 0;
    this.rot_X_ParteInfBrazoDcho = 0;
    this.rot_X_TrenSuperior = 0; 


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
      PeonModelo.hEspinilla, PeonModelo.resolucion);

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


  /*############################################################################*/
  // Métodos para crear las partes del modelo
  
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
  
  crearCadera(material){
    // Usamos la variable de clase para la geometría del cadera
    if (PeonModelo.geometriaCadera == null)
      PeonModelo.geometriaCadera = this.crearGeometriaCadera();
    
    // Creamos la cadera
    var cadera = new THREE.Mesh(PeonModelo.geometriaCadera, material);

    cadera.userData = this;
    return cadera;
  }

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


  crearTorso(material){
    // Usamos la variable de clase para la geometría del torso
    if (PeonModelo.geometriaTorso == null)
      PeonModelo.geometriaTorso = this.crearGeometriaTorso();
    
    // Creamos el torso
    var torso = new THREE.Mesh(PeonModelo.geometriaTorso, material);

    torso.userData = this;
    return torso;
  } 


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

  crearFormaCabeza(material){
    // Usamos la variable de clase para la geometría de la forma de lacabeza
    if (PeonModelo.geometriaFormaCabeza == null)
      PeonModelo.geometriaFormaCabeza = this.crearGeometriaFormaCabeza();

    // Creamos la forma de la cabeza
    var formaCabeza = new CSG.Brush(PeonModelo.geometriaFormaCabeza, material);
  
    formaCabeza.userData = this;
    return formaCabeza;
  }

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

  crearFiloCasco(material, RES){
    // Usamos la variable de clase para la geometría del filo del casco
    if (PeonModelo.geometriaFiloCasco == null)
      PeonModelo.geometriaFiloCasco = this.crearGeometriaFiloCasco();

    // Creamos el filo del casco
    var filoCasco = new THREE.Mesh(PeonModelo.geometriaFiloCasco, material);

    filoCasco.userData = this;
    return filoCasco;
  }

  crearDefensaMandibula(material, RES){
    var evaluator = new CSG.Evaluator();
    
    // Definimos las geometrías para la defensa de la mandíbula
    var mandibGeom = new THREE.CylinderGeometry(0.9, 0.9, 1, RES, RES, false);
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
    var cilindro1 = new THREE.CylinderGeometry(0.2, 0.2, 0.1, RES);
    var cilindro2 = new THREE.CylinderGeometry(0.2, 0.2, 0.1, RES); 

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

  // crearManoIzquierda(material){
  //   // Será una caja a la que simulará la forma de la mano, que estará cerrada
  //   // sujetando una espada. La forma de los dedos y el interior de la mano se
  //   // realizará con operaciones booleanas

  //   // Definimos la geometría de la mano izquierda
  //   var manoIzqGeom = new THREE.BoxGeometry(PeonModelo.wMano, PeonModelo.hMano, PeonModelo.dMano);

  //   // Posicionamos la geometría
  //   manoIzqGeom.translate(-3.55, 8.9, 2.85);
    
  //   // Creamos la mano izquierda
  //   var manoIzq = new CSG.Brush(manoIzqGeom, material);

  //   // Creamos un Evaluador que utilizaremos para las operaciones booleanas
  //   var evaluator = new CSG.Evaluator();    

  //   // Definimos la geometría de 5 dedos
  //   var dedos1IzqGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
  //   var dedos2IzqGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
  //   var dedos3IzqGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
  //   var dedos4IzqGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
  //   var dedos5IzqGeom = new THREE.BoxGeometry(0.4, 0.1, 0.03);

  //   // La posicionamos y orientamos
  //   dedos1IzqGeom.translate(-3.3, 9.05, 2.95);
  //   dedos2IzqGeom.translate(-3.3, 8.95, 2.95);
  //   dedos3IzqGeom.translate(-3.3, 8.85, 2.95);
  //   dedos4IzqGeom.translate(-3.3, 8.75, 2.95);
  //   dedos5IzqGeom.translate(-3.3, 9.1, 2.90);

  //   // Creamos los dedos
  //   var dedos1Izq = new CSG.Brush(dedos1IzqGeom, material);
  //   var dedos2Izq = new CSG.Brush(dedos2IzqGeom, material);
  //   var dedos3Izq = new CSG.Brush(dedos3IzqGeom, material);
  //   var dedos4Izq = new CSG.Brush(dedos4IzqGeom, material);
  //   var dedos5Izq = new CSG.Brush(dedos5IzqGeom, material);

  //   // Realizamos las operaciones booleanas
  //   var result1ManoIzq = evaluator.evaluate(manoIzq, dedos1Izq, CSG.SUBTRACTION);
  //   var result2ManoIzq = evaluator.evaluate(result1ManoIzq, dedos2Izq, CSG.SUBTRACTION);
  //   var result3ManoIzq = evaluator.evaluate(result2ManoIzq, dedos3Izq, CSG.SUBTRACTION);
  //   var result4ManoIzq = evaluator.evaluate(result3ManoIzq, dedos4Izq, CSG.SUBTRACTION);
  //   var result5ManoIzq = evaluator.evaluate(result4ManoIzq, dedos5Izq, CSG.SUBTRACTION);
    
  //   // Definimos la geometría del hueco de la mano
  //   var hueco1ManoIzqGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, PeonModelo.RES);
  //   var hueco2ManoIzqGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, PeonModelo.ES);
    
  //   // Posicionamos las geometrías
  //   hueco1ManoIzqGeom.translate(-3.39, 8.7, 2.77);
  //   hueco2ManoIzqGeom.translate(-3.52, 8.9, 2.85);
    
  //   // Creamos el hueco de la mano
  //   var huecoManoIzq = new CSG.Brush(hueco1ManoIzqGeom, material);
  //   var hueco2ManoIzq = new CSG.Brush(hueco2ManoIzqGeom, material);

  //   // Realizamos las operaciones booleanas
  //   var result6ManoIzq = evaluator.evaluate(result5ManoIzq, huecoManoIzq, CSG.SUBTRACTION);
  //   var resultFinalManoIzq = evaluator.evaluate(result6ManoIzq, hueco2ManoIzq, CSG.SUBTRACTION);
    
  //   // Posicionamos y orientamos la mano final
  //   // resultFinalManoIzq.rotateX(Math.PI / 2);

  //   // Añadimos la mano Final al peón
  //   resultFinalManoIzq.userData = this;
  //   this.add(resultFinalManoIzq);
  // }

  crearManoIzquierda(material){
    // Definimos la geometría de la mano izquierda
    var manoIzqGeom = new THREE.BoxGeometry(PeonModelo.wMano, PeonModelo.hMano, PeonModelo.dMano);

    // Posicionamos la geometría
    manoIzqGeom.translate(0, -PeonModelo.hMano/2, 0);
    
    // Creamos la mano izquierda
    var manoIzq = new CSG.Brush(manoIzqGeom, material);

    // Añadimos el escudo a la mano izquierda
    manoIzq.add(this.crearEscudo(material));

    // Posicionamos la mano
    manoIzq.position.y = -PeonModelo.hInfBrazo;

    manoIzq.userData = this;
    return manoIzq;
  }

  crearParteInfBrazoIzquierdo(material, RES){
    // Definimos la geometría de la parte inferior del brazo
    var brazoInfIzqGeom = new THREE.CylinderGeometry(PeonModelo.rSInfBrazo, PeonModelo.rIInfBrazo,
      PeonModelo.hInfBrazo, RES);

    // Posicionamos la geometría
    brazoInfIzqGeom.translate(0, -PeonModelo.hInfBrazo/2, 0);
    
    // Creamos la parte inferior del brazo
    var brazoInfIzq = new THREE.Mesh(brazoInfIzqGeom, material);

    // Añadimos la mano izquierda al brazo
    brazoInfIzq.add(this.crearManoIzquierda(material));

    // Aplicamos las rotaciones necesarias
    // brazoInfIzq.rotation.z = this.rot_Z_ParteInfBrazoIzq;
    // brazoInfIzq.rotation.x = this.rot_X_ParteInfBrazoIzq;

    // Posicionamos el antebrazo y la mano
    brazoInfIzq.position.y = - PeonModelo.rCodo;

    // Añadimos la parte inferior del brazo al peón
    brazoInfIzq.userData = this;
    return brazoInfIzq;
  }

  crearCodoIzquierdo(material, RES){
      // Definimos la geometría del codo
      var codoIzqGeom = new THREE.SphereGeometry(0.42, RES, RES);
  
      // Posicionamos la geometría
      codoIzqGeom.translate(0, -PeonModelo.rCodo, 0);
  
      // Creamos el codo
      var codoIzq = new THREE.Mesh(codoIzqGeom, material);

      // Añadimos la parte inferior del brazo izquierdo al codo
      codoIzq.add(this.crearParteInfBrazoIzquierdo(material, RES));

      // Posicionamos 
      codoIzq.position.y = -PeonModelo.hSupBrazo + 0.3;
  
      // Añadimos el codo al peón
      codoIzq.userData = this;
      return codoIzq;
    }

    crearParteSupBrazoIzquierdo(material){
      // Definimos la geometría de la parte superior del brazo
      var brazoSupIzqGeom = new THREE.CylinderGeometry(PeonModelo.rSSupBrazo, PeonModelo.rISupBrazo,
        PeonModelo.hSupBrazo, PeonModelo.RES);

      // Posicionamos y orientamos la geometría
      // brazoSupIzqGeom.rotateZ(-Math.PI/5);
      brazoSupIzqGeom.translate(0, -PeonModelo.hSupBrazo/2, 0);

      // Creamos la parte superior del brazo
      var brazoSupIzq = new THREE.Mesh(brazoSupIzqGeom, material);

      // Añadimos el codo izquierdo al brazo
      brazoSupIzq.add(this.crearCodoIzquierdo(material));

      // Aplicamos las rotaciones necesarias
      // brazoSupIzq.rotation.z = this.rot_Z_BrazoIzq;
      // brazoSupIzq.rotation.x = this.rot_X_BrazoIzq;

      // Posicionamos
      brazoSupIzq.position.y = - PeonModelo.hProtecHombro + 0.1;

      brazoSupIzq.userData = this;
      return brazoSupIzq;
  }

  crearProteccionHombroIzquierdo(material){
    // Definimos la geometría de la protección del hombro
    var prtHombroIzqGeom = new THREE.CylinderGeometry(PeonModelo.rSHombro, PeonModelo.rIHombro,
      PeonModelo.hHombro, PeonModelo.RES);
    
    // Posicionamos y orientamos la geometría
    prtHombroIzqGeom.rotateZ(Math.PI/4);
    prtHombroIzqGeom.translate(0, - PeonModelo.hProtecHombro/2 - 0.2, 0);
    
    // Creamos la protección del hombro
    var prtHombroIzq = new THREE.Mesh(prtHombroIzqGeom, material);
    
    prtHombroIzq.userData = this;
    return prtHombroIzq;
  }

  crearBrazoIzquierdo(material){
    // Creamos el brazo izquierdo
    var brazoIzq = new THREE.Object3D();

    // Añadimos la parte superior del brazo izquierdo ( y el codo y la parte inferior y la mano izquierda)
    brazoIzq.add(this.crearParteSupBrazoIzquierdo(material));

    // Añadimos la protección del hombro izquierdo
    brazoIzq.add(this.crearProteccionHombroIzquierdo(material));

    // Posicionamos el brazo
    brazoIzq.position.set(PeonModelo.wTorso, PeonModelo.hTorso, 0);

    brazoIzq.userData = this;
    return brazoIzq;
  }

  crearManoDerecha(material){
    // Definimos la geometría de la mano derecha
    var manoDchaGeom = new THREE.BoxGeometry(PeonModelo.wMano, PeonModelo.hMano, PeonModelo.dMano);
  
    // Posicionamos la geometría
    manoDchaGeom.translate(0, -PeonModelo.hMano/2, 0);

    // Creamos la mano derecha
    var manoDcha = new CSG.Brush(manoDchaGeom, material);

    // Añadimos la espada
    manoDcha.add(this.crearEspada(material));

    // Posicionamos la mano
    manoDcha.position.y = -PeonModelo.hInfBrazo;
    manoDcha.userData = this;
    return manoDcha;
  }

  crearParteInfBrazoDerecho(material, RES){
    // Definimos la geometría de la parte inferior del brazo
    var brazoInfDchoGeom = new THREE.CylinderGeometry(PeonModelo.rSInfBrazo, PeonModelo.rIInfBrazo,
      PeonModelo.hInfBrazo, RES);
    // Posicionamos la geometría
    brazoInfDchoGeom.translate(0, -PeonModelo.hInfBrazo/2, 0);
    // Creamos la parte inferior del brazo
    var brazoInfDcho = new THREE.Mesh(brazoInfDchoGeom, material);
    // Añadimos la mano derecha al brazo
    brazoInfDcho.add(this.crearManoDerecha(material));
    // Aplicamos las rotaciones necesarias
    // brazoInfDcho.rotation.z = this.rot_Z_ParteInfBrazoDcho;
    // brazoInfDcho.rotation.x = this.rot_X_ParteInfBrazoDcho;
    // Posicionamos el antebrazo y la mano
    brazoInfDcho.position.y = - PeonModelo.rCodo;
    // Añadimos la parte inferior del brazo al peón
    brazoInfDcho.userData = this;
    return brazoInfDcho;
  }

  crearCodoDerecho(material, RES){
    // Definimos la geometría del codo
    var codoDchoGeom = new THREE.SphereGeometry(0.42, RES, RES);

    // Posicionamos la geometría
    codoDchoGeom.translate(0, -PeonModelo.rCodo, 0);

    // Creamos el codo
    var codoDcho = new THREE.Mesh(codoDchoGeom, material);

    // Añadimos la parte inferior del brazo derecho al codo
    codoDcho.add(this.crearParteInfBrazoDerecho(material, RES));

    // Posicionamos 
    codoDcho.position.y = -PeonModelo.hSupBrazo + 0.3;

    // Añadimos el codo al peón
    codoDcho.userData = this;
    return codoDcho;
  }

  crearParteSupBrazoDerecho(material){
    // Definimos la geometría de la parte superior del brazo
    var brazoSupDchoGeom = new THREE.CylinderGeometry(PeonModelo.rSSupBrazo, PeonModelo.rISupBrazo,
      PeonModelo.hSupBrazo, PeonModelo.RES);

    // Posicionamos y orientamos la geometría
    // brazoSupDchoGeom.rotateZ(Math.PI/5);
    brazoSupDchoGeom.translate(0, -PeonModelo.hSupBrazo/2, 0);

    // Creamos la parte superior del brazo
    var brazoSupDcho = new THREE.Mesh(brazoSupDchoGeom, material);

    // Añadimos el codo derecho al brazo
    brazoSupDcho.add(this.crearCodoDerecho(material));

    // Aplicamos las rotaciones necesarias
    // brazoSupDcho.rotation.z = this.rot_Z_BrazoDcho;
    // brazoSupDcho.rotation.x = this.rot_X_BrazoDcho;

    // Posicionamos
    brazoSupDcho.position.y = - PeonModelo.hProtecHombro + 0.1;

    // Añadimos la parte superior del brazo al peón
    brazoSupDcho.userData = this;
    return brazoSupDcho;
  }

  crearProteccionHombroDerecho(material, RES){
    // Definimos la geometría de la protección del hombro
    var prtHombroDchoGeom = new THREE.CylinderGeometry(PeonModelo.rSHombro, PeonModelo.rIHombro,
      PeonModelo.hHombro, PeonModelo.RES);
    // Posicionamos y orientamos la geometría
    prtHombroDchoGeom.rotateZ(-Math.PI/4);
    prtHombroDchoGeom.translate(0, - PeonModelo.hProtecHombro/2 - 0.2, 0);
    // Creamos la protección del hombro
    var prtHombroDcho = new THREE.Mesh(prtHombroDchoGeom, material);
    // Añadimos la parte superior del brazo derecho a la protección del hombro
    prtHombroDcho.add(this.crearParteSupBrazoDerecho(material));
    // Añadimos la protección del hombro al peón
    prtHombroDcho.userData = this;
    return prtHombroDcho;
  }

  crearBrazoDerecho(material){
    // Creamos el brazo derecho
    var brazoDcho = new THREE.Object3D();
    
    // Añadimos la parte superior del brazo derecho ( y el codo y la parte inferior y la mano derecha)
    brazoDcho.add(this.crearParteSupBrazoDerecho(material));
    
    // Añadimos la protección del hombro derecho
    brazoDcho.add(this.crearProteccionHombroDerecho(material, PeonModelo.RES));
    
    // Posicionamos el brazo
    brazoDcho.position.set(-PeonModelo.wTorso, PeonModelo.hTorso, 0);
    brazoDcho.userData = this;
    return brazoDcho;
  }

  crearTrenSuperior(material){
    var trenSuperior = new THREE.Object3D();

    // Añadimos el torso
    trenSuperior.add(this.crearTorso(material));

    // Añadimos el cuello
    trenSuperior.add(this.crearCuello(material));

    // Añadimos la cabeza
    trenSuperior.add(this.crearCabeza(material));

    // Añadimos el brazo izquierdo
    trenSuperior.add(this.crearBrazoIzquierdo(material));

    // Añadimos el brazo derecho
    trenSuperior.add(this.crearBrazoDerecho(material));

    // Añadimos las rotaciones necesarias
    // trenSuperior.rotation.x = this.rot_X_TrenSuperior;

    // Posicionamos el tren superior
    trenSuperior.position.y = PeonModelo.hTrenInferior;

    trenSuperior.userData = this;
    this.add(trenSuperior);
  }


  // crearProteccionHombroDerecho(material, RES){
  //   // Definimos la geometría de la protección del hombro
  //   var prtHombroDchoGeom = new THREE.CylinderGeometry(0.9, 1, 1.2, RES);

  //   // La posicionamos y orientamos
  //   prtHombroDchoGeom.rotateZ(Math.PI/4);
  //   prtHombroDchoGeom.translate(1.5, 11.21, 0);

  //   // Creamos la protección del hombro
  //   var prtHombroDcho = new THREE.Mesh(prtHombroDchoGeom, material);

  //   // Añadimos la protección del hombro al peón
  //   prtHombroDcho.userData = this;
  //   this.add(prtHombroDcho);
  // }

  // crearParteSupBrazoIzquierdo(material, RES){
  //   // Definimos la geometría de la parte superior del brazo
  //   var brazoSupIzqGeom = new THREE.CylinderGeometry(0.5, 0.4, 2.7, RES);

  //   // Posicionamos y orientamos la geometría
  //   brazoSupIzqGeom.rotateZ(-Math.PI/5);
  //   brazoSupIzqGeom.translate(-2.7, 10.1, 0);

  //   // Creamos la parte superior del brazo
  //   var brazoSupIzq = new THREE.Mesh(brazoSupIzqGeom, material);

  //   // Añadimos la parte superior del brazo al peón
  //   brazoSupIzq.userData = this;
  //   this.add(brazoSupIzq);
  // }

  // crearParteSupBrazoDerecho(material, RES){
  //   // Definimos la geometría de la parte superior del brazo
  //   var brazoSupGeom = new THREE.CylinderGeometry(0.5, 0.4, 2.7, RES);

  //   // Posicionamos y orientamos la geometría
  //   brazoSupGeom.rotateZ(Math.PI/5); 
  //   brazoSupGeom.translate(2.7, 10.1, 0);

  //   // Creamos la parte superior del brazo
  //   var brazoSupDcho = new THREE.Mesh(brazoSupGeom, material);

  //   // Añadimos la parte superior del brazo al peón
  //   brazoSupDcho.userData = this;
  //   this.add(brazoSupDcho);
  // }

  // crearCodoIzquierdo(material, RES){
  //   // Definimos la geometría del codo
  //   var codoIzqGeom = new THREE.SphereGeometry(0.42, RES, RES);

  //   // Posicionamos la geometría
  //   codoIzqGeom.translate(-3.55, 8.94, 0);

  //   // Creamos el codo
  //   var codoIzq = new THREE.Mesh(codoIzqGeom, material);

  //   // Añadimos el codo al peón
  //   codoIzq.userData = this;
  //   this.add(codoIzq);
  // }

  // crearCodoDerecho(material, RES){
  //   // Definimos la geometría del codo
  //   var codoDchoGeom = new THREE.SphereGeometry(0.42, RES, RES);

  //   // Posicionamos la geometría
  //   codoDchoGeom.translate(3.55, 8.94, 0);

  //   // Creamos el codo
  //   var codoDcho = new THREE.Mesh(codoDchoGeom, material);

  //   // Añadimos el codo al peón
  //   codoDcho.userData = this;
  //   this.add(codoDcho);
  // }

  // crearParteInfBrazoIzquierdo(material, RES){
  //   // Definimos la geometría de la parte inferior del brazo
  //   var brazoInfIzqGeom = new THREE.CylinderGeometry(0.4, 0.2, 2.5, RES);

  //   // Posicionamos y orientamos la geometría
  //   brazoInfIzqGeom.rotateX(-Math.PI/2);
  //   brazoInfIzqGeom.translate(-3.55, 8.9, 1.4);
    
  //   // Creamos la parte inferior del brazo
  //   var brazoInfIzq = new THREE.Mesh(brazoInfIzqGeom, material);
  //   //brazoIzqInf.add(mano)
  //   // Añadimos la parte inferior del brazo al peón
  //   brazoInfIzq.userData = this;
  //   this.add(brazoInfIzq);
  // }

  // crearParteInfBrazoDerecho(material, RES){
  //   // Definimos la geometría de la parte inferior del brazo
  //   var brazoInfDchoGeom = new THREE.CylinderGeometry(0.4, 0.2, 2.5, RES);

  //   // Posicionamos y orientamos la geometría
  //   brazoInfDchoGeom.rotateX(-Math.PI/2);
  //   brazoInfDchoGeom.translate(3.55, 8.9, 1.4);
    
  //   // Creamos la parte inferior del brazo
  //   var brazoInf = new THREE.Mesh(brazoInfDchoGeom, material);

  //   // Añadimos la parte inferior del brazo al peón
  //   brazoInf.userData = this;
  //   this.add(brazoInf);
  // }



  // crearManoDerecha(material, RES){
  //   // Definimos la geometría de la mano derecha
  //   var manoDchaGeom = new THREE.BoxGeometry(0.5, 0.5, 0.4);
    
  //   // Posicionamos la geometría
  //   manoDchaGeom.translate(3.55, 8.9, 2.85);

  //   // Creamos la mano derecha
  //   var manoDcha = new CSG.Brush(manoDchaGeom, material);

  //   // Creamos un Evaluador que utilizaremos para las operaciones booleanas
  //   var evaluator = new CSG.Evaluator();

  //   // Definimos la geometría de 5 dedos
  //   var dedos1DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
  //   var dedos2DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
  //   var dedos3DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
  //   var dedos4DchaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
  //   var dedos5DchaGeom = new THREE.BoxGeometry(0.4, 0.1, 0.03);

  //   // Posicionamos las geometrías
  //   dedos1DchaGeom.translate(3.3, 9.05, 2.95);
  //   dedos2DchaGeom.translate(3.3, 8.95, 2.95);
  //   dedos3DchaGeom.translate(3.3, 8.85, 2.95);
  //   dedos4DchaGeom.translate(3.3, 8.75, 2.95);    
  //   dedos5DchaGeom.translate(3.3, 9.1, 2.90);

  //   // Creamos los dedos
  //   var dedos1Dcha = new CSG.Brush(dedos1DchaGeom, material);
  //   var dedos2Dcha = new CSG.Brush(dedos2DchaGeom, material);
  //   var dedos3Dcha = new CSG.Brush(dedos3DchaGeom, material);
  //   var dedos4Dcha = new CSG.Brush(dedos4DchaGeom, material);
  //   var dedos5Dcha = new CSG.Brush(dedos5DchaGeom, material);


  //   // Realizamos las operaciones booleanas
  //   var result1ManoDcha = evaluator.evaluate(manoDcha, dedos1Dcha, CSG.SUBTRACTION);
  //   var result2ManoDcha = evaluator.evaluate(result1ManoDcha, dedos2Dcha, CSG.SUBTRACTION);
  //   var result3ManoDcha = evaluator.evaluate(result2ManoDcha, dedos3Dcha, CSG.SUBTRACTION);
  //   var result4ManoDcha = evaluator.evaluate(result3ManoDcha, dedos4Dcha, CSG.SUBTRACTION);
  //   var result5ManoDcha = evaluator.evaluate(result4ManoDcha, dedos5Dcha, CSG.SUBTRACTION);

  //   // Definimos la geometría del hueco de la mano
  //   var hueco1ManoDchaGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, RES);
  //   var hueco2ManoDchaGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, RES);

  //   // Posicionamos las geometrías
  //   hueco1ManoDchaGeom.translate(3.39, 8.7, 2.77);
  //   hueco2ManoDchaGeom.translate(3.52, 8.9, 2.85);

  //   // Creamos el hueco de la mano
  //   var huecoManoDcha = new CSG.Brush(hueco1ManoDchaGeom, material);
  //   var hueco2ManoDcha = new CSG.Brush(hueco2ManoDchaGeom, material);

  //   // Realizamos las operacines booleanas
  //   var result6ManoDcha = evaluator.evaluate(result5ManoDcha, huecoManoDcha, CSG.SUBTRACTION);
  //   var resultFinalManoDcha = evaluator.evaluate(result6ManoDcha, hueco2ManoDcha, CSG.SUBTRACTION);

  //   // Añadimos la mano Final al peón
  //   resultFinalManoDcha.userData = this;
  //   this.add(resultFinalManoDcha);
  // }

  // crearProtectorMunecaIzquierda(material, RES){
  //   // Definimos la geometría para el protector de la muneca
  //   var prtMunecaIzqGeom = new THREE.CylinderGeometry(0.45, 0.25, 0.8, RES);

  //   // Posicionamos y orientamos la geometría
  //   prtMunecaIzqGeom.rotateX(-Math.PI/2);
  //   prtMunecaIzqGeom.translate(-3.55, 8.9, 2.25);

  //   // Creamos el protector de la muñeca
  //   var prtMunecaIzq = new THREE.Mesh(prtMunecaIzqGeom, material);
    
  //   // Añadimos el protector de la muñeca al peón
  //   prtMunecaIzq.userData = this;
  //   this.add(prtMunecaIzq);
  // }

  // crearProtectorMunecaDerecha(material, RES){
  //   // Definimos la geometría para el protector de la muneca
  //   var prtMunecaDchaGeom = new THREE.CylinderGeometry(0.45, 0.25, 0.8, RES);

  //   // Oiscionamos y orientamos la geometría
  //   prtMunecaDchaGeom.rotateX(-Math.PI/2);
  //   prtMunecaDchaGeom.translate(3.55, 8.9, 2.25);

  //   // Creamos el protector de la muñeca
  //   var prtMunecaDcha = new THREE.Mesh(prtMunecaDchaGeom, material);

  //   // Añadimos el protector de la muñeca al peón
  //   prtMunecaDcha.userData = this;
  //   this.add(prtMunecaDcha);
  // }

  crearEspada(material, RES){
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
    
        // Posicionamos y orientamos las geometrías
        mastil1EspadaGeom.translate(0, 0, 0);
        mastil2EspadaGeom.rotateZ(Math.PI / 2);
        mastil2EspadaGeom.translate(0, 0.5, 0);
        hojaEspadaGeom.translate(0, 0.5, 0);
    
        // Creamos la espada
        var mastil1Espada = new THREE.Mesh(mastil1EspadaGeom, material);
        var mastil2Espada = new THREE.Mesh(mastil2EspadaGeom, material);
        var hojaEspada = new THREE.Mesh(hojaEspadaGeom, material);
    
        // Añadimos la espada al peón
        // Añadimos el mastil2 (el horizontal) y la hoja al mastil1 (el vertical, por donde se agarra)
        mastil1Espada.userData = this;
        mastil2Espada.userData = this;
        hojaEspada.userData = this;

        mastil1Espada.add(mastil2Espada);
        mastil1Espada.add(hojaEspada);

        // Rotamos la espada
        // mastil1Espada.rotation.y = Math.PI / 2;
        mastil1Espada.rotation.x = Math.PI / 2;
        
        return mastil1Espada;
  }

  crearEscudo(material){
    // Definimos la geometría del asa del escudo
    var asaEscudoGeom = new THREE.TorusGeometry(0.5, 0.1, PeonModelo.RES);

    // Posicionamos y orientamos la geometría
    asaEscudoGeom.rotateY(Math.PI / 2);
    asaEscudoGeom.translate(0, 0, 0);

    // Creamos el asa del escudo
    var asaEscudo = new CSG.Brush(asaEscudoGeom, material);

    // Creamos un Evaluador que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    // Realizamos una operación booleana para quedarnos con medio asa
    var cajaAux = new THREE.BoxGeometry(2, 2, 1);
    cajaAux.translate(0, 0, 0.45);
    var cajaAux = new CSG.Brush(cajaAux, material);
    var asaFinalEscudo = evaluator.evaluate(asaEscudo, cajaAux, CSG.SUBTRACTION);

    asaFinalEscudo.userData = this;
    // this.add(asaFinalEscudo);

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
      
    // Creamos el escudo
    var escudo = new THREE.Mesh(geomEscudo, material);

    // Añadimos el asa al escudo
    escudo.add(asaFinalEscudo);

    // Rotamos el escudo
    escudo.rotation.x = Math.PI / 2;

    escudo.userData = this;
    return escudo;
  }
  /*############################################################################*/
  // Animación

  animar()
  {
  }

  /*############################################################################*/
  // Método update del objeto

  actualizar()
  {
    // super.actualizar(false);
  }
}
