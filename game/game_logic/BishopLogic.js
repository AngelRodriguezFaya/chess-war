import { Piece } from './PieceLogic.js';
import { TypePiece } from './TypeUtility.js';
import { Movement } from './Move.js';
import { addMoveEatPosition } from './MoveUtility.js';

export class Bishop extends Piece {
  constructor(player) {
    super(player, TypePiece.BISHOP);
  }

  moves(board, position, kill) {
    const moves = [];
    let new_position = position.clone();

		do {
			new_position.update(new_position.row() - 1, new_position.column() - 1);
			addMoveEatPosition(board, new Movement(position, new_position), kill, moves);
		} while (board.isNull(new_position));

    new_position = position.clone();

    do {
			new_position.update(new_position.row() + 1, new_position.column() + 1);
			addMoveEatPosition(board, new Movement(position, new_position), kill, moves);
		} while (board.isNull(new_position));

    new_position = position.clone();

    do {
			new_position.update(new_position.row() - 1, new_position.column() + 1);
			addMoveEatPosition(board, new Movement(position, new_position), kill, moves);
		} while (board.isNull(new_position));

    new_position = position.clone();

    do {
			new_position.update(new_position.row() + 1, new_position.column() - 1);
			addMoveEatPosition(board, new Movement(position, new_position), kill, moves);
		} while (board.isNull(new_position));

    return moves;
  }

  clone() {
    return new Bishop(this._type_player);
  }
}
