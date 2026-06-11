import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface BoardState {
  schemaVersion: string;
}

export const useBoardStore = create<BoardState>()(
  subscribeWithSelector(() => ({
    schemaVersion: 'flap-board.v1',
  }))
);
