export class PiezaLogica
{
  constructor(tipo_jugador, tipo_pieza)
  {
    this._tipo_jugador = tipo_jugador;
    this._tipo_pieza = tipo_pieza;
    this._numero_movimientos = 0;
  }

  getTipoJugador()
  {
    return this._tipo_jugador;
  }

  getTipoPieza()
  {
    return this._tipo_pieza;
  }

  getNumeroMovimientos()
  {
    return this._numero_movimientos;
  }

  actualizar()
  {
    this._numero_movimientos++;
  }

  getJugadas(tablero, posicion)
  {
    return this.getPosiblesJugadas(tablero, posicion, false);
  }

  getJugadasCome(tablero, posicion)
  {
    return this.getPosiblesJugadas(tablero, posicion, true);
  }

  getPosiblesJugadas(tablero, posicion, comer)
  {
    throw new Error('El método _moves debe ser implementado por las subclases');
  }

  clone()
  {
    throw new Error('clone() must be implemented by subclasses');
  }
}
