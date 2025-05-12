/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'

import { TypePiece } from '../logica/TiposUtils.js'
import { PiezaBaseModelo } from './PiezaBaseModelo.js'




/*############################################################################*/
// Clase Rey

export class ReyModelo extends PiezaBaseModelo
{
  /*############################################################################*/
  // Constructor

  constructor(gui, titleGui, material, board_position, type_player)
  {
    // Llamamos al constructor padre
    super(board_position, TypePiece.KING, type_player);

    // Inicialización de los parámetros
    this.iniParam();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
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

      // A continuación se definen las geometrías de los diferentes elementos del Rey
        
      // --------------------------------------------------------------------------------
      //------------------------------- Pies --------------------------------------------
      // --------------------------------------------------------------------------------

  
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
      
      // Añadimos los pies al rey
      this.add(pieIzq);
      this.add(pieDer);
  
  
  
  
      // --------------------------------------------------------------------------------
      //------------------------------- Espinillas --------------------------------------
      // --------------------------------------------------------------------------------

  
      // Definimos las geometrías de la parte inferior de cada pierna
      var geomEspinillaIzq = new THREE.CylinderGeometry(0.5, 0.4, 3, RES);
      var geomEspinillaDer = new THREE.CylinderGeometry(0.5, 0.4, 3, RES);
  
      // Posicionamos y orientamos las geometrías 
      geomEspinillaIzq.rotateZ(-ROTACION_PIERNAS);
      geomEspinillaIzq.translate(-1.3, 2.3, 0);
  
      geomEspinillaDer.rotateZ(ROTACION_PIERNAS);
      geomEspinillaDer.translate(1.3, 2.3, 0);
  
      // Creamos las partes inferiores de las piernas
      var espinillaIzq = new THREE.Mesh(geomEspinillaIzq, material);
      var espinillaDer = new THREE.Mesh(geomEspinillaDer, material);
  
      // Las añadimos al rey
      this.add(espinillaIzq);
      this.add(espinillaDer);
        
  
  
      // --------------------------------------------------------------------------------
      //------------------------------- Rodillas ----------------------------------------
      // --------------------------------------------------------------------------------
      

      // Definimos las geometrías de las rodillas
      var geomRodillaIzq = new THREE.SphereGeometry(0.52, RES, RES);
      var geomRodillaDer = new THREE.SphereGeometry(0.52, RES, RES);
  
      // Posicionamos y orientamos las geometrías
      geomRodillaIzq.translate(-1.22, 3.7, 0);
      geomRodillaDer.translate(1.22, 3.7, 0);
  
      // Creamos las rodillas
      var rodillaIzq = new THREE.Mesh(geomRodillaIzq, material);
      var rodillaDer = new THREE.Mesh(geomRodillaDer, material);
  
      // Añadimos las rodillas al rey
      this.add(rodillaIzq);
      this.add(rodillaDer);  
  


      // --------------------------------------------------------------------------------
      //------------------------------- Muslos ------------------------------------------
      // --------------------------------------------------------------------------------

      // Definimos las geometrías de los muslos
      var geomMusloIzq = new THREE.CylinderGeometry(0.8, 0.5, 3, RES);
      var geomMusloDer = new THREE.CylinderGeometry(0.8, 0.5, 3, RES);
  
      // Posicionamos y orientamos las geometrías
      geomMusloIzq.rotateZ(-ROTACION_PIERNAS);
      geomMusloIzq.translate(-1.13, 5.15, 0);
  
      geomMusloDer.rotateZ(ROTACION_PIERNAS);
      geomMusloDer.translate(1.13, 5.15, 0);
  
      // Creamos los muslos
      var musloIzq = new THREE.Mesh(geomMusloIzq, material);
      var musloDer = new THREE.Mesh(geomMusloDer, material);
  
      // Añadimos los muslos al rey
      this.add(musloIzq);
      this.add(musloDer);
      
      

      // --------------------------------------------------------------------------------
      //------------------------------- Cadera y tronco ----------------------------------
      // --------------------------------------------------------------------------------

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
      geomCadTron.translate(0, 6.7, -0.6)
      
      // Creamos la cadera y el tronco
      var cadTron = new THREE.Mesh(geomCadTron, material);
  
      // Añadimos la cadera y el tronco al rey
      this.add(cadTron);
  


      // --------------------------------------------------------------------------------
      //------------------------------- Cuello ------------------------------------------
      // --------------------------------------------------------------------------------

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
      geomCuello.translate(0, 12.2, 0);
  
      // Creamos el cuello
      var cuello = new THREE.Mesh(geomCuello, material);
  
      // Añadimos el cuello al rey
      this.add(cuello);
      


      // --------------------------------------------------------------------------------
      //------------------------------- Cabeza ------------------------------------------
      // --------------------------------------------------------------------------------

      
      // Definimos la forma 2D de la cabeza
      var formaCabeza = new THREE.Shape();
      formaCabeza.moveTo(0, 0);
      formaCabeza.lineTo(0.6, 0);
      formaCabeza.quadraticCurveTo(1.2, 1.7, 0, 2);
  
      // Definimos la geometría de la cabeza por revolución
      var puntosCabeza = formaCabeza.getPoints();
      var geomCabeza = new THREE. LatheGeometry ( puntosCabeza , RES, 0, Math.PI * 2) ;
  
      // Posicionamos la geometría de la cabeza
      geomCabeza.translate(0, 13, 0);
  
      // Creamos la cabeza
      this.cabeza = new CSG.Brush(geomCabeza, material);
      
      // La cabeza la añadimos mas tarde, después de hacer las operaciones booleanas con la boca

      //------------------------------- Ojos, nariz y boca -------------------------------


      // Definimos las geometrías de los ojos
      var ojoIzqGeom = new THREE.SphereGeometry(0.1, RES, RES);
      var ojoDerGeom = new THREE.SphereGeometry(0.1, RES, RES);

      // Posicionamos las geometrías
      ojoIzqGeom.translate(0.3, 14, 0.7);
      ojoDerGeom.translate(-0.3, 14, 0.7);

      // Creamos los ojos
      var ojoIzq = new THREE.Mesh(ojoIzqGeom, material);
      var ojoDer = new THREE.Mesh(ojoDerGeom, material);

      // Añadimos los ojos al rey
      this.add(ojoIzq);
      this.add(ojoDer);

      // Definimos la geometría de la nariz
      var narizGeom = new THREE.BoxGeometry(0.1, 0.4, 0.4);

      // Posicionamos y orientamos la geometría
      narizGeom.rotateX(-Math.PI / 8);
      narizGeom.translate(0, 13.7, 0.7);


      // Creamos la nariz
      var nariz = new THREE.Mesh(narizGeom, material);

      // Añadimos la nariz al rey
      this.add(nariz);

      // Definimos la geometría de la boca
      var bocaGeom = new THREE.BoxGeometry(0.6, 0.1, 0.4);
      // La posicionamos y orientamos
      // bocaGeom.rotateX(-Math.PI);
      bocaGeom.translate(0, 13.3, 0.6);

      // Creamos la boca
      var boca = new CSG.Brush(bocaGeom, material);

      // Hacemos una operación booleana para hacer el hueco de la boca
      var cabezaFinal = evaluator.evaluate(this.cabeza, boca, CSG.SUBTRACTION);

      // Añadimos la boca al rey
      this.add(cabezaFinal);

      // -------------------------------- Corona ------------------------------------------

      // Definimos la geometría de la corona
      var geomCorona = new THREE.CylinderGeometry(0.8, 0.8, 1, RES);

      // Posicionamos su geometría
      geomCorona.translate(-2, 14.8, 0);
      
      // Creamos la corona
      var corona = new CSG.Brush(geomCorona, material);

      // La corona final la añadimos más tarde, después de hacer las operaciones booleanas para hacer sus detalles.


      // Definimos la geometría del hueco de la corona
      var huecoCorona = new THREE.CylinderGeometry(0.7, 0.7, 1.2, RES);

      // Posicionamos su geometría
      huecoCorona.translate(-2, 14.8, 0);
      
      // Creamos el hueco de la corona
      var huecoCorona = new CSG.Brush(huecoCorona, material);

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
      this.add(coronaFinal);
      coronaFinal.position.set(2, 0, 0);

     
      // --------------------------------------------------------------------------------
      //------------------------------- Brazos ------------------------------------------
      // --------------------------------------------------------------------------------

      // --------------------------------------------------------------------------------
      // ----------------------------- Brazo derecho ------------------------------------
      // --------------------------------------------------------------------------------

      // ---------------------------- Protección del hombro -----------------------------

      
      // Definimos la geometría de la protección del hombro
      var prtHombroDchoGeom = new THREE.CylinderGeometry(0.9, 1, 1.2, RES);
  
      // La posicionamos y orientamos
      prtHombroDchoGeom.rotateZ(Math.PI/7);
      prtHombroDchoGeom.translate(1.4, 12, 0);
  
      // Creamos la protección del hombro
      var prtHombroDcho = new THREE.Mesh(prtHombroDchoGeom, material);
  
      // Añadimos la protección del hombro al rey
      this.add(prtHombroDcho);


      // --------------------- Parte superior del brazo --------------------------------

      // Definimos la geometría de la parte superior del brazo
      var brazoSupGeom = new THREE.CylinderGeometry(0.5, 0.4, 3, RES);
  
      // La posicionamos y orientamos
      brazoSupGeom.rotateZ(Math.PI/7); 
      brazoSupGeom.rotateX(-Math.PI/10);
      brazoSupGeom.translate(2.5, 10.5, 0.3);
  
      // Creamos la parte superior del brazo
      var brazoSupDcho = new THREE.Mesh(brazoSupGeom, material);
  
      // Añadimos la parte superior del brazo al rey
      this.add(brazoSupDcho);

      // ------------------------------- Codo ------------------------------------------
  
      // Definimos la geometría del codo
      var codoDchoGeom = new THREE.SphereGeometry(0.42, RES, RES);
  
      // La posicionamos y orientamos
      codoDchoGeom.translate(3.2, 9.15, 0.75);
  
      // Creamos el codo
      var codoDcho = new THREE.Mesh(codoDchoGeom, material);
  
      // Añadimos el codo al rey
      this.add(codoDcho);


      // --------------------- Parte inferior del brazo --------------------------------
  
      // Definimos la geometría de la parte inferior del brazo
      var brazoInfDchoGeom = new THREE.CylinderGeometry(0.4, 0.2, 3, RES);
      // La posicionamos y orientamos
      brazoInfDchoGeom.rotateZ(-Math.PI/2.5);
      brazoInfDchoGeom.rotateY(-Math.PI/7);
      brazoInfDchoGeom.rotateX(-Math.PI);
      // brazoInfDchoGeom.rotateZ(Math.PI/2);
      brazoInfDchoGeom.translate(1.9, 9.6, 1.35);

      // Creamos la parte inferior del brazo
      var brazoDchoInf = new THREE.Mesh(brazoInfDchoGeom, material);
      // Añadimos la parte inferior del brazo al rey
      this.add(brazoDchoInf);

      // ------------------------------- Mano Derecha --------------------------------
  
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
  
      // Añado la mano Final al rey
      resultFinalManoDcha.position.set(-3.2, 1.2, -0.9);
      this.add(resultFinalManoDcha);  


      // ------------------------------- Protector de la muñeca ------------------------


    
        // Definimos la geometría para el protector de la muneca
        var prtMunecaDchaGeom = new THREE.CylinderGeometry(0.45, 0.25, 0.8, RES);
        // La posicionamos y orientamos
        prtMunecaDchaGeom.rotateX(-Math.PI/2.5);
        prtMunecaDchaGeom.rotateY(-Math.PI/2.5);
        prtMunecaDchaGeom.rotateZ(-Math.PI/5);

        prtMunecaDchaGeom.translate(0.9, 10, 1.8);
        // Creamos el protector de la muñeca
        var prtMunecaDcha = new THREE.Mesh(prtMunecaDchaGeom, material);
        // Añadimos el protector de la muñeca al rey

        this.add(prtMunecaDcha);
        
      
      // -------------------------------------------------------------------------------- 
      // ------------------------------- Brazo izquierdo --------------------------------
      // --------------------------------------------------------------------------------

      // ---------------------------- Protección del hombro -----------------------------

        // Definimos la geometría de la protección del hombro 
        var prtHombroIzqGeom = new THREE.CylinderGeometry(0.9, 1, 1.2, RES);

        // La posicionamos y orientamos
        prtHombroIzqGeom.rotateZ(-Math.PI/7);
        prtHombroIzqGeom.translate(-1.4, 12, 0);

        // Creamos la protección del hombro
        var prtHombroIzq = new THREE.Mesh(prtHombroIzqGeom, material);

        // Añadimos la protección del hombro al rey
        this.add(prtHombroIzq);

      // --------------------- Parte superior del brazo --------------------------------

        // Definimos la geometría de la parte superior del brazo
        var brazoSupIzqGeom = new THREE.CylinderGeometry(0.5, 0.4, 3, RES);

        // La posicionamos y orientamos
        brazoSupIzqGeom.rotateZ(-Math.PI/10);
        brazoSupIzqGeom.rotateX(-Math.PI/10);
        brazoSupIzqGeom.translate(-2.3, 10.5, 0.3);

        // Creamos la parte superior del brazo
        var brazoSupIzq = new THREE.Mesh(brazoSupIzqGeom, material);

        // Añadimos la parte superior del brazo al rey
        this.add(brazoSupIzq);

      // ------------------------------- Codo ------------------------------------------

        // Definimos la geometría del codo
        var codoIzqGeom = new THREE.SphereGeometry(0.42, RES, RES);

        // La posicionamos y orientamos
        codoIzqGeom.translate(-2.75, 9.15, 0.75);

        // Creamos el codo
        var codoIzq = new THREE.Mesh(codoIzqGeom, material);

        // Añadimos el codo al rey
        this.add(codoIzq);

      // --------------------- Parte inferior del brazo --------------------------------

        // Definimos la geometría de la parte inferior del brazo
        var brazoInfIzqGeom = new THREE.CylinderGeometry(0.4, 0.2, 3, RES);

        // La posicionamos y orientamos
        brazoInfIzqGeom.rotateZ(Math.PI/2);
        brazoInfIzqGeom.rotateY(-Math.PI/8);
        brazoInfIzqGeom.translate(-1.2, 9.2, 1.4);

        // Creamos la parte inferior del brazo
        var brazoIzqInf = new THREE.Mesh(brazoInfIzqGeom, material);

        // Añadimos la parte inferior del brazo al rey
        this.add(brazoIzqInf);

      // ------------------------------- Mano Izquierda --------------------------------

        // Definimos la geometría de la mano izquierda
        var manoIzqdaGeom = new THREE.BoxGeometry(0.5, 0.5, 0.4);

        // La posicionamos y orientamos
        manoIzqdaGeom.translate(-3.55, 8.9, 2.85);

        // Creamos la mano izquierda
        var manoIzqda = new CSG.Brush(manoIzqdaGeom, material);
        // Definimos la geometría de 4 dedos
        var dedos1IzqdaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
        var dedos2IzqdaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
        var dedos3IzqdaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);
        var dedos4IzqdaGeom = new THREE.BoxGeometry(0.6, 0.02, 0.6);

