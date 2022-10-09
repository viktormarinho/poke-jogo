import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styled from 'styled-components';
import Swal from 'sweetalert2';


const Home: NextPage = () => {
  const [novaSalaText, setNovaSalaText] = useState<string>('');

  const pinMask = (input: string) => {
    if (!input.match(/^[0-9]*$/)) {
      Swal.fire({
        position: 'top',
        toast: true,
        icon: 'info',
        title: 'o PIN possue apenas números',
        text: '',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }

    return input
      .replace(/[^0-9]/g, '')
      .replace(/(\..*)\./g, '$1');
  }

  return (
    <div>
      <Head>
        <title>Pokémudo</title>
        <meta name="description" content="Jogo legal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <h1 style={{textAlign: 'center'}}>Jogar Pokémudo</h1>
        <StartGameBox>
          <label>
            <input 
              type="text" 
              placeholder="PIN da Sala" 
              onChange={(e: any) => setNovaSalaText(pinMask(e.target.value))} 
              value={novaSalaText} 
              maxLength={5}
            />
          </label>
          <button onClick={() => console.log('pi')}>Entrar</button>
          <button onClick={() => console.log('go')} className="new">Nova sala</button>
        </StartGameBox>
      </Main>
    </div>
  );
}

const Main = styled.main`
  background-color: #b82f43;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  h1 {
    color: white;
    font-size: 3rem;
  }
`;

const StartGameBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  background-color: white;
  padding: 16px;
  max-width: 330px;
  border-radius: 4px;
  font-size: 1.75rem;
  color: white;
  gap: 8px;

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

  .new {
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

  input, select {
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
`;

export default Home;