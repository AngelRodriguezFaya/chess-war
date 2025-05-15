export class Posicion
{
  constructor(fila = 0, columna = 0)
  {
    this._fila = fila;
    this._columna = columna;
  }

  getFila()
  {
    return this._fila;
  }

  getColumna()
  {
    return this._columna;
  }

  setFila(fila)
  {
    actualizar(fila, this._columna);
  }

  setColumna(columna)
  {
    actualizar(this._fila, columna);
  }

  actualizar(fila, columna)
  {
    this._fila = fila;
    this._columna = columna;
  }

  equals(posicion)
  {
    return this._fila === posicion._fila && this._columna === posicion._columna;
  }

  notEquals(posicion)
  {
    return !this.equals(posicion);
  }

  clone()
  {
    return new Posicion(this._fila, this._columna);
  }
}

export class Movimiento
{
  constructor(posicion_actual = new Posicion(), posicion_siguiente = new Posicion()) {
    this._posicion_actual = posicion_actual.clone();
    this._posicion_siguiente = posicion_siguiente.clone();
  }

  getPosicionActual()
  {
    return this._posicion_actual;
  }

  getPosicionSiguiente()
  {
    return this._posicion_siguiente;
  }

  setPosicionActual(posicion_actual)
  {
    update(posicion_actual, this._posicion_siguiente)
  }

  setPosicionSiguiente(posicion_siguiente)
  {
    update(this._posicion_actual, posicion_siguiente)
  }

  update(posicion_actual, posicion_siguiente)
  {
    this._posicion_actual = posicion_actual;
    this._posicion_siguiente = posicion_siguiente;
  }

  equals(movimiento)
  {
    return this._posicion_actual.equals(movimiento._posicion_actual) && this._posicion_siguiente.equals(movimiento._posicion_siguiente);
  }

  notEquals(movimiento)
  {
    return !this.equals(movimiento);
  }

  clone()
  {
    return new Movimiento(this._posicion_actual.clone(), this._posicion_siguiente.clone());
  }
}

export class Jugada
{
  constructor(movimiento)
  {
    this._movimiento = movimiento.clone();
    this._movimiento_extra = { disponible: false, movimiento: new Movimiento() };
    this._come = { disponible: false, posicion: new Posicion() };
  }

  getMovimiento()
  {
    return this._movimiento;
  }

  getDisponibleExtra()
  {
    return this._movimiento_extra.disponible;
  }

  getMovimientoExtra()
  {
    return this._movimiento_extra.movimiento;
  }

  getDisponibleCome()
  {
    return this._come.disponible;
  }

  getPosicionCome()
  {
    return this._come.posicion;
  }

  setMovimientoExtra(movimiento)
  {
    this._movimiento_extra.disponible = true;
    this._movimiento_extra.movimiento = movimiento;
  }

  setPosicionCome(posicion)
  {
    this._come.disponible = true;
    this._come.posicion = posicion;
  }

  clone()
  {
    var jugada = new Jugada(this._movimiento);

    jugada._movimiento_extra.disponible = this._movimiento_extra.disponible;
    jugada._movimiento_extra.movimiento = this._movimiento_extra.movimiento.clone();

    jugada._come.disponible = this._come.disponible;
    jugada._come.posicion = this._come.posicion.clone();

    return jugada;
  }
}
