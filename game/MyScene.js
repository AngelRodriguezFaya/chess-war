/*############################################################################*/
// Importaciones

/*########################################################*/
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'

/*########################################################*/
// Clases de mi proyecto

import { Alfil } from './Alfil.js'
import { Torre } from './Torre.js'
import { Dama } from './Dama.js'





/*############################################################################*/
// La clase fachada del modelo.
// Usaremos una clase derivada de la clase Scene de Three.js para llevar
// el control de la escena y de todo lo que ocurre en ella

class MyScene extends THREE.Scene
{
  /*############################################################################*/
  // Constructor
  
  constructor(myCanvas)
  {
    // Llamamos al constructor padre
    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI();

    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera();

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta.
    // Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con this.add(variable)
    this.createLights();

    // Un suelo
    this.createGround();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Todas las unidades están en metros
    this.createAxis();
    
    // Por último creamos los modelos
    this.createModels();
  }





  /*############################################################################*/
  // Renderizador

  /*########################################################*/
  // Creación

  createRenderer(myCanvas)
  {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    // Se instancia un Renderer WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }

  /*########################################################*/
  // Callbacks
  
  setCameraAspect(ratio)
  {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;

    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize()
  {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }





  /*############################################################################*/
  // Interfaz de usuario

  /*########################################################*/
  // Creación
  
  createGUI()
  {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    // En el contexto de una función this alude a la función
    this.guiControls = {
      lightPower : 500.0,
      ambientIntensity : 0.5,   
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la potencia de la luz puntual
    folder.add (this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange ((value) => this.setLightPower(value));
    
    // Otro para la intensidad de la luz ambiental
    folder.add (this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange ((value) => this.setAmbientIntensity(value));
    
    return gui;
  }





  /*############################################################################*/
  // Cámara

  /*########################################################*/
  // Creación
  
  createCamera()
  {
    // Para crear una cámara le indicamos:
    // El ángulo del campo de visión en grados sexagesimales
    // La razón de aspecto ancho/alto
    // Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    //this.camera = new THREE.OrthographicCamera(10 * (window.innerWidth / window.innerHeight) / -2, 10 * (window.innerWidth / window.innerHeight) / 2, 10 / 2, 10 / -2, 0.1, 1000);

    // Recuerda: Todas las unidades están en metros
    // También se indica dónde se coloca
    this.camera.position.set(0, 8, 10);
    
    // Y hacia dónde mira
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);

    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 1.5;
    this.cameraControl.zoomSpeed = -1.5;
    this.cameraControl.panSpeed = 0.5;

    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }

  /*########################################################*/
  // Callbacks

  getCamera()
  {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }





  /*############################################################################*/
  // Luces de la escena

  /*########################################################*/
  // Creación

  createLights()
  {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera
    // directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como var y va a ser una variable local a este método
    // Se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);

    // La añadimos a la escena
    this.add(this.ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set(2, 3, 1);
    this.add(this.pointLight);
  }

  /*########################################################*/
  // Callbacks

  setLightPower(valor)
  {
    this.pointLight.power = valor;
  }

  setAmbientIntensity(valor)
  {
    this.ambientLight.intensity = valor;
  }





  /*############################################################################*/
  // Suelo de la escena

  createGround()
  {
    // El suelo es un Mesh, necesita una geometría y un material.
    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry(8, 0.5, 8);
    
    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../imgs/textura-ajedrezada.jpg');
    var materialGround = new THREE.MeshStandardMaterial({map: texture});
    
    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh(geometryGround, materialGround);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.26;

    // Que no se nos olvide añadirlo a la escena, que en este caso es this
    this.add(ground);
  }





  /*############################################################################*/
  // Ejes de la escena

  createAxis()
  {
    // Ejes para el modelo
    this.axis = new THREE.AxesHelper(12);
    this.add(this.axis);
  }





  /*############################################################################*/
  // Modelos

  createModels()
  {
    // Alfil
    this.alfil = new Alfil(this.gui, "Controles del alfil");
    this.alfil.applyMatrix4(new THREE.Matrix4().makeScale(0.11, 0.11, 0.11));
    this.alfil.applyMatrix4(new THREE.Matrix4().makeTranslation(-1.5, 0, 3.5));
    this.add(this.alfil);

    // Torre
    this.torre = new Torre(this.gui, "Controles de la torre");
    this.torre.applyMatrix4(new THREE.Matrix4().makeScale(0.11, 0.11, 0.11));
    this.torre.applyMatrix4(new THREE.Matrix4().makeTranslation(-3.5, 0, 3.5));
    this.add(this.torre);

    // Dama
    this.dama = new Dama(this.gui, "Controles de la dama");
    this.dama.applyMatrix4(new THREE.Matrix4().makeScale(0.06, 0.06, 0.06));
    this.dama.applyMatrix4(new THREE.Matrix4().makeTranslation(-0.135, 0.025, 0.135));
    this.dama.applyMatrix4(new THREE.Matrix4().makeScale(1.1, 1.1, 1.1));
    this.dama.applyMatrix4(new THREE.Matrix4().makeTranslation(-0.5, 0, 3.5));
    this.add(this.dama);
  }





  /*############################################################################*/
  // Método update de la escena

  update()
  {
    if (this.stats) {
      this.stats.update();
    }
    
    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    
    // Se actualiza el resto del modelo
    this.alfil.update();
    this.torre.update();
    this.dama.update();
    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render(this, this.getCamera());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea, update() se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}





/*############################################################################*/
// Función main

$(
  function ()
  {
    // Se instancia la escena pasándole el div que se ha creado en el html para visualizar
    var scene = new MyScene("#WebGL-output");

    // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
    window.addEventListener ("resize", () => scene.onWindowResize());
    
    // Que no se nos olvide, la primera visualización.
    scene.update();
  }
);
