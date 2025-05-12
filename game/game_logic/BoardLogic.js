import { TypePlayer, TypePiece } from './TypeUtility.js';
import { Move, Movement, BoardPosition } from './Move.js';
import { Rook } from './RookLogic.js';
import { Knight } from './KnightLogic.js';
import { Bishop } from './BishopLogic.js';
import { Queen } from './QueenLogic.js';
import { King } from './KingLogic.js';
import { Pawn } from './PawnLogic.js';

export class Board {
  constructor() {
    this._board = Array.from({ length: 8 }, () => Array(8).fill(null));
    this._white_king_pos = new BoardPosition(7, 4);
    this._black_king_pos = new BoardPosition(0, 4);
    this._white_in_check = false;
    this._black_in_check = false;
    this._last_move = new Move(new Movement(new BoardPosition(0, 0), new BoardPosition(0, 0)));
    this.createBoard(false);
  }

  getPiece(position) {
    return this._board[position.row()][position.column()];
  }

  lastMove() {
    return this._last_move;
  }

  isOnBoard(position) {
    return (
      position.row() >= 0 &&
      position.row() <= 7 &&
      position.column() >= 0 &&
      position.column() <= 7
    );
  }

  isNull(position) {
    return this.isOnBoard(position) && this.getPiece(position) === null;
  }

  isPiece(position) {
    return this.isOnBoard(position) && this.getPiece(position) !== null;
  }

  isInCheck(player) {
    return player === TypePlayer.WHITE ? this._white_in_check : this._black_in_check;
  }

  tryMove(current_pos, new_pos) {
    const piece = this.getPiece(current_pos);
    if (!piece) return false;
    const moves = piece.possibleMoves(this, current_pos);
    for (const move of moves) {
      if (
        move.currentMove().currentPos().equals(current_pos) &&
        move.currentMove().newPos().equals(new_pos)
      ) {
        this.doMove(move);
        return true;
      }
    }
    return false;
  }

  doMove(move) {
    if (move.existKill()) this.deletePiece(move.currentKill());
    if (move.existMoveExtra())
      this.movePiece(
        move.currentMoveExtra().currentPos(),
        move.currentMoveExtra().newPos()
      );
    this.movePiece(move.currentMove().currentPos(), move.currentMove().newPos());

    const pos = move.currentMove().newPos();
    const piece = this.getPiece(pos);
    if (piece.type === TypePiece.PAWN) {
      if (
        (piece.player === TypePlayer.WHITE && pos.row === 0) ||
        (piece.player === TypePlayer.BLACK && pos.row === 7)
      ) {
        this.deletePiece(pos);
        this.getPiece(pos, true);
        this._board[pos.row()][pos.column()] = new Queen(piece.player);
      }
    }

    if (piece.type === TypePiece.KING) {
      if (piece.player === TypePlayer.WHITE) {
        this._white_king_pos = pos;
      } else {
        this._black_king_pos = pos;
      }
    }

    this._last_move = move;
    this._white_in_check = this.getCheck(TypePlayer.WHITE);
    this._black_in_check = this.getCheck(TypePlayer.BLACK);
  }

  deletePiece(position) {
    this._board[position.row()][position.column()] = null;
  }

  movePiece(current_pos, new_pos) {
    this._board[new_pos.row()][new_pos.column()] = this._board[current_pos.row()][current_pos.column()];
    this._board[current_pos.row()][current_pos.column()] = null;
    this._board[new_pos.row()][new_pos.column()]?.update();
  }

  createBoard(empty) {
    if (!empty) {
      this.createPieces(TypePlayer.BLACK, 1, 0, this._black_king_pos);
      this.createPieces(TypePlayer.WHITE, 6, 7, this._white_king_pos);
    }
  }

  createPieces(player, pawn_row, pieces_row, king_pos) {
    king_pos.update(pieces_row, 4);

    this._board[pieces_row][0] = new Rook(player);
    this._board[pieces_row][1] = new Knight(player);
    this._board[pieces_row][2] = new Bishop(player);
    this._board[pieces_row][3] = new Queen(player);
    this._board[pieces_row][4] = new King(player);
    this._board[pieces_row][5] = new Bishop(player);
    this._board[pieces_row][6] = new Knight(player);
    this._board[pieces_row][7] = new Rook(player);

    for (let i = 0; i < 8; i++) {
      this._board[pawn_row][i] = new Pawn(player);
    }
  }

  getCheck(player) {
    const king_pos = player === TypePlayer.WHITE ? this._white_king_pos : this._black_king_pos;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this._board[r][c];
        if (piece && piece.player !== player) {
          const moves = piece.killMoves(this, new BoardPosition(r, c));
          for (const move of moves) {
            if (move.currentKill().equals(king_pos)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  clone() {
    const new_board = new Board();

    new_board._board = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => {
        const piece = this._board[row][col];
        return piece ? piece.clone() : null;
      })
    );

    new_board._white_king_pos = this._white_king_pos.clone();
    new_board._black_king_pos = this._black_king_pos.clone();
    new_board._white_in_check = this._white_in_check;
    new_board._black_in_check = this._black_in_check;
    new_board._last_move = this._last_move.clone();

    return new_board;
  }
}
