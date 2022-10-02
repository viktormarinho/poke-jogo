import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Image from 'next/image';

interface Pokemon {
  id: number
  nome: string
  tipos: string[]
  imagem: string
  peso: number
  altura: number
}

const Home: NextPage = () => {

  const [poke, setPoke] = useState<Pokemon>();

  const getRandomPoke = async () => {
    const randomPokeId = Math.floor(Math.random() * 906)
    
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/' + randomPokeId);

    setPoke({
      id: data.id,
      nome: data.name,
      tipos: data.types.map((t: any) => t.type.name),
      imagem: data.sprites.other['official-artwork'].front_default,
      peso: data.weight / 10,
      altura: data.height / 10
    })
  }

  useEffect(() => {
    getRandomPoke();
  }, [])

  return (
    <div>
      <Head>
        <title>Poke n sei Oq</title>
        <meta name="description" content="Jogo legal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
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

const Main = styled.main`
  display: flex;
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

export default Home;
