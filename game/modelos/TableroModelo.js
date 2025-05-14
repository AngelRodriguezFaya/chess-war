/*############################################################################*/
// Importaciones

import * as THREE from '../../libs/three.module.js'
import * as CSG from '../../libs/three-bvh-csg.js'

import { BoardPosition } from '../logica/Movimiento.js';
import { TypePlayer } from '../logica/TiposUtils.js'
import { CasillaModelo } from './CasillaModelo.js';
import { AlfilModelo } from './AlfilModelo.js'
import { TorreModelo } from './TorreModelo.js'
import { ReinaModelo } from './ReinaModelo.js'
import { CaballoModelo } from './CaballoModelo.js'
import { PeonModelo } from './PeonModelo.js'
import { ReyModelo } from './ReyModelo.js'





/*############################################################################*/
// Clase Tablero

export class TableroModelo extends THREE.Object3D
{
  /*############################################################################*/
  // Constructor

  constructor(gui, titleGui)
  {
    // Llamamos al constructor padre
    super();

    // Inicialización de los parámetros
    this.iniParam();
    
    // Se crea la parte de la interfaz de usuario
    this.createGUI(gui, titleGui);

    // Creación del objeto
    this.createObject(gui);
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
  
  createObject(gui)
  {
    this.tablero = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ({ casilla: null, pieza: null })));

    // CONSTANTES
    const ANCHO = 9;
    const ALTO = 2;
    const LARGO = 9;

    // Creamos los materiales
    var materialBeige = new THREE.MeshStandardMaterial({ color: 0xF5F5DC});
    var materialMarrones = new THREE.MeshStandardMaterial({ color: 0x562B05});

    // La construcción de las 64 casillas que forman el tablero (8x8)
    for (let fila = 0; fila < 8; fila++){
      for (let col = 0; col < 8; col++){
        // Alternamos el material de las casillas
        let material = (fila + col) % 2 == 0 ? materialBeige : materialMarrones;

        // Se crea la casilla
        var casilla = new CasillaModelo(gui, `Casilla fila: ${fila} columna: ${col}`, material, ANCHO, ALTO, LARGO, new BoardPosition(fila, col), TypePlayer.UNKNOWN);

        // Se posiciona la casilla
        casilla.position.set(col * ANCHO, -(ALTO/2), fila * LARGO);

        // Se añade la casilla al tablero
        this.add(casilla);

        // Guardamos la casilla en el tablero
        this.tablero[fila][col].casilla = casilla;
      }
    }





    var materialBeige = new THREE.MeshStandardMaterial({ color: 0xF5F5DC});
    var materialAux = new THREE.MeshNormalMaterial({ flatShading : true });

    // Material para piezas marrón muy claro
    const lightBrownMaterial = new THREE.MeshStandardMaterial({
      color: 0xD3B683
    });

    // Material para piezas marrón muy oscuro
    const darkBrownMaterial = new THREE.MeshStandardMaterial({
      color: 0x341C02
    });

    // Crear las torres
    var torre1player1_pos = new BoardPosition(0, 0);
    this.torre1player1 = new TorreModelo(this.gui, "Controles de la torre", darkBrownMaterial, torre1player1_pos, TypePlayer.BLACK);
    this.add(this.torre1player1);
    this.torre1player1.position.set(0, 0, 0);
    this.tablero[torre1player1_pos.row()][torre1player1_pos.column()].pieza = this.torre1player1;

    var torre2player1_pos = new BoardPosition(0, 7);
    this.torre2player1 = new TorreModelo(this.gui, "Controles de la torre", darkBrownMaterial, torre2player1_pos, TypePlayer.BLACK);
    this.add(this.torre2player1);
    this.torre2player1.position.set(63, 0, 0);
    this.tablero[torre2player1_pos.row()][torre2player1_pos.column()].pieza = this.torre2player1;

    // Crear los caballos
    var caballo1player1_pos = new BoardPosition(0, 1);
    this.caballo1player1 = new CaballoModelo(this.gui, "Controles del caballo", darkBrownMaterial, caballo1player1_pos, TypePlayer.BLACK);
    this.add(this.caballo1player1);
    this.caballo1player1.rotateY(-Math.PI/2);
    this.caballo1player1.position.set(9, 0, 0);
    this.tablero[caballo1player1_pos.row()][caballo1player1_pos.column()].pieza = this.caballo1player1;

    var caballo2player1_pos = new BoardPosition(0, 6);
    this.caballo2player1 = new CaballoModelo(this.gui, "Controles del caballo", darkBrownMaterial, caballo2player1_pos, TypePlayer.BLACK);
    this.add(this.caballo2player1);
    this.caballo2player1.rotateY(-Math.PI/2);
    this.caballo2player1.position.set(54, 0, 0);
    this.tablero[caballo2player1_pos.row()][caballo2player1_pos.column()].pieza = this.caballo2player1;

