import create from "zustand";
import { Pokemon } from './pokemon';

export type Player = {
    presence_ref: string
    user_name: string
    minha_vez: boolean
}

export type Chute = {
    user_name: string
    chute: Pokemon
}

export const useGameStore = create(set => ({
    player: {
        presence_ref: '',
        user_name: '',
        minha_vez: false
    },
    players: [],
    chutes: [],
    pokemon: {
        id: null,
        nome: '',
        tipos: [],
        imagem: '',
        peso: null,
        altura: null,
        gen: null
    },
    setPlayer: (player: Player) => set(() => ({ player: player })),
    addChute: (chute: Chute) => set((state: any) => ({ chutes: [chute, ...state.chutes] })),
    addPlayer: (player: Player) => set((state: any) => ({ players: [...state.players, player] })),
    removePlayer: (player: Player) => set((state: any) => ({ players: state.players.filter((pl: Player) => pl.presence_ref != player.presence_ref) }))
}))