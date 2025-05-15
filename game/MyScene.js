/*############################################################################*/
// Importaciones

/*########################################################*/
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'

/*########################################################*/
// Clases de mi proyecto

// Lógica
import { TipoPieza, TipoJugador } from './logica/TiposUtils.js'
import { TableroLogica } from './logica/TableroLogica.js'

// Modelos
import { PiezaBaseModelo } from './modelos/PiezaBaseModelo.js'
import { TableroModelo } from './modelos/TableroModelo.js'


/*############################################################################*/
// La clase fachada del modelo.
// Usaremos una clase derivada de la clase Scene de Three.js para llevar
// el control de la escena y de todo lo que ocurre en ella

class MyScene extends THREE.Scene
{
  /*############################################################################*/
  // Estados de la aplicación

  static SELECCIONANDO_PIEZA = 0;
  static SELECCIONANDO_CASILLA = 1;

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

    // Inicializamos el picking
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera();

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta.
    // Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con this.add(variable)
    this.createLights();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Todas las unidades están en metros
    this.createAxis();
    
    // Creamos las figuras y el tablero
    this.createModels();

    // Creamos el 'tablero' que lleva la lógica del juego
    this.tablero_logica = new TableroLogica();

    // Manejo de las piezas seleccionadas
    this.pieza_seleccionada = null;
    this.jugador_actual = TipoJugador.BLANCO;

