import styled from 'styled-components';
import { SearchBar } from './Searchbar';
import { ChuteCard } from './ChuteCard';
import Image from 'next/image';
import { Pokemon } from '../common/pokemon';
import { useEffect, useRef } from 'react';
import { Chute, Player, useGameStore } from '../common/store';
import { getSupabase } from '../common/supa';
import { useRouter } from 'next/router';

type GameContainerProps = {
    allPokesList: Pokemon[]
}

export const GameContainer = ({ allPokesList }: GameContainerProps) => {
    const player: Player = useGameStore((state: any) => state.player);
    const players: Player[] = useGameStore((state: any) => state.players);
    const addPlayer = useGameStore((state: any) => state.addPlayer);
    const removePlayer = useGameStore((state: any) => state.removePlayer);
    const chutes: Chute[] = useGameStore((state: any) => state.chutes);
    const addChute = useGameStore((state: any) => state.addChute);
    const poke: Pokemon = useGameStore((state: any) => state.pokemon);

    const supabase = getSupabase();
    const PIN = useRouter().query.pin as string;
    const channel = useRef(supabase.channel(PIN)).current;
    const isConected = useRef(false);

    useEffect(() => {
        if (!isConected.current) {
            connectToChannel();
        }
    }, [])

    const connectToChannel = () => {
        channel
            .on('presence', { event: 'join' }, ({ newPresences }: any) => addPlayer(newPresences[0]))
            .on('presence', { event: 'leave' }, ({ leftPresences }: any) => removePlayer(leftPresences[0]))
            .subscribe(async (status: any) => {
                if (status === "SUBSCRIBED") {
                    await channel.track(player)
                }
            });
        isConected.current = true;
    }

    const handleChute = async (chute: string) => {
        const chutePoke = allPokesList.filter((p: Pokemon) => p.nome == chute)[0];

        if (chutes.filter(c => c.chute.nome === chute).length) {
            return jaChutou();
        }

        addChute({ chute: chutePoke, user_name: player.user_name });

        if (poke.nome === chute) {
            return handleAcertou();
        }
    }

    const handleAcertou = () => {
        console.log('acertou')
    }

    const jaChutou = () => {
        console.log('já chutou esse pokemon')
    }


    return (
        <Main>
            <br /><br />
            <SearchBar handleChute={handleChute} allPokesList={allPokesList} />
            <br /><br /><br />
            {/*chutes?.map((chute) => {
                return <ChuteCard key={chute.chute.id} pokemon={chute.chute} pokeCerto={poke!} />
            }) */}
            {JSON.stringify(players)}
            <br /><br />
            {poke ?
                <Bloco>
                    <Image loader={() => poke.imagem} src={poke.imagem} alt="Imagem do pokémon escolhido" layout='fixed' width={100} height={100} />
                    <h2>{poke.nome} - Pokémon número {poke.id}</h2>
                    <h3>Altura: {poke.altura}m - Peso: {poke.peso}kg</h3>
                    <h3>Tipos: {poke.tipos.join(',')}</h3>
                </Bloco>
                : <p>carregando...</p>}
        </Main>
    )
}

const Main = styled.main`
  background-color: white;
  color: black;
  width: 95vw;
  height: 90vh;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Bloco = styled.div`
  width: 20%;
  position: absolute;
  background-color: white;
  bottom: 0;
  border: 1px solid black;
  border-radius: 2rem;
  padding: 2rem;
`;