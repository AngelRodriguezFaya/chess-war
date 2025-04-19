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

    
  }

  createGUI(gui, titleGui){}
  
  update () {}
}

export { Alfil };