import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'

class Alfil extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // En primer lugar creamos la interfaz para el alfil
    this.createGUI(gui, titleGui);

    // Creamos el material
    var material = new THREE.MeshNormalMaterial({ flatShading : true });

    // La construcción del alfil 

    //------------ Definimos el cuerpo de la pieza -----------------
    // Lo haremos por revolución, definiendo los objetos con un Shape
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(4, 0);
    shape.lineTo(4, 1);
    shape.lineTo(3, 1);
    shape.lineTo(3, 2);
    shape.lineTo(2.5, 2);
    shape.lineTo(2, 2.5);
    shape.lineTo(2, 3);
    shape.lineTo(1.5, 3.5);
    shape.lineTo(1.4, 3.5);
    // shape.lineTo(1.3, 3.6);
    // shape.lineTo(1.2, 3.7);
    // shape.lineTo(1.1, 3.8);
    shape.lineTo(1, 4);
    shape.lineTo(0.9, 4.5);
    shape.lineTo(0.7, 6);
    shape.lineTo(0.7, 7.5);
    shape.lineTo(1.5, 7.5);
    shape.lineTo(1.5, 8);
    shape.lineTo(1, 8);
    shape.lineTo(1, 8.5);
    shape.lineTo(0.5, 8.5);
    shape.lineTo(0.5, 9);
    shape.lineTo(0, 9);
    shape.lineTo(0, 0);
    shape.moveTo(0, 7.5);
    // shape.quadraticCurveTo(4, 10.5, 0, 13);



    var points = shape.getPoints(); (10).shape;
    var alfilGeom = new THREE.LatheGeometry(points, 50, 0, Math.PI * 2);
    
    // Se construye el objeto Brush que modela el cuerpo del alfil
    this.alfil = new CSG.Brush (alfilGeom, material);

    this.add(this.alfil);
  }

  createGUI(gui, titleGui){}
  
  update () {}
}

export { Alfil };