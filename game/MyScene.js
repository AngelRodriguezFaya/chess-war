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

class Escena extends THREE.Scene
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
    this.inicializarRenderizador(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.inicializarGUI();

    // Inicializamos el picking
    this.inicializarPicking();

    // Tendremos una cámara con un control de movimiento con el ratón
    this.inicializarCamaras();

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta.
    // Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con this.add(variable)
    this.inicializarLuces();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Todas las unidades están en metros
    this.inicializarEjes();
    
    // Creamos las figuras y el tablero
    this.inicializarModelos();

    // Inicializado de la lógica del juego
    this.inicializarLogicaJuego();
  }

  /*############################################################################*/
  // Renderizador

  inicializarRenderizador(myCanvas)
  {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    // Se instancia un Renderer WebGL
    this.renderizador = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    this.renderizador.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    this.renderizador.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(this.renderizador.domElement); 
  }
  
  setAspectoCamara(proporcion)
  {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camara.aspect = proporcion;

    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camara.updateProjectionMatrix();
  }
  
  eventoRedimensionVentana()
  {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setAspectoCamara(window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderizador.setSize(window.innerWidth, window.innerHeight);
  }

  /*############################################################################*/
  // Interfaz de usuario
  
  inicializarGUI()
  {
    // Se crea la interfaz gráfica de usuario
    this.gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    // En el contexto de una función this alude a la función
    this.controles_gui = {
      lightPower : 50000.0,
      ambientIntensity : 0.0,   
    }

    // Se crea una sección para los controles de esta clase
    var carpeta = this.gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la potencia de la luz puntual
    carpeta.add(this.controles_gui, 'lightPower', 0, 100000, 50)
      .name('Luz puntual : ')
      .onChange((value) => this.setFuerzaLuzPuntual(value));
    
    // Otro para la intensidad de la luz ambiental
    carpeta.add(this.controles_gui, 'ambientIntensity', 0, 3, 0.05)
      .name('Luz ambiental: ')
      .onChange((value) => this.setIntensidadLuzAmbiente(value));
  }

  /*############################################################################*/
  // Picking

  inicializarPicking()
  {
    this.lanzador_rayos = new THREE.Raycaster();
    this.raton = new THREE.Vector2();
  }

  encontrarObjeto(evento, lista_tipo_piezas, tipo_jugador)
  {
    // Obtenemos la posición del click en coordenadas normalizadas
    var rectangulo = this.renderizador.domElement.getBoundingClientRect();
    this.raton.x = 2*((evento.clientX - rectangulo.left) / rectangulo.width) - 1;
    this.raton.y = 1 - 2*((evento.clientY - rectangulo.top) / rectangulo.height);

    // Se actualiza un rayo que parte de la cámara y que pasa por la
    // posición donde se ha hecho el clic
    this.lanzador_rayos.setFromCamera(this.raton, this.camara);

    // Buscamos los objetos que son intersectados por el rayo
    var objetos_encontrados = this.lanzador_rayos.intersectObjects(this.children, true);

    // Buscamos el primer objeto cuyo tipo se encuentre en la lista de piezas
    for (let i = 0; i < objetos_encontrados.length; i++) {
      var objeto = objetos_encontrados[i].object.userData;

      if (objeto instanceof PiezaBaseModelo) {
        if (lista_tipo_piezas.includes(objeto.getTipoPieza())) {
          if (objeto.getTipoJugador() === tipo_jugador) {
            return objeto;
          }
        }
      }
    }

    return null;
  }

  eventoRatonClicArriba(evento)
  {
    switch (this.estado_aplicacion) {
      case (Escena.SELECCIONANDO_PIEZA):
        // Tratamos de seleccionar solo las fichas del juego
        var objeto = this.encontrarObjeto(evento, [TipoPieza.TORRE, TipoPieza.CABALLO, TipoPieza.ALFIL, TipoPieza.REINA, TipoPieza.REY, TipoPieza.PEON], this.jugador_actual);
        
        // Comprobamos si hemos seleccionado algun objeto
        if (objeto !== null) {
          // Obtenemos la posición en el tablero
          var posicion_tablero = objeto.getPosicionTablero();

          // Obtenemos las jugadas disponibles de la pieza
          var jugadas_posibles = this.tablero_logica.getPieza(posicion_tablero).getJugadas(this.tablero_logica, posicion_tablero);
          
          // Solo podemos seleccionar la pieza si tiene jugadas posibles
          if (jugadas_posibles.length > 0) {
            // Guardamos una referencia a la pieza seleccionada
            this.pieza_seleccionada = objeto;

            // Cambiamos de estado
            this.estado_aplicacion = Escena.SELECCIONANDO_CASILLA;
          }
        }

        break;
      
      case (Escena.SELECCIONANDO_CASILLA):
        // Tratamos de seleccionar solo las fichas del juego
        var objeto = this.encontrarObjeto(evento, [TipoPieza.CASILLA], TipoJugador.DESCONOCIDO);

        // Comprobamos si hemos seleccionado algun objeto
        if (objeto !== null) {
          // Compromabos si hemos seleccionado la misma casilla de la pieza. Si es así
          // Volvemos a seleccionar una pieza del mismo jugador
          if (this.pieza_seleccionada.getPosicionTablero().equals(objeto.getPosicionTablero())) {
            // Deleccionamos la pieza y cambiamos de estado
            this.pieza_seleccionada = null;
            this.estado_aplicacion = Escena.SELECCIONANDO_PIEZA;
          }
          else {
            // Tratamos de realizar la jugada desde la posición de la pieza seleccionada a la nueva posición
            var jugada = this.tablero_logica.esJudagaPosible(this.pieza_seleccionada.getPosicionTablero(), objeto.getPosicionTablero())

            if (jugada !== null) {
              var pieza_atacante = objeto;
              var pieza_atacada = null;

              // Ejecutar la animación de ataque del peón
              if (this.tablero_logica.getPieza(jugada.getMovimiento().getPosicionActual()).getTipoPieza() === TipoPieza.PEON && jugada.getDisponibleCome() &&
                 this.tablero_logica.getPieza(jugada.getPosicionCome()).getTipoPieza() === TipoPieza.PEON)
              {
              }

              // Ejecutamos el movimiento
              this.tablero_logica.aplicarJugada(jugada);

              // Si en la jugada se mata a alguna pieza la borramos
              if (jugada.getDisponibleCome()) {
                this.tablero.eliminaPieza(jugada.getPosicionCome());
              }

              // Si hay un movimiento extra (el realizado por el enroque) movemos dicha pieza
              if (jugada.getDisponibleExtra()) {
                this.tablero.muevePieza(jugada.getMovimientoExtra().getPosicionActual(), jugada.getMovimientoExtra().getPosicionSiguiente());
              }

              // Movemos la pieza
              this.tablero.muevePieza(this.pieza_seleccionada.getPosicionTablero(), objeto.getPosicionTablero());

              // Obtenemos la posicion y pieza de la nueva posición para comprobar
              // si un peon se convierte en reina (solucion temporal) y actualizar
              // la posición del rey
              //                 IMPLEMENTAR

              // Reseteamos el color del tablero, puesto que la pieza ya se ha movido
              this.tablero.reseteaColorCasillas();

              // Deseleccionamos la pieza y cambiamos de estado
              this.pieza_seleccionada = null;
              this.estado_aplicacion = Escena.SELECCIONANDO_PIEZA;

              // Cambiamos de turno y de estado
              if (this.jugador_actual === TipoJugador.BLANCO) {
                this.jugador_actual = TipoJugador.NEGRO;
              }
              else {
                this.jugador_actual = TipoJugador.BLANCO;
              }
            }
          }
        }

        break;
    }
  }

  eventoRatonMovimiento(evento)
  {
    switch (this.estado_aplicacion) {
      case (Escena.SELECCIONANDO_PIEZA):
        // Tratamos de seleccionar solo las fichas del juego
        var objeto = this.encontrarObjeto(evento, [TipoPieza.TORRE, TipoPieza.CABALLO, TipoPieza.ALFIL, TipoPieza.REINA, TipoPieza.REY, TipoPieza.PEON], this.jugador_actual);

        // Comprobamos si hemos seleccionado algun objeto
        if (objeto !== null) {
          // Obtenemos la posición en el tablero
          var posicion_tablero = objeto.getPosicionTablero();

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
  // Cámaras
  
  inicializarCamaras()
  {
    // Para crear una cámara le indicamos:
    // El ángulo del campo de visión en grados sexagesimales
    // La razón de aspecto ancho/alto
    // Los planos de recorte cercano y lejano
    this.camara = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    //this.camera = new THREE.OrthographicCamera(10 * (window.innerWidth / window.innerHeight) / -2, 10 * (window.innerWidth / window.innerHeight) / 2, 10 / 2, 10 / -2, 0.1, 1000);

    // Recuerda: Todas las unidades están en metros
    // También se indica dónde se coloca
    // this.camera.position.set(16, 30, 62);
    this.camara.position.set(33.75, 100, 90);
    
    // Y hacia dónde mira
    // var look = new THREE.Vector3(16, 0, 16); // Hacia el centro del tablero
    var punto_a_mirar = new THREE.Vector3(33.75, 10, 33.75); 
    this.camara.lookAt(punto_a_mirar);
    this.add(this.camara);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    /*this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);

    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 1.5;
    this.cameraControl.zoomSpeed = -1.5;
    this.cameraControl.panSpeed = 0.5;

    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;*/
  }

  getCamara()
  {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camara;
  }

  /*############################################################################*/
  // Luces de la escena

  inicializarLuces()
  {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera
    // directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como var y va a ser una variable local a este método
    // Se hace así puesto que no va a ser accedida desde otros métodos
    this.luz_ambiente = new THREE.AmbientLight('white', this.controles_gui.ambientIntensity);

    // La añadimos a la escena
    this.add(this.luz_ambiente);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.luz_puntual = new THREE.PointLight(0xffffff);
    this.luz_puntual.power = this.controles_gui.lightPower;
    this.luz_puntual.position.set(30, 25, 30);
    this.add(this.luz_puntual);
  }

  setFuerzaLuzPuntual(valor)
  {
    this.luz_puntual.power = valor;
  }

  setIntensidadLuzAmbiente(valor)
  {
    this.luz_ambiente.intensity = valor;
  }

  /*############################################################################*/
  // Ejes de la escena

  inicializarEjes()
  {
    // Ejes para el modelo
    //this.axis = new THREE.AxesHelper(50);
    //this.axis.translateY(0.1);
    //this.add(this.axis);
  }

  /*############################################################################*/
  // Modelos

  inicializarModelos()
  {
    this.tablero = new TableroModelo();
    this.add(this.tablero);
  }

  /*############################################################################*/
  // Lógica del juego

  inicializarLogicaJuego()
  {
    // Creamos el 'tablero' que lleva la lógica del juego
    this.tablero_logica = new TableroLogica();

    // Manejo de las piezas seleccionadas
    this.pieza_seleccionada = null;
    this.jugador_actual = TipoJugador.BLANCO;

    // Inicializamos el estado actual de la aplicación
    this.estado_aplicacion = Escena.SELECCIONANDO_PIEZA;
  }

  /*############################################################################*/
  // Método update de la escena

  actualizar()
  {
    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la posición de la cámara según su controlador
    //this.cameraControl.update();

    // Se actualiza el tablero
    this.tablero.actualizar();
    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderizador.render(this, this.getCamara());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea, update() se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.actualizar())
  }
}





/*############################################################################*/
// Función main

$(
  function ()
  {
    // Se instancia la escena pasándole el div que se ha creado en el html para visualizar
    var escena = new Escena("#WebGL-output");

    // Se añaden los listener de la aplicación.
    window.addEventListener("resize", () => escena.eventoRedimensionVentana());
    window.addEventListener("mouseup", (event) => escena.eventoRatonClicArriba(event));
    window.addEventListener("mousemove", (event) => escena.eventoRatonMovimiento(event));
    
    // Que no se nos olvide, la primera visualización.
    escena.actualizar();
  }
);
