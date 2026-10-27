import { TipoJugador, TipoPieza } from './TiposUtils.js';
import { Posicion, Movimiento, Jugada } from './Jugada.js';
import { TorreLogica } from './TorreLogica.js';
import { CaballoLogica } from './CaballoLogica.js';
import { AlfilLogica } from './AlfilLogica.js';
import { ReinaLogica } from './ReinaLogica.js';
import { ReyLogica } from './ReyLogica.js';
import { PeonLogica } from './PeonLogica.js';

export class TableroLogica
{
  constructor()
  {
    this._tablero = Array.from({ length: 8 }, () => Array(8).fill(null));
    this._posicion_rey_blanco = new Posicion(7, 4);
    this._posicion_rey_negro = new Posicion(0, 4);
    this._rey_blanco_jaque = false;
    this._rey_negro_jaque = false;
    this._ultima_jugada = new Jugada(new Movimiento(new Posicion(0, 0), new Posicion(0, 0)));
    this.crearTablero(false);
  }

  getPieza(posicion)
  {
    return this._tablero[posicion.getFila()][posicion.getColumna()];
  }

  getUltimaJugada()
  {
    return this._ultima_jugada;
  }

  estaEnTablero(position)
  {
    return position.getFila() >= 0 && position.getFila() <= 7 && position.getColumna() >= 0 && position.getColumna() <= 7;
  }

  esPosicionNula(posicion)
  {
    return this.estaEnTablero(posicion) && this.getPieza(posicion) === null;
  }

  esPosicionPieza(posicion)
  {
    return this.estaEnTablero(posicion) && this.getPieza(posicion) !== null;
  }

  estaEnJaque(tipo_jugador)
  {
    return tipo_jugador === TipoJugador.BLANCO ? this._rey_blanco_jaque : this._rey_negro_jaque;
  }

  esJudagaPosible(posicion_actual, posicion_siguiente)
  {
    var pieza = this.getPieza(posicion_actual);

    // Si la pieza es nula no hay jugada posible
    if (!pieza) {
      return null;
    }

    // Obtenemos la lista de jugadas posibles para la pieza seleccionada
    var lista_jugadas = pieza.getJugadas(this, posicion_actual);

    // Si el movimiento de alguna jugada coincide con el proporcionado,
    // se devuelve la jugada
    for (let jugada of lista_jugadas) {
      if (jugada.getMovimiento().getPosicionActual().equals(posicion_actual) && jugada.getMovimiento().getPosicionSiguiente().equals(posicion_siguiente)) {
        return jugada;
      }
    }

    return null;
  }

  aplicarJugada(jugada)
  {
    // Si en la jugada se mata a alguna pieza la borramos
    if (jugada.getDisponibleCome()) {
      this.eliminaPieza(jugada.getPosicionCome());
    }

    // Si hay un movimiento extra (el realizado por el enroque) movemos dicha pieza
    if (jugada.getDisponibleExtra()) {
      this.muevePieza(jugada.getMovimientoExtra().getPosicionActual(), jugada.getMovimientoExtra().getPosicionSiguiente());
    }

    // Movemos la pieza
    this.muevePieza(jugada.getMovimiento().getPosicionActual(), jugada.getMovimiento().getPosicionSiguiente());

    // Obtenemos la posicion y pieza de la nueva posición para comprobar
    // si un peon se convierte en reina (solucion temporal) y actualizar
    // la posición del rey
    var posicion = jugada.getMovimiento().getPosicionSiguiente();
    var pieza = this.getPieza(posicion);

    // Peón a reina (solución temporal)
    if (pieza.getTipoPieza() === TipoPieza.PEON) {
      var tipo_jugador = pieza.getTipoJugador();

      if ((tipo_jugador === TipoJugador.BLANCO && posicion.getFila() === 0) || (tipo_jugador === TipoJugador.NEGRO && posicion.getFila() === 7)) {
        this.eliminaPieza(posicion);
        this._tablero[posicion.getFila()][posicion.getColumna()] = new ReinaLogica(tipo_jugador);
      }
    }

    // Actualización de la posición del rey
    if (pieza.getTipoPieza() === TipoPieza.REY) {
      if (pieza.getTipoJugador() === TipoJugador.BLANCO) {
        this._posicion_rey_blanco = posicion;
      } else {
        this._posicion_rey_negro = posicion;
      }
    }

    // Actalizamos las variables restantes
    this._ultima_jugada = jugada;
    this._rey_blanco_jaque = this.getJaque(TipoJugador.BLANCO);
    this._rey_negro_jaque = this.getJaque(TipoJugador.NEGRO);
  }

  eliminaPieza(posicion)
  {
    this._tablero[posicion.getFila()][posicion.getColumna()] = null;
  }

  muevePieza(posicion_actual, posicion_siguiente)
  {
    this._tablero[posicion_siguiente.getFila()][posicion_siguiente.getColumna()] = this._tablero[posicion_actual.getFila()][posicion_actual.getColumna()];
    this._tablero[posicion_actual.getFila()][posicion_actual.getColumna()] = null;
    this._tablero[posicion_siguiente.getFila()][posicion_siguiente.getColumna()].actualizar();
  }

  crearTablero(vacio)
  {
    if (!vacio) {
      this.crearPiezas(TipoJugador.NEGRO, 1, 0, this._posicion_rey_negro);
      this.crearPiezas(TipoJugador.BLANCO, 6, 7, this._posicion_rey_blanco);
    }
  }

  crearPiezas(tipo_jugador, fila_peones, fila_piezas, posicion_rey)
  {
    posicion_rey.actualizar(fila_piezas, 4);

    this._tablero[fila_piezas][0] = new TorreLogica(tipo_jugador);
    this._tablero[fila_piezas][1] = new CaballoLogica(tipo_jugador);
    this._tablero[fila_piezas][2] = new AlfilLogica(tipo_jugador);
    this._tablero[fila_piezas][3] = new ReinaLogica(tipo_jugador);
    this._tablero[fila_piezas][4] = new ReyLogica(tipo_jugador);
    this._tablero[fila_piezas][5] = new AlfilLogica(tipo_jugador);
    this._tablero[fila_piezas][6] = new CaballoLogica(tipo_jugador);
    this._tablero[fila_piezas][7] = new TorreLogica(tipo_jugador);

    for (let i = 0; i < 8; i++) {
      this._tablero[fila_peones][i] = new PeonLogica(tipo_jugador);
    }
  }

  getJaque(tipo_jugador)
  {
    var posicion_rey = tipo_jugador === TipoJugador.BLANCO ? this._posicion_rey_blanco : this._posicion_rey_negro;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        var pieza = this._tablero[r][c];

        if (pieza && pieza.getTipoJugador() !== tipo_jugador) {
          var lista_jugadas_come = pieza.getJugadasCome(this, new Posicion(r, c));

          for (let jugada of lista_jugadas_come) {
            if (jugada.getPosicionCome().equals(posicion_rey)) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  }

  clone() {
    var tablero = new TableroLogica();

    tablero._tablero = Array.from({ length: 8 }, (_, fila) =>
      Array.from({ length: 8 }, (_, columna) => {
        const piece = this._tablero[fila][columna];
        return piece ? piece.clone() : null;
      })
    );

    tablero._posicion_rey_blanco = this._posicion_rey_blanco.clone();
    tablero._posicion_rey_negro = this._posicion_rey_negro.clone();
    tablero._rey_blanco_jaque = this._rey_blanco_jaque;
    tablero._rey_negro_jaque = this._rey_negro_jaque;
    tablero._ultima_jugada = this._ultima_jugada.clone();

    return tablero;
  }
}
