import { PiezaLogica } from './PiezaLogica.js';
import { TipoPieza, TipoJugador } from './TiposUtils.js';
import { Posicion, Movimiento } from './Jugada.js';
import { anadeMovimientoPosicion, anadeMovimientoCome, anadePrimerMovimientoPosicion, anadeMovimientoComeAlPaso } from './MovimientosUtils.js';

export class PeonLogica extends PiezaLogica
{
  constructor(jugador)
  {
    super(jugador, TipoPieza.PEON);
  }

  getPosiblesJugadas(tablero, posicion, come)
  {
    var lista_jugadas = [];
    var nueva_posicion = new Posicion();
    var come_posicion = new Posicion();
    var posicion_vacia = new Posicion();

    if (this._tipo_jugador === TipoJugador.BLANCO) {
      nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna());
      anadeMovimientoPosicion(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna() - 1);
      anadeMovimientoCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna() + 1);
      anadeMovimientoCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() - 2, posicion.getColumna());
      posicion_vacia.actualizar(posicion.getFila() - 1, posicion.getColumna());
      anadePrimerMovimientoPosicion(tablero, new Movimiento(posicion, nueva_posicion), posicion_vacia, come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna() - 1);
      come_posicion.actualizar(posicion.getFila(), posicion.getColumna() - 1);
      anadeMovimientoComeAlPaso(tablero, new Movimiento(posicion, nueva_posicion), come_posicion.clone(), come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna() + 1);
      come_posicion.actualizar(posicion.getFila(), posicion.getColumna() + 1);
      anadeMovimientoComeAlPaso(tablero, new Movimiento(posicion, nueva_posicion), come_posicion.clone(), come, lista_jugadas);
    } else {
      nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna());
      anadeMovimientoPosicion(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna() - 1);
      anadeMovimientoCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna() + 1);
      anadeMovimientoCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() + 2, posicion.getColumna());
      posicion_vacia.actualizar(posicion.getFila() + 1, posicion.getColumna());
      anadePrimerMovimientoPosicion(tablero, new Movimiento(posicion, nueva_posicion), posicion_vacia, come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna() + 1);
      come_posicion.actualizar(posicion.getFila(), posicion.getColumna() + 1);
      anadeMovimientoComeAlPaso(tablero, new Movimiento(posicion, nueva_posicion), come_posicion.clone(), come, lista_jugadas);

      nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna() - 1);
      come_posicion.actualizar(posicion.getFila(), posicion.getColumna() - 1);
      anadeMovimientoComeAlPaso(tablero, new Movimiento(posicion, nueva_posicion), come_posicion.clone(), come, lista_jugadas);
    }

    return lista_jugadas;
  }

  clone()
  {
    return new PeonLogica(this._tipo_jugador);
  }
}
