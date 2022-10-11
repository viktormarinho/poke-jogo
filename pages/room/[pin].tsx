import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getSupabase } from '../../common/supa';
import { useRouter } from 'next/router';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { PageBackground } from './../../components/PageBackground';
import { useGameStore } from './../../common/store';

type Jogador = {
  presence_ref: string
  user_name: string
  pronto: boolean
}

const RoomPage: NextPage = () => {

  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [nome, setNome] = useState<string>('Anônimo');
  const [pronto, setPronto] = useState<boolean>(false);
  const [isTodosProntos, setTodosProntos] = useState<boolean>(false);
  const setPlayer = useGameStore((state: any) => state.setPlayer);
  const supabase = getSupabase();
  const router = useRouter();
  const SalaId = `sala-${router.query.pin as string}`;
  const channel = useRef(supabase.channel(SalaId)).current;
  const connected = useRef(false);

  const connectToChannel = () => {
    channel
      .on('presence', { event: 'join' }, ({ newPresences }: any) => setJogadores((prev) => [...prev, newPresences[0]]))
      .on('presence', { event: 'leave' }, ({ leftPresences }: any) => setJogadores((prev) => prev.filter(jog => jog.presence_ref != leftPresences[0].presence_ref)))
      .subscribe(async (status: any) => {
        if (status === 'SUBSCRIBED')
          await channel.track({ user_name: nome, pronto });
      })
    connected.current = true;
  }

  const checkTodosProntos = async () => {
    let todosprontos = true;
    const PIN = router.query.pin;

    for (const jogador of jogadores) {
      if (!jogador.pronto) {
        todosprontos = false;
      }
    }

    setTodosProntos(todosprontos);
    await supabase
      .from('salas')
      .update({ players: jogadores.map(jg => jg.user_name) })
      .eq('pin', PIN);

    setPlayer({ nome, presence_ref: '', minha_vez: false });
    router.push('/game/' + PIN);
  }

  useEffect(() => {
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

      <PageBackground>
        <WaitingStatePage>
          <section>
            <h1>Sala de espera</h1>
            <h4>Jogadores:</h4>
            <ul>
              {jogadores.map((jog) => {
                return (
                  <li key={jog.presence_ref}>{jog.user_name}<Pronto pronto={jog.pronto}>
                    {jog.pronto ?
                      <FaCheckCircle size={25} /> :
                      <FaTimesCircle size={25} />}
                  </Pronto></li>
                )
              })}
            </ul>
          </section>
          <div id="opcoesDiv">
            <h2>PIN da Sala: {router.query.pin}</h2>
            <input type="text" disabled={isTodosProntos} value={nome} onChange={(e: any) => setNome(e.target.value)} />
            <button disabled={isTodosProntos} onClick={async () => await channel.track({ user_name: nome, pronto })}>
              Atualizar nome
            </button>
            <button disabled={isTodosProntos} className={pronto ? 'red' : 'green'} onClick={async () => {
              await channel.track({ user_name: nome, pronto: !pronto });
              setPronto(!pronto);
              checkTodosProntos();
            }}>
              {pronto ? 'Não estou pronto' : 'Estou pronto'}
            </button>
            <h2 style={{ textAlign: 'center' }} hidden={!isTodosProntos}>Iniciando...</h2>
          </div>
        </WaitingStatePage>
      </PageBackground>
    </div>
  )
}

const Pronto = styled.span<{ pronto: boolean }>`
  color: ${props => props.pronto ? 'green' : 'red'};
`;

const WaitingStatePage = styled.div`
  position: absolute;
  width: 50vw;
  height: 50vh;
  padding: 8px;
  border-radius: 8px;
  background-color: white;
  z-index: 9999;
  display: flex;
  justify-content: space-around;
  border: 3px solid black;

  div {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-self: flex-start;
    padding-bottom: 1rem;
    padding-top: 1rem;
  
    h2 {
      text-align: center;
      justify-self: flex-start;
    }

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

    .green {
      color: white;
      border-radius: 4px;
      border: none;
      background-color: rgb(53, 122, 34);
      font-size: 1.25rem;
      font-weight: 600;
      padding: 8px 0;
      width: 300px;
      cursor: pointer;
      box-shadow: 0 4px rgb(53, 91, 39);

      &:hover{
        box-shadow: 0 0 rgb(53, 91, 39);
        transform: translateY(4px);
      }
    }

    .red {
      color: white;
      border-radius: 4px;
      border: none;
      background-color: #b82f43;
      font-size: 1.25rem;
      font-weight: 600;
      padding: 8px 0;
      width: 300px;
      cursor: pointer;
      box-shadow: 0 4px #922536;

      &:hover{
        box-shadow: 0 0 #922536;
        transform: translateY(4px);
      }
    }

    button, .green, .red, input {
      &:disabled{
        opacity: 35%;
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

    h1 {
      font-size: 2rem;
      margin: 0;
      margin-top: 2rem;
    }

    h2 {
      margin: 0;
      margin-top: 2.5rem;
    }

    h4{
      text-align: center;
    }

    ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      border-radius: 4px;
      padding-inline-start: 0;

      li {
        display: flex;
        justify-content: center;
        gap: 8px;
        align-items: center;
      }
    }
  }
`;

export default RoomPage;
