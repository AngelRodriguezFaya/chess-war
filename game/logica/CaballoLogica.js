import { PiezaLogica } from './PiezaLogica.js';
import { TipoPieza } from './TiposUtils.js';
import { Posicion, Movimiento } from './Jugada.js';
import { anadeMovimientoPosicionCome } from './MovimientosUtils.js';

export class CaballoLogica extends PiezaLogica
{
  constructor(jugador) 
  {
    super(jugador, TipoPieza.CABALLO);
  }

  getPosiblesJugadas(tablero, posicion, come)
  {
    var lista_jugadas = [];
    let nueva_posicion = new Posicion();

    nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna() + 2);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna() - 2);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna() + 2);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna() - 2);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() + 2, posicion.getColumna() + 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() + 2, posicion.getColumna() - 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() - 2, posicion.getColumna() + 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() - 2, posicion.getColumna() - 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    return lista_jugadas;
  }

  clone()
  {
    return new CaballoLogica(this._tipo_jugador);
  }
}
