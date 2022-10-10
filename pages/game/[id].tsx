import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { SearchBar } from '../../components/Searchbar';
import { ChuteCard } from '../../components/ChuteCard';
import { getSupabase } from '../../common/supa';
import { Block } from 'notiflix';
import { useRouter } from 'next/router';

export interface Pokemon {
  id: number
  nome: string
  tipos: string[]
  imagem: string
  peso: number
  altura: number
  gen: number
}

interface Jogador {
  presence_ref: string
  user_name: string
}

const GamePage: NextPage = ({ poke, allPokesList }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [chutes, setChutes] = useState<Pokemon[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [nome, setNome] = useState<string>('Anônimo');
  const supabase = getSupabase();
  const router = useRouter();
  const SalaId = `sala-${router.query.id as string}`;
  const channel = useRef(supabase.channel(SalaId)).current;
  const connected = useRef(false);

  const handleChute = async (chute: string) => {
    const chutePoke = allPokesList.filter((p: Pokemon) => p.nome == chute)[0];

    if (chutes.filter(c => c.nome === chute).length) {
      return jaChutou();
    }

    setChutes([chutePoke, ...chutes]);

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

  const connectToChannel = () => {
    channel
      .on('presence', { event: 'join' }, ({ newPresences }: any) => setJogadores((prev) => [...prev, newPresences[0]]))
      .on('presence', { event: 'leave' }, ({ leftPresences }: any) => setJogadores((prev) => prev.filter(jog => jog.presence_ref != leftPresences[0].presence_ref)))
      .subscribe(async (status: any) => {
        if (status === 'SUBSCRIBED')
          await channel.track({ user_name: nome });
      })
    connected.current = true;
  }

  useEffect(() => {
    Block.pulse('#mainContainer');

    if (!connected.current) {
      connectToChannel();
    }
  }, [])

  return (
    <div>
      <Head>
        <title>Pokemudo</title>
        <meta name="description" content="Jogo legal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page>
        <WaitingStatePage>
          <section>
            <h1>Sala de espera</h1>
            <h2>Sua sala: {SalaId}</h2>
            <h4>Jogadores:
              <ul>
                {jogadores.map((jog) => <li key={jog.presence_ref}>{jog.user_name}</li>)}
              </ul>
            </h4>
          </section>
          <div>
            <input type="text" value={nome} onChange={(e: any) => setNome(e.target.value)} />
            <button onClick={async () => await channel.track({ user_name: nome })}>
              Atualizar nome
            </button>
          </div>
        </WaitingStatePage>

        <Main id="mainContainer">
          <br /><br />
          <SearchBar handleChute={handleChute} allPokesList={allPokesList} />
          <br /><br /><br />
          {chutes?.map((chute) => {
            return <ChuteCard key={chute.id} pokemon={chute} pokeCerto={poke!} />
          })}
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
      </Page>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const supabase = getSupabase();
  const randomPokeId = Math.floor(Math.random() * 906);

  const pokes = await supabase.from('pokemons').select('*');
  let allPokesList = pokes.data!;

  return {
    props: {
      poke: allPokesList[randomPokeId],
      allPokesList
    }
  };
}

const Page = styled.div`
  background-color: #b82f43;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WaitingStatePage = styled.div`
  position: absolute;
  top: 2rem;
  width: 95vh;
  height: 40vh;
  padding: 8px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid black;
  z-index: 9999;
  display: flex;
  justify-content: space-around;

  div {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-self: flex-end;

    button {
      color: white;
      border-radius: 4px;
      border: none;
      background-color: rgb(51, 51, 51);
      font-size: 1.25rem;
      font-weight: 600;
      padding: 8px 0;
      width: 300px;
      cursor: pointer;
      box-shadow: 0 4px rgb(29, 29, 29);

      &:hover{
        box-shadow: 0 0 rgb(29, 29, 29);
        transform: translateY(4px);
      }
    }

    input {
      font-size: 1.25rem;
      text-align: center;
      padding: 8px 0;
      border: 2px solid #b6b6b6;
      border-radius: 4px;
      transition-duration: 300ms;
      width: 300px;
      text-align: center;

      &::placeholder{
        color: #b6b6b6;
      }

      &:focus{
        outline: none;
        border: 2px solid black;
      }
    }
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

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

export default GamePage;