    // Inicializamos el estado actual de la aplicación
    this.estado_aplicacion = MyScene.SELECCIONANDO_PIEZA;
  }

  /*############################################################################*/
  // Renderizador

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
  
  createGUI()
  {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    // En el contexto de una función this alude a la función
    this.guiControls = {
      lightPower : 50000.0,
      ambientIntensity : 0.0,   
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la potencia de la luz puntual
    folder.add(this.guiControls, 'lightPower', 0, 100000, 50)
      .name('Luz puntual : ')
      .onChange((value) => this.setLightPower(value));
    
    // Otro para la intensidad de la luz ambiental
    folder.add(this.guiControls, 'ambientIntensity', 0, 3, 0.05)
      .name('Luz ambiental: ')
      .onChange((value) => this.setAmbientIntensity(value));
    
    return gui;
  }

  /*############################################################################*/
  // Picking

  findPickedObject(event, piece_types, tipo_jugador)
  {
    // Obtenemos la posición del click en coordenadas normalizadas
    var rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = 2*((event.clientX - rect.left) / rect.width) - 1;
    this.mouse.y = 1 - 2*((event.clientY - rect.top) / rect.height);

    // Se actualiza un rayo que parte de la cámara y que pasa por la
    // posición donde se ha hecho el clic
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Buscamos los objetos que son intersectados por el rayo
    var picked_objects = this.raycaster.intersectObjects(this.children, true);

    // Buscamos el primer objeto cuyo tipo se encuentre en la lista de piezas
    for (let i = 0; i < picked_objects.length; i++) {
      var picked_obj = picked_objects[i].object.userData;

      if (picked_obj instanceof PiezaBaseModelo) {
        if (piece_types.includes(picked_obj._tipo_pieza)) {
          if (picked_obj.getTipoJugador() === tipo_jugador) {
            return picked_obj;
          }
        }
      }
    }

    return null;
  }

  onMouseUp(event)
  {
    switch (this.estado_aplicacion) {
      case (MyScene.SELECCIONANDO_PIEZA):
        // Tratamos de seleccionar solo las fichas del juego
        var picked_obj = this.findPickedObject(event, [TipoPieza.TORRE, TipoPieza.CABALLO, TipoPieza.ALFIL, TipoPieza.REINA, TipoPieza.REY, TipoPieza.PEON], this.jugador_actual);
        
        // Comprobamos si hemos seleccionado algun objeto
        if (picked_obj !== null) {
          // Guardamos una referencia a la pieza seleccionada
          this.pieza_seleccionada = picked_obj;

          // Cambiamos de estado
          this.estado_aplicacion = MyScene.SELECCIONANDO_CASILLA;

          console.log(`Pieza seleccionada: ${picked_obj.getTipoPieza()} ${picked_obj.getTipoJugador()}}`);
        }

        break;
      
      case (MyScene.SELECCIONANDO_CASILLA):
        // Tratamos de seleccionar solo las fichas del juego
        var picked_obj = this.findPickedObject(event, [TipoPieza.CASILLA], TipoJugador.DESCONOCIDO);

        // Comprobamos si hemos seleccionado algun objeto
        if (picked_obj !== null) {
          // Compromabos si hemos seleccionado la misma casilla de la pieza. Si es así
          // Volvemos a seleccionar una pieza del mismo jugador
          if (this.pieza_seleccionada.getPosicionTablero().equals(picked_obj.getPosicionTablero())) {
            // Deleccionamos la pieza y cambiamos de estado
            this.pieza_seleccionada = null;
            this.estado_aplicacion = MyScene.SELECCIONANDO_PIEZA;

            console.log("Se ha seleccionado la misma casilla, seleccione otra pieza");
          }
          else {
            // Tratamos de realizar la jugada desde la posición de la pieza seleccionada a la nueva posición
            var jugada = this.tablero_logica.esJudagaPosible(this.pieza_seleccionada.getPosicionTablero(), picked_obj.getPosicionTablero())

            if (jugada !== null) {
              // Ejecutamos el movimiento
              this.tablero_logica.aplicarJugada(jugada);

              // Si en la jugada se mata a alguna pieza la borramos
              if (jugada.getDisponibleCome()) {
                var kill_pos = jugada.getPosicionCome();
                this.tablero.eliminaPieza(kill_pos.getFila(), kill_pos.getColumna());
              }

              // Si hay un movimiento extra (el realizado por el enroque) movemos dicha pieza
              if (jugada.getDisponibleExtra()) {
                var current_extra_pos = jugada.getMovimientoExtra().getPosicionActual();
                var new_extra_pos = jugada.getMovimientoExtra().getPosicionSiguiente();
                var extra_pieza = this.tablero.getCasillaPieza(current_extra_pos.getFila(), current_extra_pos.getColumna()).pieza;

                this.tablero.muevePieza(current_extra_pos.getFila(), current_extra_pos.getColumna(),
                                        new_extra_pos.getFila(), new_extra_pos.getColumna());
                extra_pieza.board_position = new_extra_pos;
                extra_pieza.position.set(new_extra_pos.getColumna() * 9, 0, new_extra_pos.getFila() * 9);
              }

              // Movemos la pieza
              this.tablero.muevePieza(this.pieza_seleccionada.getPosicionTablero().getFila(), this.pieza_seleccionada.getPosicionTablero().getColumna(),
                                      picked_obj.getPosicionTablero().getFila(), picked_obj.getPosicionTablero().getColumna());
              this.pieza_seleccionada.setPosicionTablero(picked_obj.getPosicionTablero());
              this.pieza_seleccionada.position.set(picked_obj.getPosicionTablero().getColumna() * 9, 0, picked_obj.getPosicionTablero().getFila() * 9);

              // Obtenemos la posicion y pieza de la nueva posición para comprobar
              // si un peon se convierte en reina (solucion temporal) y actualizar
              // la posición del rey
              //                 IMPLEMENTAR

              // Reseteamos el color del tablero, puesto que la pieza ya se ha movido
              this.tablero.reseteaColorCasillas();

              // Deseleccionamos la pieza y cambiamos de estado
              this.pieza_seleccionada = null;
              this.estado_aplicacion = MyScene.SELECCIONANDO_PIEZA;

              // Cambiamos de turno y de estado
              if (this.jugador_actual === TipoJugador.BLANCO) {
                this.jugador_actual = TipoJugador.NEGRO;
              }
              else {
                this.jugador_actual = TipoJugador.BLANCO;
              }

              console.log(`Turno: ${this.jugador_actual}`);
            }
          }
        }

        break;
    }
  }

  onMouseMove(event)
  {
    switch (this.estado_aplicacion) {
      case (MyScene.SELECCIONANDO_PIEZA):
        // Tratamos de seleccionar solo las fichas del juego
        var picked_obj = this.findPickedObject(event, [TipoPieza.TORRE, TipoPieza.CABALLO, TipoPieza.ALFIL, TipoPieza.REINA, TipoPieza.REY, TipoPieza.PEON], this.jugador_actual);

        // Comprobamos si hemos seleccionado algun objeto
        if (picked_obj !== null) {
          // Obtenemos la posición en el tablero
          var posicion_tablero = picked_obj.getPosicionTablero();

          // Obtenemos las jugadas disponibles de la pieza
          var jugadas_posibles = this.tablero_logica.getPieza(posicion_tablero).getJugadas(this.tablero_logica, posicion_tablero);

          // Actualizamos los colores de las casillas
          this.tablero.actualizaColorCasillas(jugadas_posibles);
        }
        else {
          // Reseteamos el color del tablero que el raton no esta encima de ninguma pieza
          this.tablero.reseteaColorCasillas();
        }

        break;
    }
  }

  /*############################################################################*/
  // Cámara
  
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
    // this.camera.position.set(16, 30, 62);
    this.camera.position.set(33.75, 100, 100);
    
    // Y hacia dónde mira
    // var look = new THREE.Vector3(16, 0, 16); // Hacia el centro del tablero
    var look = new THREE.Vector3(33.75, 10, 33.75); 
    this.camera.lookAt(look);
    this.add(this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    /*this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);

    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 1.5;
    this.cameraControl.zoomSpeed = -1.5;
    this.cameraControl.panSpeed = 0.5;

    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;*/
  }

  getCamera()
  {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }

  /*############################################################################*/
  // Luces de la escena

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
    this.pointLight.position.set(30, 25, 30);
    this.add(this.pointLight);
  }

  setLightPower(valor)
  {
    this.pointLight.power = valor;
  }

  setAmbientIntensity(valor)
  {
    this.ambientLight.intensity = valor;
  }

  /*############################################################################*/
  // Ejes de la escena

  createAxis()
  {
    // Ejes para el modelo
    this.axis = new THREE.AxesHelper(50);
    this.axis.translateY(0.1);
    this.add(this.axis);
  }

  /*############################################################################*/
  // Modelos

  createModels()
  {
    this.tablero = new TableroModelo();
    this.add(this.tablero);
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
    //this.cameraControl.update();

    // Se actualiza el tablero
    this.tablero.update();
    
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

    // Se añaden los listener de la aplicación.
    window.addEventListener("resize", () => scene.onWindowResize());
    window.addEventListener("mouseup", (event) => scene.onMouseUp(event));
    window.addEventListener("mousemove", (event) => scene.onMouseMove(event));
    
    // Que no se nos olvide, la primera visualización.
    scene.update();
  }
);
