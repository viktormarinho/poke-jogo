import Image from 'next/image';
import styled from 'styled-components';
import { Pokemon } from './../pages/game/[id]';
import { ComparisonCard } from './ComparisonCard';

interface ChuteCardProps {
    pokemon: Pokemon
    pokeCerto: Pokemon
}

export const ChuteCard = ({pokemon, pokeCerto}: ChuteCardProps) => {
    const isChuteCerto = pokemon.nome === pokeCerto.nome;

    return (
        <Card chuteCerto={isChuteCerto}>
            <ImageContainer chuteCerto={isChuteCerto}>
                <div>
                    <Image loader={() => pokemon.imagem} src={pokemon.imagem} alt="imagem do chute" layout="fixed" width={100} height={100} />
                </div>
            </ImageContainer>
            <h3>{pokemon.nome}</h3>
            <ComparisonsContainer>
                <ComparisonCard n1={pokemon.gen} n2={pokeCerto.gen} unidade="" />
                <ComparisonCard n1={pokemon.altura} n2={pokeCerto.altura} unidade="m" />
                <ComparisonCard n1={pokemon.peso} n2={pokeCerto.peso} unidade="kg" />
                {pokemon.tipos.map((tipo) => (
                    <Comparison key={tipo} certo={pokeCerto.tipos.includes(tipo)}>{tipo}</Comparison>
                ))}
            </ComparisonsContainer>
        </Card>
    )
}


const Card = styled.div<{chuteCerto: boolean}>`
    border-radius: 1.5rem;
    background-color: ${(props: any) => props.chuteCerto ? '#6ad66a' : '#f3f3f3'};
    color: black;
    display: flex;
    align-items: center;
    padding: .5rem 1rem;
    gap: 1rem;
    width: 40vw;
`;

const ImageContainer = styled.div<{chuteCerto: boolean}>`
    background-color: whitesmoke;
    padding: .5rem;
    height: 75px;
    width: 75px;
    border-radius: 50%;
    border: 3px solid ${(props: any) => props.chuteCerto ? '#3ea33e' : '#c03d3d'};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
`;

const ComparisonsContainer = styled.div`
    margin-left: auto;
    display: flex;
    gap: .75rem;
    align-items: center;
`;

const Comparison = styled.div<{certo: boolean}>`
    background-color: ${(props: any) => props.certo ? '#3ea33e' : '#c03d3d'};
    color: white;
    font-weight: 600;       
    padding: 4px 8px;
    border-radius: 4px;
`;