    // Crear los alfiles
    var alfil1player1_pos = new BoardPosition(0, 2);
    this.alfil1player1 = new AlfilModelo(this.gui, "Controles del alfil", darkBrownMaterial, alfil1player1_pos, TypePlayer.BLACK);
    this.add(this.alfil1player1);
    this.alfil1player1.position.set(18, 0, 0);
    this.tablero[alfil1player1_pos.row()][alfil1player1_pos.column()].pieza = this.alfil1player1;

    var alfil2player1_pos = new BoardPosition(0, 5);
    this.alfil2player1 = new AlfilModelo(this.gui, "Controles del alfil", darkBrownMaterial, alfil2player1_pos, TypePlayer.BLACK);
    this.add(this.alfil2player1);
    this.alfil2player1.position.set(45, 0, 0);
    this.tablero[alfil2player1_pos.row()][alfil2player1_pos.column()].pieza = this.alfil2player1;

    // Crear la dama
    var damaplayer1_pos = new BoardPosition(0, 3);
    this.damaplayer1 = new ReinaModelo(this.gui, "Controles de la dama", darkBrownMaterial, damaplayer1_pos, TypePlayer.BLACK);
    this.add(this.damaplayer1);
    this.damaplayer1.position.set(27, 0, 0);
    this.tablero[damaplayer1_pos.row()][damaplayer1_pos.column()].pieza = this.damaplayer1;

    // Crear el rey
    var reyplayer1_pos = new BoardPosition(0, 4);
    this.reyplayer1 = new ReyModelo(this.gui, "Controles del rey", darkBrownMaterial, reyplayer1_pos, TypePlayer.BLACK);
    this.add(this.reyplayer1);
    this.reyplayer1.position.set(36, 0, 0);
    this.tablero[reyplayer1_pos.row()][reyplayer1_pos.column()].pieza = this.reyplayer1;

    // Crear los peones
    var peon1player1_pos = new BoardPosition(1, 0);
    this.peon1player1 = new PeonModelo(this.gui, "Controles del peón", darkBrownMaterial, peon1player1_pos, TypePlayer.BLACK);
    this.add(this.peon1player1);
    this.peon1player1.position.set(0, 0, 9);
    this.tablero[peon1player1_pos.row()][peon1player1_pos.column()].pieza = this.peon1player1;

    var peon2player1_pos = new BoardPosition(1, 1);
    this.peon2player1 = new PeonModelo(this.gui, "Controles del peón", darkBrownMaterial, peon2player1_pos, TypePlayer.BLACK);
    this.add(this.peon2player1);
    this.peon2player1.position.set(9, 0, 9);
    this.tablero[peon2player1_pos.row()][peon2player1_pos.column()].pieza = this.peon2player1;

    var peon3player1_pos = new BoardPosition(1, 2);
    this.peon3player1 = new PeonModelo(this.gui, "Controles del peón", darkBrownMaterial, peon3player1_pos, TypePlayer.BLACK);
    this.add(this.peon3player1);
    this.peon3player1.position.set(18, 0, 9);
    this.tablero[peon3player1_pos.row()][peon3player1_pos.column()].pieza = this.peon3player1;

    var peon4player1_pos = new BoardPosition(1, 3);
    this.peon4player1 = new PeonModelo(this.gui, "Controles del peón", darkBrownMaterial, peon4player1_pos, TypePlayer.BLACK);
    this.add(this.peon4player1);
    this.peon4player1.position.set(27, 0, 9);
    this.tablero[peon4player1_pos.row()][peon4player1_pos.column()].pieza = this.peon4player1;
    
    var peon5player1_pos = new BoardPosition(1, 4);
    this.peon5player1 = new PeonModelo(this.gui, "Controles del peón", darkBrownMaterial, peon5player1_pos, TypePlayer.BLACK);
    this.add(this.peon5player1);
    this.peon5player1.position.set(36, 0, 9);
    this.tablero[peon5player1_pos.row()][peon5player1_pos.column()].pieza = this.peon5player1;
    
    var peon6player1_pos = new BoardPosition(1, 5);
    this.peon6player1 = new PeonModelo(this.gui, "Controles del peón", darkBrownMaterial, peon6player1_pos, TypePlayer.BLACK);
    this.add(this.peon6player1);
    this.peon6player1.position.set(45, 0, 9);
    this.tablero[peon6player1_pos.row()][peon6player1_pos.column()].pieza = this.peon6player1;
    
    var peon7player1_pos = new BoardPosition(1, 6);
    this.peon7player1 = new PeonModelo(this.gui, "Controles del peón", darkBrownMaterial, peon7player1_pos, TypePlayer.BLACK);
    this.add(this.peon7player1);
    this.peon7player1.position.set(54, 0, 9);
    this.tablero[peon7player1_pos.row()][peon7player1_pos.column()].pieza = this.peon7player1;
    
