export class BoardPosition {
  constructor(row = 0, column = 0) {
    this._row = row;
    this._column = column;
  }

  row() {
    return this._row;
  }

  column() {
    return this._column;
  }

  update(row, column) {
    this._row = row;
    this._column = column;
  }

  rowSet(row) {
    this._row = row;
  }

  columnSet(column) {
    this._column = column;
  }

  equals(board_position) {
    return this._row === board_position._row && this._column === board_position._column;
  }

  notEquals(board_position) {
    return !this.equals(board_position);
  }

  clone() {
    return new BoardPosition(this._row, this._column);
  }
}

export class Movement {
  constructor(current_pos = new BoardPosition(), new_pos = new BoardPosition()) {
    this._current_pos = current_pos.clone();
    this._new_pos = new_pos.clone();
  }

  currentPos() {
    return this._current_pos;
  }

  newPos() {
    return this._new_pos;
  }

  update(current_pos, new_pos) {
    this._current_pos = current_pos;
    this._new_pos = new_pos;
  }

  currentPosSet(current_pos) {
    this._current_pos = current_pos;
  }

  newPosSet(new_pos) {
    this._new_pos = new_pos;
  }

  equals(movement) {
    return this._current_pos.equals(movement._current_pos) &&
           this._new_pos.equals(movement._new_pos);
  }

  notEquals(movement) {
    return !this.equals(movement);
  }

  clone() {
    return new Movement(this._current_pos.clone(), this._new_pos.clone());
  }
}

export class Move {
  constructor(move) {
    this._move = move.clone();
    this._extra_move = { first: false, second: new Movement() };
    this._kill = { first: false, second: new BoardPosition() };
  }

  currentMove() {
    return this._move;
  }

  currentMoveExtra() {
    return this._extra_move.second;
  }

  currentKill() {
    return this._kill.second;
  }

  existMoveExtra() {
    return this._extra_move.first;
  }

  existKill() {
    return this._kill.first;
  }

  addToMoveExtra(movement) {
    this._extra_move.first = true;
    this._extra_move.second = movement;
  }

  addToKill(position) {
    this._kill.first = true;
    this._kill.second = position;
  }

  clone() {
    const new_move = new Move(this._move);

    new_move._extra_move.first = this._extra_move.first;
    new_move._extra_move.second = this._extra_move.second.clone();

    new_move._kill.first = this._kill.first;
    new_move._kill.second = this._kill.second.clone();

    return new_move;
  }
}
