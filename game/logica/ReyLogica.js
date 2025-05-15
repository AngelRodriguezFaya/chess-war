import { PiezaLogica } from './PiezaLogica.js';
import { TipoPieza } from './TiposUtils.js';
import { Posicion, Movimiento } from './Jugada.js';
import { anadeMovimientoPosicionCome, anadeMovimientoEnroque, anadeMovimientoEnroqueExtra } from './MovimientosUtils.js';

export class ReyLogica extends PiezaLogica
{
  constructor(jugador)
  {
    super(jugador, TipoPieza.REY);
  }

  getPosiblesJugadas(tablero, posicion, come)
  {
    var lista_jugadas = [];
    var nueva_posicion = new Posicion();
    var posicion_extra = new Posicion();
    var nueva_posicion_extra = new Posicion();
    var posicion_vacia = new Posicion();
    
    nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna() + 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna() - 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna() + 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna() - 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() + 1, posicion.getColumna());
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila() - 1, posicion.getColumna());
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila(), posicion.getColumna() + 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);

    nueva_posicion.actualizar(posicion.getFila(), posicion.getColumna() - 1);
    anadeMovimientoPosicionCome(tablero, new Movimiento(posicion, nueva_posicion), come, lista_jugadas);
    
    nueva_posicion.actualizar(posicion.getFila(), posicion.getColumna() + 2);
    posicion_extra.actualizar(posicion.getFila(), posicion.getColumna() + 3);
    nueva_posicion_extra.actualizar(posicion.getFila(), posicion.getColumna() + 1);
    anadeMovimientoEnroque(tablero, new Movimiento(posicion, nueva_posicion), new Movimiento(posicion_extra, nueva_posicion_extra), come, lista_jugadas);
    
    nueva_posicion.actualizar(posicion.getFila(), posicion.getColumna() - 2);
    posicion_extra.actualizar(posicion.getFila(), posicion.getColumna() - 4);
    nueva_posicion_extra.actualizar(posicion.getFila(), posicion.getColumna() - 1);
    posicion_vacia.actualizar(posicion.getFila(), posicion.getColumna() - 3);
    anadeMovimientoEnroqueExtra(tablero, new Movimiento(posicion, nueva_posicion), new Movimiento(posicion_extra, nueva_posicion_extra), posicion_vacia, come, lista_jugadas);

    return lista_jugadas;
  }

  clone()
  {
    return new ReyLogica(this._tipo_jugador);
  }
}
