import { Piece } from './Piece.js';
import { TypePiece } from './TypeUtility.js';
import { BoardPosition, Movement } from './Move.js';
import { addMoveEatPosition } from './MoveUtility.js';

export class Knight extends Piece {
  constructor(player) {
    super(player, TypePiece.KNIGHT);
  }

  moves(board, position, kill) {
    const moves = [];
    let new_position = new BoardPosition();

    new_position.update(position.row() + 1, position.column() + 2);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() + 1, position.column() - 2);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() - 1, position.column() + 2);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() - 1, position.column() - 2);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() + 2, position.column() + 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() + 2, position.column() - 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() - 2, position.column() + 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() - 2, position.column() - 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    return moves;
  }

  clone() {
    return new Knight(this._type_player);
  }
}
