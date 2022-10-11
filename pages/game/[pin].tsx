import { getSupabase } from "../../common/supa";
import { GetServerSideProps } from "next";
import { GameContainer } from "../../components/GameContainer";
import { Pokemon } from "../../common/pokemon";
import { PageBackground } from "../../components/PageBackground";

type GamePageServerSideProps = {
    poke: Pokemon
    allPokesList: Pokemon[]
}

const GamePage = ({ poke, allPokesList }: GamePageServerSideProps) => {
    return (
        <PageBackground>
            <GameContainer poke={poke} allPokesList={allPokesList} />
        </PageBackground>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const supabase = getSupabase();
    const randomPokeId = Math.floor(Math.random() * 906);

    const pokes = await supabase.from('pokemons').select('*');
    let allPokesList = pokes.data!;

    const props: GamePageServerSideProps = {
        poke: allPokesList[randomPokeId],
        allPokesList
    }

    return { props };
}

export default GamePage;
