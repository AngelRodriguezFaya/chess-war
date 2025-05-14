import { Move } from './Movimiento.js';
import { TypePiece } from './TiposUtils.js';

export function addMove(board, move, kill, moves) {
  if (kill) {
    if (move.existKill()) {
      moves.push(move);
    }
  } else {
    let new_board = board.clone();
    new_board.doMove(move);
    
    if (!new_board.isInCheck(new_board.getPiece(move.currentMove().newPos()).player())) {
      moves.push(move);
    }
  }
}

export function addMovePosition(board, move, kill, moves) {
  if (!board.isPiece(move.currentPos()) || !board.isNull(move.newPos())) {
    return;
  }

  let new_move = new Move(move);
  addMove(board, new_move, kill, moves);
}

export function addEatPosition(board, move, kill, moves) {
  if (!board.isPiece(move.currentPos()) || !board.isPiece(move.newPos())) {
    return;
  }

  if (board.getPiece(move.currentPos()).player() === board.getPiece(move.newPos()).player()) {
    return;
  }

  let new_move = new Move(move);
  new_move.addToKill(move.newPos());
  
  addMove(board, new_move, kill, moves);
}

export function addMoveEatPosition(board, move, kill, moves) {
  addMovePosition(board, move, kill, moves);
  addEatPosition(board, move, kill, moves);
}

export function addFirstMovePosition(board, move, empty_pos, kill, moves) {
  if (!board.isPiece(move.currentPos()) || !board.isNull(move.newPos()) || !board.isNull(empty_pos)) {
    return;
  }

  if (board.getPiece(move.currentPos()).numMoves() !== 0) {
    return;
  }

  let new_move = new Move(move);
  addMove(board, new_move, kill, moves);
}

export function addEnPassantPosition(board, move, eat_pos, kill, moves) {
  if (!board.isPiece(move.currentPos()) || !board.isNull(move.newPos()) || !board.isPiece(eat_pos)) {
    return;
  }

  if (board.getPiece(move.currentPos()).type() !== TypePiece.PAWN || board.getPiece(eat_pos).type() !== TypePiece.PAWN) {
    return;
  }

  if (eat_pos.notEquals(board.lastMove().currentMove().newPos())) {
    return;
  }

  if (board.getPiece(eat_pos).numMoves() !== 1) {
    return;
  }

  if (eat_pos.row() !== 3 && eat_pos.row() !== 4) {
    return;
  }

  let new_move = new Move(move);
  new_move.addToKill(eat_pos);
  
  addMove(board, new_move, kill, moves);
}

export function addCastlingPosition(board, move, extra_move, kill, moves) {
  if (
    !board.isPiece(move.currentPos()) || !board.isNull(move.newPos()) ||
    !board.isPiece(extra_move.currentPos()) || !board.isNull(extra_move.newPos())
  ) {
    return;
  }

  if (
    board.getPiece(move.currentPos()).type() !== TypePiece.KING &&
    board.getPiece(move.currentPos()).type() !== TypePiece.ROOK
  ) {
    return;
  }

  if (
    board.getPiece(extra_move.currentPos()).type() !== TypePiece.KING &&
    board.getPiece(extra_move.currentPos()).type() !== TypePiece.ROOK
  ) {
    return;
  }

  if (
    board.getPiece(move.currentPos()).numMoves() !== 0 ||
    board.getPiece(extra_move.currentPos()).numMoves() !== 0
  ) {
    return;
  }

  let new_move = new Move(move);
  new_move.addToMoveExtra(extra_move);

  addMove(board, new_move, kill, moves);
}

export function addCastlingPositionExtra(board, move, extra_move, empty_pos, kill, moves) {
  if (!board.isNull(empty_pos)) {
    return;
  }

  addCastlingPosition(board, move, extra_move, kill, moves);
}
