import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
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

const GamePage: NextPage = ({ poke, allPokesList }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [chutes, setChutes] = useState<Pokemon[]>([]);
  const supabase = getSupabase();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const channel = supabase.channel(`sala-${id}`)

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

  useEffect(() => {
    Block.pulse('#mainContainer');
    channel
      .on('presence', {event: 'sync'}, () => console.log('sync event: ', channel.presenceState()))
      .on('presence', {event: 'join'}, ({ newPresences }: any) => console.log('join event', newPresences))
      .on('presence', {event: 'leave'}, ({ leftPresences}: any) => console.log('leave event', leftPresences))
      .subscribe(async (status: any) => {
        if (status === 'SUBSCRIBED') {
          const status = await channel.track({user_name: 'Viktor'})
          console.log(status);
        }
      })
  }, [])

  return (
    <div>
      <Head>
        <title>Pokemudo</title>
        <meta name="description" content="Jogo legal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page>
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

export const getServerSideProps: GetServerSideProps = async () =>{
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

const Main = styled.main`
  background-color: white;
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
