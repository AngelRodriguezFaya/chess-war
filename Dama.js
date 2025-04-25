import * as THREE from '../libs/three.module.js';
import { MTLLoader } from '../libs/MTLLoader.js';
import { OBJLoader } from '../libs/OBJLoader.js';

class Dama extends THREE.Object3D {
    constructor() {
        super();

        var material = new THREE.MeshNormalMaterial({ flatShading : true });

        var objectLoader = new OBJLoader();

        objectLoader.load('../modelos/dama/dama.obj', (object) => {
            // Utilizamos el método traverse para asignar el material a cada hijo del objeto cargado
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                }
            });

            // Aqui se hacen todas las transformaciones necesarias para que el objeto se vea bien
            this.rotation.x = - (Math.PI / 2); // Rota el objeto 90 grados en el eje X
            this.position.set(0, 0, 0); 
            // this.scale.set(0.6, 0.6, 0.6);

            // Se añade el objeto a la escena
            this.add(object);
            
        }, null, null);
    }
};

export { Dama };

