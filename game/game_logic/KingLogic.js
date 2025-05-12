import { Piece } from './PieceLogic.js';
import { TypePiece } from './TypeUtility.js';
import { BoardPosition, Movement } from './Move.js';
import { addMoveEatPosition, addCastlingPosition, addCastlingPositionExtra } from './MoveUtility.js';

export class King extends Piece {
  constructor(player) {
    super(player, TypePiece.KING);
  }

  moves(board, position, kill) {
    const moves = [];
    let new_position = new BoardPosition();
    let extra_position = new BoardPosition();
    let new_extra_position = new BoardPosition();
    let empty_position = new BoardPosition();
    
    new_position.update(position.row() + 1, position.column() + 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() + 1, position.column() - 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() - 1, position.column() + 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() - 1, position.column() - 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() + 1, position.column());
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row() - 1, position.column());
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row(), position.column() + 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);

    new_position.update(position.row(), position.column() - 1);
    addMoveEatPosition(board, new Movement(position, new_position), kill, moves);
    
    new_position.update(position.row(), position.column() + 2);
    extra_position.update(position.row(), position.column() + 3);
    new_extra_position.update(position.row(), position.column() + 1);
    addCastlingPosition(board, new Movement(position, new_position), new Movement(extra_position, new_extra_position), kill, moves);
    
    new_position.update(position.row(), position.column() - 2);
    extra_position.update(position.row(), position.column() - 4);
    new_extra_position.update(position.row(), position.column() - 1);
    empty_position.update(position.row(), position.column() - 3);
    addCastlingPositionExtra(board, new Movement(position, new_position), new Movement(extra_position, new_extra_position), empty_position, kill, moves);

    return moves;
  }

  clone() {
    return new King(this._type_player);
  }
}
