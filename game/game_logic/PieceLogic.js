export class Piece {
  constructor(type_player, type_piece) {
    this._type_player = type_player;
    this._type_piece = type_piece;
    this._num_moves = 0;
  }

  player() {
    return this._type_player;
  }

  type() {
    return this._type_piece;
  }

  numMoves() {
    return this._num_moves;
  }

  update() {
    this._num_moves++;
  }

  possibleMoves(board, position) {
    return this.moves(board, position, false);
  }

  killMoves(board, position) {
    return this.moves(board, position, true);
  }

  clone() {
    throw new Error('clone() must be implemented by subclasses');
  }

  moves(board, position, kill) {
    throw new Error('El método _moves debe ser implementado por las subclases');
  }
}
