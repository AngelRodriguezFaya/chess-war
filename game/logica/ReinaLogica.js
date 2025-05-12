import { Piece } from './PiezaLogica.js';
import { TypePiece } from './TiposUtils.js';
import { Movement } from './Movimiento.js';
import { addMoveEatPosition } from './MovimientosUtils.js';

export class Queen extends Piece {
  constructor(player) {
    super(player, TypePiece.QUEEN);
  }

  moves(board, position, kill) {
    const moves = [];
    let new_position = position.clone();

		do {
			new_position.update(new_position.row() - 1, position.column());
			addMoveEatPosition(board, new Movement(position, new_position), kill, moves);
		} while (board.isNull(new_position));

    new_position = position.clone();

		do {
			new_position.update(new_position.row() + 1, position.column());
			addMoveEatPosition(board, new Movement(position, new_position), kill, moves);
		} while (board.isNull(new_position));

    new_position = position.clone();

		do {
			new_position.update(position.row(), new_position.column() - 1);
			addMoveEatPosition(board, new Movement(position, new_position), kill, moves);
		} while (board.isNull(new_position));

    new_position = position.clone();

		do {
			new_position.update(position.row(), new_position.column() + 1);
			addMoveEatPosition(board, new Movement(position, new_position), kill, moves);
		} while (board.isNull(new_position));

    new_position = position.clone();

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
    return new Queen(this._type_player);
  }
}