        // La posicionamos y orientamos
        dedos1IzqdaGeom.translate(-3.3, 9.05, 2.95);
        dedos2IzqdaGeom.translate(-3.3, 8.95, 2.95);
        dedos3IzqdaGeom.translate(-3.3, 8.85, 2.95);
        dedos4IzqdaGeom.translate(-3.3, 8.75, 2.95);

        // Creamos los dedos
        var dedos1Izqda = new CSG.Brush(dedos1IzqdaGeom, material);
        var dedos2Izqda = new CSG.Brush(dedos2IzqdaGeom, material);
        var dedos3Izqda = new CSG.Brush(dedos3IzqdaGeom, material);
        var dedos4Izqda = new CSG.Brush(dedos4IzqdaGeom, material);

        // Realizamos las operaciones booleanas
        var result1ManoIzqda = evaluator.evaluate(manoIzqda, dedos1Izqda, CSG.SUBTRACTION);
        var result2ManoIzqda = evaluator.evaluate(result1ManoIzqda, dedos2Izqda, CSG.SUBTRACTION);
        var result3ManoIzqda = evaluator.evaluate(result2ManoIzqda, dedos3Izqda, CSG.SUBTRACTION);
        var result4ManoIzqda = evaluator.evaluate(result3ManoIzqda, dedos4Izqda, CSG.SUBTRACTION);

