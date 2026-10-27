import { PiezaLogica } from './PiezaLogica.js';
import { TipoPieza } from './TiposUtils.js';
import { Movimiento } from './Jugada.js';
import { anadeMovimientoPosicionCome } from './MovimientosUtils.js';

export class ReinaLogica extends PiezaLogica
{
  constructor(jugador)
  {
    super(jugador, TipoPieza.REINA);
  }

  getPosiblesJugadas(tablero, posicion, come)
  {
    var lista_jugadas = [];
    var nueva_posicion = posicion.clone();

		do {
			nueva_posicion.actualizar(nueva_posicion.getFila() - 1, posicion.getColumna());
			anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);
		} while (tablero.esPosicionNula(nueva_posicion));

    nueva_posicion = posicion.clone();

		do {
			nueva_posicion.actualizar(nueva_posicion.getFila() + 1, posicion.getColumna());
			anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);
		} while (tablero.esPosicionNula(nueva_posicion));

    nueva_posicion = posicion.clone();

		do {
			nueva_posicion.actualizar(posicion.getFila(), nueva_posicion.getColumna() - 1);
			anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);
		} while (tablero.esPosicionNula(nueva_posicion));

    nueva_posicion = posicion.clone();

		do {
			nueva_posicion.actualizar(posicion.getFila(), nueva_posicion.getColumna() + 1);
			anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);
		} while (tablero.esPosicionNula(nueva_posicion));

    nueva_posicion = posicion.clone();

    do {
			nueva_posicion.actualizar(nueva_posicion.getFila() - 1, nueva_posicion.getColumna() - 1);
			anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);
		} while (tablero.esPosicionNula(nueva_posicion));

    nueva_posicion = posicion.clone();

    do {
			nueva_posicion.actualizar(nueva_posicion.getFila() + 1, nueva_posicion.getColumna() + 1);
			anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);
		} while (tablero.esPosicionNula(nueva_posicion));

    nueva_posicion = posicion.clone();

    do {
			nueva_posicion.actualizar(nueva_posicion.getFila() - 1, nueva_posicion.getColumna() + 1);
			anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);
		} while (tablero.esPosicionNula(nueva_posicion));

    nueva_posicion = posicion.clone();

    do {
			nueva_posicion.actualizar(nueva_posicion.getFila() + 1, nueva_posicion.getColumna() - 1);
			anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);
		} while (tablero.esPosicionNula(nueva_posicion));

    return lista_jugadas;
  }

  clone()
  {
    return new ReinaLogica(this._tipo_jugador);
  }
}
