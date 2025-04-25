import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'

class Torre extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // CONSTANTE DE RESOLUCIÓN
    const RES = 4;
    
    // En primer lugar creamos la interfaz para la torre
    this.createGUI(gui, titleGui);

    // Creamos el material
    var material = new THREE.MeshNormalMaterial({ flatShading : true });

    // Se construye un Evaluator que utilizaremos para las operaciones booleanas
    var evaluator = new CSG.Evaluator();

    //------------ Creamos la torre -----------------

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

    var torreGeom = new THREE.LatheGeometry(this.points, 50, 0, Math.PI * 2);
    
    // Se construye el objeto Brush que modela la torre
    this.torre = new CSG.Brush (torreGeom, material);


    //---------- Ahora creamos los toros que se van a añadir a la torre -----------------
    // Se crean la geometría de los toros
    var toro1Geom = new THREE.TorusGeometry(3.3, 0.4, RES*10, RES*10);
    var toro2Geom = new THREE.TorusGeometry(3, 0.2, RES*10, RES*10);
    var toro3Geom = new THREE.TorusGeometry(2.7, 0.2, RES*10, RES*10);
    var toro4Geom = new THREE.TorusGeometry(2.1, 0.25, RES*10, RES*10);
    var toro5Geom = new THREE.TorusGeometry(2.4, 0.2, 3, RES*10);

    // Se posicioonan y se orientan
    toro1Geom.rotateX(Math.PI / 2);
    toro1Geom.translate(0, 1.3, 0);

    toro2Geom.rotateX(Math.PI / 2);
    toro2Geom.translate(0, 2.8, 0);

    toro3Geom.rotateX(Math.PI / 2);
    toro3Geom.translate(0, 3.1, 0);

    toro4Geom.rotateX(Math.PI / 2);
    toro4Geom.translate(0, 8.4, 0);

    toro5Geom.rotateX(Math.PI / 2);
    toro5Geom.translate(0, 9.4, 0);    

    // Se construyen los objetos Brush que modelan los toros
    this.toro1 = new CSG.Brush (toro1Geom, material);
    this.toro2 = new CSG.Brush (toro2Geom, material);
    this.toro3 = new CSG.Brush (toro3Geom, material);
    this.toro4 = new CSG.Brush (toro4Geom, material);
    this.toro5 = new CSG.Brush (toro5Geom, material);   
    

    // Usamos el evaluador para unir los toros a la torre
    this.result1 = evaluator.evaluate(this.torre, this.toro1, CSG.ADDITION);
    this.result2 = evaluator.evaluate(this.result1, this.toro2, CSG.ADDITION);
    this.result3 = evaluator.evaluate(this.result2, this.toro3, CSG.ADDITION);
    this.result4 = evaluator.evaluate(this.result3, this.toro4, CSG.ADDITION);
    this.result5 = evaluator.evaluate(this.result4, this.toro5, CSG.SUBTRACTION);


    //------------ Se crean los agujeros de la cima de la torre con cajas -----------------
    // Se crean la geometría de las cajas
    var caja1Geom = new THREE.BoxGeometry(8, 1, 1);
    var caja2Geom = new THREE.BoxGeometry(8, 1, 1);
    var caja3Geom = new THREE.BoxGeometry(8, 1, 1);

    // Se posicionan y se orientan
    caja1Geom.translate(0, 11, 0); 
    caja2Geom.translate(0, 11, 0);
    caja2Geom.rotateY(Math.PI / 3);
    caja3Geom.translate(0, 11, 0);
    caja3Geom.rotateY(-Math.PI / 3);

    // Se construyen los objetos Brush que modelan las cajas
    this.caja1 = new CSG.Brush (caja1Geom, material); 
    this.caja2 = new CSG.Brush (caja2Geom, material);
    this.caja3 = new CSG.Brush (caja3Geom, material);

    // Usamos el evaluador para restar las cajas a la torre
    this.result6 = evaluator.evaluate(this.result5, this.caja1, CSG.SUBTRACTION);
    this.result7 = evaluator.evaluate(this.result6, this.caja2, CSG.SUBTRACTION);
    this.final = evaluator.evaluate(this.result7, this.caja3, CSG.SUBTRACTION); 

    //------------ Añadimos la torre (resultado final) a la escena -----------------
    this.add(this.final);    
  }

  createGUI(gui, titleGui){}
  
  update () {}

}

export { Torre };