        // Definimos la geometría del hueco de la mano
        var hueco1ManoIzqdaGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, RES);
        var hueco2ManoIzqdaGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.7, RES);
        
        // La posicionamos y orientamos
        hueco1ManoIzqdaGeom.translate(-3.39, 8.7, 2.77);
        hueco2ManoIzqdaGeom.translate(-3.52, 8.9, 2.85);

        // Creamos el hueco de la mano
        var huecoManoIzqda = new CSG.Brush(hueco1ManoIzqdaGeom, material);
        var hueco2ManoIzqda = new CSG.Brush(hueco2ManoIzqdaGeom, material);

        // Realizamos la operación booleana
        var result5ManoIzqda = evaluator.evaluate(result4ManoIzqda, huecoManoIzqda, CSG.SUBTRACTION);
        var resultFinalManoIzqda = evaluator.evaluate(result5ManoIzqda, hueco2ManoIzqda, CSG.SUBTRACTION);

        // Añado la mano Final al rey
        resultFinalManoIzqda.position.set(3.9, 0.3, -0.9); // Cambiamos la posición de la mano
        this.add(resultFinalManoIzqda);
        
      // ------------------------------- Protector de la muñeca ------------------------

        // Definimos la geometría para el protector de la muneca
        var prtMunecaIzqdaGeom = new THREE.CylinderGeometry(0.45, 0.25, 0.8, RES);
        // La posicionamos y orientamos
        prtMunecaIzqdaGeom.rotateZ(Math.PI/2);
        prtMunecaIzqdaGeom.rotateY(-Math.PI/10);
        // prtMunecaIzqdaGeom.rotateZ(Math.PI/3);
        prtMunecaIzqdaGeom.translate(-0.2, 9.2, 1.8);
        // Creamos el protector de la muñeca
        var prtMunecaIzqda = new THREE.Mesh(prtMunecaIzqdaGeom, material);
        // Añadimos el protector de la muñeca al rey

        this.add(prtMunecaIzqda);

      

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
      var mastil1EspadaGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.7, RES);
      var mastil2EspadaGeom = new THREE.CylinderGeometry(0.15, 0.15, 2.2, RES);
      var opchojaEspadaGeom = { depth : 0.01, steps : RES, bevelEnabled : false } ;
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