    var peon8player1_pos = new BoardPosition(1, 7);
    this.peon8player1 = new PeonModelo(this.gui, "Controles del peón", darkBrownMaterial, peon8player1_pos, TypePlayer.BLACK);
    this.add(this.peon8player1);
    this.peon8player1.position.set(63, 0, 9);
    this.tablero[peon8player1_pos.row()][peon8player1_pos.column()].pieza = this.peon8player1;





    // Crear las torres
    var torre1player2_pos = new BoardPosition(7, 0);
    this.torre1player2 = new TorreModelo(this.gui, "Controles de la torre", lightBrownMaterial, torre1player2_pos, TypePlayer.WHITE);
    this.add(this.torre1player2);
    this.torre1player2.position.set(0, 0, 63);
    this.tablero[torre1player2_pos.row()][torre1player2_pos.column()].pieza = this.torre1player2;

    var torre2player2_pos = new BoardPosition(7, 7);
    this.torre2player2 = new TorreModelo(this.gui, "Controles de la torre", lightBrownMaterial, torre2player2_pos, TypePlayer.WHITE);
    this.add(this.torre2player2);
    this.torre2player2.position.set(63, 0, 63);
    this.tablero[torre2player2_pos.row()][torre2player2_pos.column()].pieza = this.torre2player2;

    // Crear los caballos
    var caballo1player2_pos = new BoardPosition(7, 1);
    this.caballo1player2 = new CaballoModelo(this.gui, "Controles del caballo", lightBrownMaterial, caballo1player2_pos, TypePlayer.WHITE);
    this.add(this.caballo1player2);
    this.caballo1player2.rotateY(-Math.PI/2);
    this.caballo1player2.rotateY(Math.PI);
    this.caballo1player2.position.set(9, 0, 63);
    this.tablero[caballo1player2_pos.row()][caballo1player2_pos.column()].pieza = this.caballo1player2;

    var caballo2player2_pos = new BoardPosition(7, 6);
    this.caballo2player2 = new CaballoModelo(this.gui, "Controles del caballo", lightBrownMaterial, caballo2player2_pos, TypePlayer.WHITE);
    this.add(this.caballo2player2);
    this.caballo2player2.rotateY(-Math.PI/2);
    this.caballo2player2.rotateY(Math.PI);
    this.caballo2player2.position.set(54, 0, 63);
    this.tablero[caballo2player2_pos.row()][caballo2player2_pos.column()].pieza = this.caballo2player2;

    // Crear los alfiles
    var alfil1player2_pos = new BoardPosition(7, 2);
    this.alfil1player2 = new AlfilModelo(this.gui, "Controles del alfil", lightBrownMaterial, alfil1player2_pos, TypePlayer.WHITE);
    this.add(this.alfil1player2);
    this.alfil1player2.rotateY(Math.PI);
    this.alfil1player2.position.set(18, 0, 63);
    this.tablero[alfil1player2_pos.row()][alfil1player2_pos.column()].pieza = this.alfil1player2;

    var alfil2player2_pos = new BoardPosition(7, 5);
    this.alfil2player2 = new AlfilModelo(this.gui, "Controles del alfil", lightBrownMaterial, alfil2player2_pos, TypePlayer.WHITE);
    this.add(this.alfil2player2);
    this.alfil2player2.rotateY(Math.PI);
    this.alfil2player2.position.set(45, 0, 63);
    this.tablero[alfil2player2_pos.row()][alfil2player2_pos.column()].pieza = this.alfil2player2;

    // Crear la dama
    var damaplayer1_pos = new BoardPosition(7, 3);
    this.damaplayer1 = new ReinaModelo(this.gui, "Controles de la dama", lightBrownMaterial, damaplayer1_pos, TypePlayer.WHITE);
    this.add(this.damaplayer1);
    this.damaplayer1.rotateY(Math.PI);
    this.damaplayer1.position.set(27, 0, 63);
    this.tablero[damaplayer1_pos.row()][damaplayer1_pos.column()].pieza = this.damaplayer1;

    // Crear el rey
    var reyplayer2_pos = new BoardPosition(7, 4);
    this.reyplayer2 = new ReyModelo(this.gui, "Controles del rey", lightBrownMaterial, reyplayer2_pos, TypePlayer.WHITE);
    this.add(this.reyplayer2);
    this.reyplayer2.rotateY(Math.PI);
    this.reyplayer2.position.set(36, 0, 63);
    this.tablero[reyplayer2_pos.row()][reyplayer2_pos.column()].pieza = this.reyplayer2;

