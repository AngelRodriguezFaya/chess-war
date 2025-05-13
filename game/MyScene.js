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
import { TypePiece, TypePlayer } from './logica/TiposUtils.js'
import { BoardPosition } from './logica/Movimiento.js'
import { Board } from './logica/TableroLogica.js'

// Modelos
import { PiezaBaseModelo } from './modelos/PiezaBaseModelo.js'
import { AlfilModelo } from './modelos/AlfilModelo.js'
import { TorreModelo } from './modelos/TorreModelo.js'
import { ReinaModelo } from './modelos/ReinaModelo.js'
import { CaballoModelo } from './modelos/CaballoModelo.js'
import { TableroModelo } from './modelos/TableroModelo.js'
import { PeonModelo } from './modelos/PeonModelo.js'
import { ReyModelo } from './modelos/ReyModelo.js'


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
    this.board = new Board();

    // Manejo de las piezas seleccionadas
    this.pieza_seleccionada = null;
    this.jugador_actual = TypePlayer.WHITE;

    // Inicializamos el estado actual de la aplicación
    this.estado_aplicacion = MyScene.SELECCIONANDO_PIEZA;
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
      ambientIntensity : 3,   
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la potencia de la luz puntual
    folder.add (this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange ((value) => this.setLightPower(value));
    
    // Otro para la intensidad de la luz ambiental
    folder.add (this.guiControls, 'ambientIntensity', 0, 3, 0.05)
      .name('Luz ambiental: ')
      .onChange ((value) => this.setAmbientIntensity(value));
    
    return gui;
  }





  /*############################################################################*/
  // Picking

  /*########################################################*/
  // Búsqueda del objeto clicado

  findPickedObject(event, piece_types)
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
        if (piece_types.includes(picked_obj.type_piece)) {
          return picked_obj;
        }
      }
    }

    return null;
  }

  /*########################################################*/
  // Callbacks

  onMouseUp(event)
  {
    switch (this.estado_aplicacion) {
      case (MyScene.SELECCIONANDO_PIEZA):
        // Tratamos de seleccionar solo las fichas del juego
        var picked_obj = this.findPickedObject(event, [TypePiece.ROOK, TypePiece.KNIGHT, TypePiece.BISHOP, TypePiece.QUEEN, TypePiece.KING, TypePiece.PAWN]);

        // Comprobamos si hemos seleccionado algun objeto
        if (picked_obj !== null) {
          // Cambiamos de estado si la pieza seleccionada es del jugador actual
          if (this.jugador_actual === picked_obj.type_player) {
            // Guardamos una referencia a la pieza seleccionada
            this.pieza_seleccionada = picked_obj;

            // Cambiamos de estado
            this.estado_aplicacion = MyScene.SELECCIONANDO_CASILLA;

            console.log(`Pieza seleccionada: ${picked_obj.type_piece} ${picked_obj.type_player}`);
            console.log(this.board.getPiece(picked_obj.board_position).moves(this.board, picked_obj.board_position, false));
          }
        }

        break;
      
      case (MyScene.SELECCIONANDO_CASILLA):
        // Tratamos de seleccionar solo las fichas del juego
        var picked_obj = this.findPickedObject(event, [TypePiece.BOX]);

        // Comprobamos si hemos seleccionado algun objeto
        if (picked_obj !== null) {
          // Compromabos si hemos seleccionado la misma casilla de la pieza. Si es así
          // Volvemos a seleccionar una pieza del mismo jugador
          if (this.pieza_seleccionada.board_position.equals(picked_obj.board_position)) {
            // Deleccionamos la pieza y cambiamos de estado
            this.pieza_seleccionada = null;
            this.estado_aplicacion = MyScene.SELECCIONANDO_PIEZA;

            console.log("Se ha seleccionado la misma casilla, seleccione otra pieza");
          }
          else {
            // Tratamos de realizar la jugada desde la posición de la pieza seleccionada a la nueva posición
            if (this.board.tryMove(this.pieza_seleccionada.board_position, picked_obj.board_position)) {
              // Actualizamos la posición de la pieza y su modelo
              this.pieza_seleccionada.board_position = picked_obj.board_position;
              this.pieza_seleccionada.position.set(picked_obj.board_position.column() * 9, 0, picked_obj.board_position.row() * 9);

              // Deleccionamos la pieza y cambiamos de estado
              this.pieza_seleccionada = null;
              this.estado_aplicacion = MyScene.SELECCIONANDO_PIEZA;

              // Cambiamos de turno y de estado
              if (this.jugador_actual === TypePlayer.WHITE) {
                this.jugador_actual = TypePlayer.BLACK;
              }
              else {
                this.jugador_actual = TypePlayer.WHITE;
              }

              console.log(`Turno: ${this.jugador_actual}`);
            }
          }
        }

        break;
    }
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
    // this.camera.position.set(16, 30, 62);
    this.camera.position.set(30, 100, 125);
    
    // Y hacia dónde mira
    // var look = new THREE.Vector3(16, 0, 16); // Hacia el centro del tablero
    var look = new THREE.Vector3(30, 10, 30); 
    this.camera.lookAt(look);
    this.add(this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);

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
    this.pointLight.position.set(20, 30, 10);
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
    // Se crea el tablero
    this.createBoard();

    // Se crean las piezas del jugador 1
    this.createModelsPlayer1();

    // Se crean las piezas del jugador 2
    this.createModelsPlayer2();
  }

  /*############################################################################*/
  // Suelo de la escena

  createBoard()
  {
    this.tablero = new TableroModelo(this.gui, "Controles del tablero");
    this.add(this.tablero);
  }

  createModelsPlayer1()
  {
    var materialBeige = new THREE.MeshStandardMaterial({ color: 0xF5F5DC});
    var materialAux = new THREE.MeshNormalMaterial({ flatShading : true });
    
    // Crear las torres
    this.torre1player1 = new TorreModelo(this.gui, "Controles de la torre", materialAux, new BoardPosition(0, 0), TypePlayer.BLACK);
    this.add(this.torre1player1);
    this.torre1player1.position.set(0, 0, 0);

    this.torre2player1 = new TorreModelo(this.gui, "Controles de la torre", materialAux, new BoardPosition(0, 7), TypePlayer.BLACK);
    this.add(this.torre2player1);
    this.torre2player1.position.set(63, 0, 0);

    // Crear los caballos
    this.caballo1player1 = new CaballoModelo(this.gui, "Controles del caballo", materialAux, new BoardPosition(0, 1), TypePlayer.BLACK);
    this.add(this.caballo1player1);
    this.caballo1player1.rotateY(-Math.PI/2);
    this.caballo1player1.position.set(9, 0, 0);

    this.caballo2player1 = new CaballoModelo(this.gui, "Controles del caballo", materialAux, new BoardPosition(0, 6), TypePlayer.BLACK);
    this.add(this.caballo2player1);
    this.caballo2player1.rotateY(-Math.PI/2);
    this.caballo2player1.position.set(54, 0, 0);

    // Crear los alfiles
    this.alfil1player1 = new AlfilModelo(this.gui, "Controles del alfil", materialAux, new BoardPosition(0, 2), TypePlayer.BLACK);
    this.add(this.alfil1player1);
    this.alfil1player1.position.set(18, 0, 0);

    this.alfil2player1 = new AlfilModelo(this.gui, "Controles del alfil", materialAux, new BoardPosition(0, 5), TypePlayer.BLACK);
    this.add(this.alfil2player1);
    this.alfil2player1.position.set(45, 0, 0);

    // Crear la dama
    this.damaplayer1 = new ReinaModelo(this.gui, "Controles de la dama", materialAux, new BoardPosition(0, 3), TypePlayer.BLACK);
    this.add(this.damaplayer1);
    this.damaplayer1.position.set(27, 0, 0);

    // Crear el rey
    this.reyplayer1 = new ReyModelo(this.gui, "Controles del rey", materialAux, new BoardPosition(0, 4), TypePlayer.BLACK);
    this.add(this.reyplayer1);
    this.reyplayer1.position.set(36, 0, 0);

    // Crear los peones
    this.peon1player1 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(1, 0), TypePlayer.BLACK);
    this.add(this.peon1player1);
    this.peon1player1.position.set(0, 0, 9);

    this.peon2player1 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(1, 1), TypePlayer.BLACK);
    this.add(this.peon2player1);
    this.peon2player1.position.set(9, 0, 9);

    this.peon3player1 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(1, 2), TypePlayer.BLACK);
    this.add(this.peon3player1);
    this.peon3player1.position.set(18, 0, 9);

    this.peon4player1 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(1, 3), TypePlayer.BLACK);
    this.add(this.peon4player1);
    this.peon4player1.position.set(27, 0, 9);
    
    this.peon5player1 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(1, 4), TypePlayer.BLACK);
    this.add(this.peon5player1);
    this.peon5player1.position.set(36, 0, 9);
    
    this.peon6player1 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(1, 5), TypePlayer.BLACK);
    this.add(this.peon6player1);
    this.peon6player1.position.set(45, 0, 9);
    
    this.peon7player1 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(1, 6), TypePlayer.BLACK);
    this.add(this.peon7player1);
    this.peon7player1.position.set(54, 0, 9);
    
    this.peon8player1 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(1, 7), TypePlayer.BLACK);
    this.add(this.peon8player1);
    this.peon8player1.position.set(63, 0, 9);

  }

  createModelsPlayer2()
  {
    var materialBeige = new THREE.MeshStandardMaterial({ color: 0xF5F5DC});
    var materialAux = new THREE.MeshNormalMaterial({ flatShading : true });
    
    // Crear las torres
    this.torre1player2 = new TorreModelo(this.gui, "Controles de la torre", materialAux, new BoardPosition(7, 0), TypePlayer.WHITE);
    this.add(this.torre1player2);
    this.torre1player2.position.set(0, 0, 63);

    this.torre2player2 = new TorreModelo(this.gui, "Controles de la torre", materialAux, new BoardPosition(7, 7), TypePlayer.WHITE);
    this.add(this.torre2player2);
    this.torre2player2.position.set(63, 0, 63);

    // Crear los caballos
    this.caballo1player2 = new CaballoModelo(this.gui, "Controles del caballo", materialAux, new BoardPosition(7, 1), TypePlayer.WHITE);
    this.add(this.caballo1player2);
    this.caballo1player2.rotateY(-Math.PI/2);
    this.caballo1player2.rotateY(Math.PI);
    this.caballo1player2.position.set(9, 0, 63);

    this.caballo2player2 = new CaballoModelo(this.gui, "Controles del caballo", materialAux, new BoardPosition(7, 6), TypePlayer.WHITE);
    this.add(this.caballo2player2);
    this.caballo2player2.rotateY(-Math.PI/2);
    this.caballo2player2.rotateY(Math.PI);
    this.caballo2player2.position.set(54, 0, 63);

    // Crear los alfiles
    this.alfil1player2 = new AlfilModelo(this.gui, "Controles del alfil", materialAux, new BoardPosition(7, 2), TypePlayer.WHITE);
    this.add(this.alfil1player2);
    this.alfil1player2.rotateY(Math.PI);
    this.alfil1player2.position.set(18, 0, 63);

    this.alfil2player2 = new AlfilModelo(this.gui, "Controles del alfil", materialAux, new BoardPosition(7, 5), TypePlayer.WHITE);
    this.add(this.alfil2player2);
    this.alfil2player2.rotateY(Math.PI);
    this.alfil2player2.position.set(45, 0, 63);

    // Crear la dama
    this.damaplayer1 = new ReinaModelo(this.gui, "Controles de la dama", materialAux, new BoardPosition(7, 3), TypePlayer.WHITE);
    this.add(this.damaplayer1);
    this.damaplayer1.rotateY(Math.PI);
    this.damaplayer1.position.set(27, 0, 63);

    // Crear el rey
    this.reyplayer2 = new ReyModelo(this.gui, "Controles del rey", materialAux, new BoardPosition(7, 4), TypePlayer.WHITE);
    this.add(this.reyplayer2);
    this.reyplayer2.rotateY(Math.PI);
    this.reyplayer2.position.set(36, 0, 63);

    // Crear los peones
    this.peon1player2 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(6, 0), TypePlayer.WHITE);
    this.add(this.peon1player2);
    this.peon1player2.rotateY(Math.PI);
    this.peon1player2.position.set(0, 0, 54);

    this.peon2player2 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(6, 1), TypePlayer.WHITE);
    this.add(this.peon2player2);
    this.peon2player2.rotateY(Math.PI);
    this.peon2player2.position.set(9, 0, 54);

    this.peon3player2 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(6, 2), TypePlayer.WHITE);
    this.add(this.peon3player2);
    this.peon3player2.rotateY(Math.PI);
    this.peon3player2.position.set(18, 0, 54);

    this.peon4player2 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(6, 3), TypePlayer.WHITE);
    this.add(this.peon4player2);
    this.peon4player2.rotateY(Math.PI);
    this.peon4player2.position.set(27, 0, 54);

    this.peon5player2 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(6, 4), TypePlayer.WHITE);
    this.add(this.peon5player2);
    this.peon5player2.rotateY(Math.PI);
    this.peon5player2.position.set(36, 0, 54);

    this.peon6player2 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(6, 5), TypePlayer.WHITE);
    this.add(this.peon6player2);
    this.peon6player2.rotateY(Math.PI);
    this.peon6player2.position.set(45, 0, 54);

    this.peon7player2 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(6, 6), TypePlayer.WHITE);
    this.add(this.peon7player2);
    this.peon7player2.rotateY(Math.PI);
    this.peon7player2.position.set(54, 0, 54);

    this.peon8player2 = new PeonModelo(this.gui, "Controles del peón", materialAux, new BoardPosition(6, 7), TypePlayer.WHITE);
    this.add(this.peon8player2);
    this.peon8player2.rotateY(Math.PI);
    this.peon8player2.position.set(63, 0, 54);

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
    // this.alfil.update();
    // this.torre.update();
    // this.dama.update();
    // this.caballo.update();

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
    
    // Que no se nos olvide, la primera visualización.
    scene.update();
  }
);
