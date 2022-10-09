import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { SearchBar } from '../../components/Searchbar';
import { ChuteCard } from '../../components/ChuteCard';
import { getSupabase } from '../../common/supa';

export interface Pokemon {
  id: number
  nome: string
  tipos: string[]
  imagem: string
  peso: number
  altura: number
  gen: number
}

const GamePage: NextPage = ({ poke, allPokesList }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [chutes, setChutes] = useState<Pokemon[]>([]);

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

  return (
    <div>
      <Head>
        <title>Pokemudo</title>
        <meta name="description" content="Jogo legal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <br /><br />
        <SearchBar handleChute={handleChute} allPokesList={allPokesList} />
        <br /><br /><br />
        {chutes?.map((chute) => {
          return <ChuteCard key={chute.id} pokemon={chute} pokeCerto={poke!} />
        })}
        <br /><br />
        {poke ?
        <Bloco>
          <Image loader={() => poke.imagem} src={poke.imagem} alt="Imagem do pokémon escolhido" layout='fixed' width={200} height={200} />
          <h1>{poke.nome} - Pokémon número {poke.id}</h1>
          <h2>Altura: {poke.altura}m - Peso: {poke.peso}kg</h2>
          <h2>Tipos: {poke.tipos.join(',')}</h2>
        </Bloco>
        : <p>carregando...</p>}
      </Main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () =>{
  const supabase = getSupabase();
  const randomPokeId = Math.floor(Math.random() * 906);
  
  const pokes = await supabase.from<Pokemon>('pokemons').select('*');
  let allPokesList = pokes.data!;
  
  return {
    props: {
      poke: allPokesList[randomPokeId],
      allPokesList
    }
  };
}

const Main = styled.main`
  display: flex;
  width: 100vw;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Bloco = styled.div`
  width: 50vw;
  border: 1px solid black;
  border-radius: 2rem;
  padding: 2rem;
`;

export default GamePage;