    // Crear los peones
    var peon1player2_pos = new BoardPosition(6, 0);
    this.peon1player2 = new PeonModelo(this.gui, "Controles del peón", lightBrownMaterial, peon1player2_pos, TypePlayer.WHITE);
    this.add(this.peon1player2);
    this.peon1player2.rotateY(Math.PI);
    this.peon1player2.position.set(0, 0, 54);
    this.tablero[peon1player2_pos.row()][peon1player2_pos.column()].pieza = this.peon1player2;

    var peon2player2_pos = new BoardPosition(6, 1);
    this.peon2player2 = new PeonModelo(this.gui, "Controles del peón", lightBrownMaterial, peon2player2_pos, TypePlayer.WHITE);
    this.add(this.peon2player2);
    this.peon2player2.rotateY(Math.PI);
    this.peon2player2.position.set(9, 0, 54);
    this.tablero[peon2player2_pos.row()][peon2player2_pos.column()].pieza = this.peon2player2;

    var peon3player2_pos = new BoardPosition(6, 2);
    this.peon3player2 = new PeonModelo(this.gui, "Controles del peón", lightBrownMaterial, peon3player2_pos, TypePlayer.WHITE);
    this.add(this.peon3player2);
    this.peon3player2.rotateY(Math.PI);
    this.peon3player2.position.set(18, 0, 54);
    this.tablero[peon3player2_pos.row()][peon3player2_pos.column()].pieza = this.peon3player2;

    var peon4player2_pos = new BoardPosition(6, 3);
    this.peon4player2 = new PeonModelo(this.gui, "Controles del peón", lightBrownMaterial, peon4player2_pos, TypePlayer.WHITE);
    this.add(this.peon4player2);
    this.peon4player2.rotateY(Math.PI);
    this.peon4player2.position.set(27, 0, 54);
    this.tablero[peon4player2_pos.row()][peon4player2_pos.column()].pieza = this.peon4player2;

    var peon5player2_pos = new BoardPosition(6, 4);
    this.peon5player2 = new PeonModelo(this.gui, "Controles del peón", lightBrownMaterial, peon5player2_pos, TypePlayer.WHITE);
    this.add(this.peon5player2);
    this.peon5player2.rotateY(Math.PI);
    this.peon5player2.position.set(36, 0, 54);
    this.tablero[peon5player2_pos.row()][peon5player2_pos.column()].pieza = this.peon5player2;

    var peon6player2_pos = new BoardPosition(6, 5);
    this.peon6player2 = new PeonModelo(this.gui, "Controles del peón", lightBrownMaterial, peon6player2_pos, TypePlayer.WHITE);
    this.add(this.peon6player2);
    this.peon6player2.rotateY(Math.PI);
    this.peon6player2.position.set(45, 0, 54);
    this.tablero[peon6player2_pos.row()][peon6player2_pos.column()].pieza = this.peon6player2;

    var peon7player2_pos = new BoardPosition(6, 6);
    this.peon7player2 = new PeonModelo(this.gui, "Controles del peón", lightBrownMaterial, peon7player2_pos, TypePlayer.WHITE);
    this.add(this.peon7player2);
    this.peon7player2.rotateY(Math.PI);
    this.peon7player2.position.set(54, 0, 54);
    this.tablero[peon7player2_pos.row()][peon7player2_pos.column()].pieza = this.peon7player2;

    var peon8player2_pos = new BoardPosition(6, 7);
    this.peon8player2 = new PeonModelo(this.gui, "Controles del peón", lightBrownMaterial, peon8player2_pos, TypePlayer.WHITE);
    this.add(this.peon8player2);
    this.peon8player2.rotateY(Math.PI);
    this.peon8player2.position.set(63, 0, 54);
    this.tablero[peon8player2_pos.row()][peon8player2_pos.column()].pieza = this.peon8player2;
  }

  /*############################################################################*/
  // Acceso al tablero

  getCasillaPieza(fila, columna)
  {
    return this.tablero[fila][columna];
  }

  eliminaPieza(fila, columna)
  {
    const cell = this.getCasillaPieza(fila, columna);
    const pieza = cell.pieza;
    if (!pieza) return;

    // 1. Remover del object graph
    this.remove(pieza);

    // 2. Disponer memoria GPU
    pieza.traverse(child => {
      if (child.isMesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            mat.dispose();
            mat.map?.dispose();
          });
        } else {
          child.material?.dispose();
          child.material?.map?.dispose();
        }
      }
    });

    // 3. Limpiar referencias
    cell.pieza = null;
  }

  muevePieza(fila1, columna1, fila2, columna2)
  {
    this.tablero[fila2][columna2].pieza = this.tablero[fila1][columna1].pieza;
    this.tablero[fila1][columna1].pieza = null;
  }

  /*############################################################################*/
  // Método update del objeto

  update()
  {
  }
}
