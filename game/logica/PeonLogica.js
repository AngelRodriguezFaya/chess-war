import { Piece } from './PiezaLogica.js';
import { TypePiece, TypePlayer } from './TiposUtils.js';
import { BoardPosition, Movement } from './Movimiento.js';
import { addMovePosition, addEatPosition, addFirstMovePosition, addEnPassantPosition } from './MovimientosUtils.js';

export class Pawn extends Piece {
  constructor(player) {
    super(player, TypePiece.PAWN);
  }

  moves(board, position, kill) {
    const moves = [];
    let new_position = new BoardPosition();
    let kill_position = new BoardPosition();
    let empty_position = new BoardPosition();

    if (this._type_player === TypePlayer.WHITE) {
      new_position.update(position.row() - 1, position.column());
      addMovePosition(board, new Movement(position, new_position), kill, moves);

      new_position.update(position.row() - 1, position.column() - 1);
      addEatPosition(board, new Movement(position, new_position), kill, moves);

      new_position.update(position.row() - 1, position.column() + 1);
      addEatPosition(board, new Movement(position, new_position), kill, moves);

      new_position.update(position.row() - 2, position.column());
      empty_position.update(position.row() - 1, position.column());
      addFirstMovePosition(board, new Movement(position, new_position), empty_position, kill, moves);

      new_position.update(position.row() - 1, position.column() - 1);
      kill_position.update(position.row(), position.column() - 1);
      addEnPassantPosition(board, new Movement(position, new_position), kill_position, kill, moves);

      new_position.update(position.row() - 1, position.column() + 1);
      kill_position.update(position.row(), position.column() + 1);
      addEnPassantPosition(board, new Movement(position, new_position), kill_position, kill, moves);
    } else {
      new_position.update(position.row() + 1, position.column());
      addMovePosition(board, new Movement(position, new_position), kill, moves);

      new_position.update(position.row() + 1, position.column() - 1);
      addEatPosition(board, new Movement(position, new_position), kill, moves);

      new_position.update(position.row() + 1, position.column() + 1);
      addEatPosition(board, new Movement(position, new_position), kill, moves);

      new_position.update(position.row() + 2, position.column());
      empty_position.update(position.row() + 1, position.column());
      addFirstMovePosition(board, new Movement(position, new_position), empty_position, kill, moves);

      new_position.update(position.row() + 1, position.column() + 1);
      kill_position.update(position.row(), position.column() + 1);
      addEnPassantPosition(board, new Movement(position, new_position), kill_position, kill, moves);

      new_position.update(position.row() + 1, position.column() - 1);
      kill_position.update(position.row(), position.column() - 1);
      addEnPassantPosition(board, new Movement(position, new_position), kill_position, kill, moves);
    }

    return moves;
  }

  clone() {
    return new Pawn(this._type_player);
  }
}
