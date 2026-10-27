import { Jugada } from './Jugada.js';
import { TipoPieza } from './TiposUtils.js';

export function anadeJugada(tablero, jugada, come, lista_jugadas)
{
  if (come) {
    // Si la jugada se mata a alguna pieza
    if (jugada.getDisponibleCome()) {
      lista_jugadas.push(jugada);
    }
  } else {
    var tablero_tmp = tablero.clone();
    tablero_tmp.aplicarJugada(jugada);
    
    // Si la jugada no provoca un autojaque la guardamos
    if (!tablero_tmp.estaEnJaque(tablero_tmp.getPieza(jugada.getMovimiento().getPosicionSiguiente()).getTipoJugador())) {
      lista_jugadas.push(jugada);
    }
  }
}

export function anadeMovimientoPosicion(tablero, movimiento, come, lista_jugadas)
{
  // La pieza debe estar en la posición actual y la posición siguiente vacia
  if (!tablero.esPosicionPieza(movimiento.getPosicionActual()) || !tablero.esPosicionNula(movimiento.getPosicionSiguiente())) {
    return;
  }
  
  // Creamos y añadimos la jugada
  var jugada = new Jugada(movimiento);

  anadeJugada(tablero, jugada, come, lista_jugadas);
}

export function anadeMovimientoCome(tablero, movimiento, come, lista_jugadas)
{
  // La posición actual y la siguiente deben estar ocupadas
  if (!tablero.esPosicionPieza(movimiento.getPosicionActual()) || !tablero.esPosicionPieza(movimiento.getPosicionSiguiente())) {
    return;
  }

  // Los tipos de jugador de ambas piezas debe ser diferentes
  if (tablero.getPieza(movimiento.getPosicionActual()).getTipoJugador() === tablero.getPieza(movimiento.getPosicionSiguiente()).getTipoJugador()) {
    return;
  }

  // Creamos y añadimos la jugada
  var jugada = new Jugada(movimiento);
  jugada.setPosicionCome(movimiento.getPosicionSiguiente());

  anadeJugada(tablero, jugada, come, lista_jugadas);
}



export function anadeMovimientoPosicionCome(tablero, movimiento, come, lista_jugadas)
{
  // Se crean las jugadas dependiendo de si se pide que 'coman'
  anadeMovimientoPosicion(tablero, movimiento, come, lista_jugadas);
  anadeMovimientoCome(tablero, movimiento, come, lista_jugadas);
}

export function anadePrimerMovimientoPosicion(tablero, movimiento, posicion_vacia, come, lista_jugadas)
{
  // La pieza debe estar en la posición actual, la posición siguiente y vacia nulas
  if (!tablero.esPosicionPieza(movimiento.getPosicionActual()) || !tablero.esPosicionNula(movimiento.getPosicionSiguiente()) || !tablero.esPosicionNula(posicion_vacia)) {
    return;
  }

  // La pieza no se debe haber movido aún
  if (tablero.getPieza(movimiento.getPosicionActual()).getNumeroMovimientos() !== 0) {
    return;
  }

  // Creamos y añadimos la jugada
  var jugada = new Jugada(movimiento);
  anadeJugada(tablero, jugada, come, lista_jugadas);
}

export function anadeMovimientoComeAlPaso(tablero, movimiento, posicion_come, come, lista_jugadas)
{
  // La pieza debe estar en la posición actual, la siguiente vacía y la pieza que se va a comer en su posición
  if (!tablero.esPosicionPieza(movimiento.getPosicionActual()) || !tablero.esPosicionNula(movimiento.getPosicionSiguiente()) || !tablero.esPosicionPieza(posicion_come)) {
    return;
  }

  // Las dos piezas deben ser peones
  if (tablero.getPieza(movimiento.getPosicionActual()).getTipoPieza() !== TipoPieza.PEON || tablero.getPieza(posicion_come).getTipoPieza() !== TipoPieza.PEON) {
    return;
  }

  // Posición de la última jugada debe ser igual a la posición donde se va a comer
  if (posicion_come.notEquals(tablero.getUltimaJugada().getMovimiento().getPosicionSiguiente())) {
    return;
  }

  // Los tipos de jugador de ambas piezas debe ser diferentes
  if (tablero.getPieza(movimiento.getPosicionActual()).getTipoJugador() === tablero.getPieza(posicion_come).getTipoJugador()) {
    return;
  }

  // Debe ser el movimiento de la pieza que se va a comer
  if (tablero.getPieza(posicion_come).getNumeroMovimientos() !== 1) {
    return;
  }

  // Debe ocurrir en las filas 3 o 4
  if (posicion_come.getFila() !== 3 && posicion_come.getFila() !== 4) {
    return;
  }

  // Creamos y añadimos la jugada
  var jugada = new Jugada(movimiento);
  jugada.setPosicionCome(posicion_come);
  
  anadeJugada(tablero, jugada, come, lista_jugadas);
}

export function anadeMovimientoEnroque(tablero, movimiento, movimiento_extra, come, lista_jugadas)
{
  // Las dos piezas deben existir y sus posicion futuras estar vacia
  if (!tablero.esPosicionPieza(movimiento.getPosicionActual()) || !tablero.esPosicionNula(movimiento.getPosicionSiguiente()) ||
      !tablero.esPosicionPieza(movimiento_extra.getPosicionActual()) || !tablero.esPosicionNula(movimiento_extra.getPosicionSiguiente())) {
    return;
  }

  // Los tipos deben ser rey y torre
  if (tablero.getPieza(movimiento.getPosicionActual()).getTipoPieza() !== TipoPieza.REY && tablero.getPieza(movimiento.getPosicionActual()).getTipoPieza() !== TipoPieza.TORRE) {
    return;
  }
  
  if (tablero.getPieza(movimiento_extra.getPosicionActual()).getTipoPieza() !== TipoPieza.REY && tablero.getPieza(movimiento_extra.getPosicionActual()).getTipoPieza() !== TipoPieza.TORRE) {
    return;
  }

  // Las piezas no se dben haber movido
  if (tablero.getPieza(movimiento.getPosicionActual()).getNumeroMovimientos() !== 0 || tablero.getPieza(movimiento_extra.getPosicionActual()).getNumeroMovimientos() !== 0) {
    return;
  }

  // Creamos y añadimos la jugada
  let jugada = new Jugada(movimiento);
  jugada.setMovimientoExtra(movimiento_extra);

  anadeJugada(tablero, jugada, come, lista_jugadas);
}

export function anadeMovimientoEnroqueExtra(tablero, movimiento, movimiento_extra, posicion_vacia, come, lista_jugadas)
{
  // En la posicioón vacia no debe de haber nada
  if (!tablero.esPosicionNula(posicion_vacia)) {
    return;
  }

  // Tratamos de añadir la jugada
  anadeMovimientoEnroque(tablero, movimiento, movimiento_extra, come, lista_jugadas);
}
