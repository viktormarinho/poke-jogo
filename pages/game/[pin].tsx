import { getSupabase } from "../../common/supa";
import { GetServerSideProps } from "next";
import { GameContainer } from "../../components/GameContainer";
import { Pokemon } from "../../common/pokemon";
import { PageBackground } from "../../components/PageBackground";

type GamePageServerSideProps = {
    allPokesList: Pokemon[]
}

const GamePage = ({ allPokesList }: GamePageServerSideProps) => {
    return (
        <PageBackground>
            <GameContainer allPokesList={allPokesList} />
        </PageBackground>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const supabase = getSupabase();
    // const randomPokeId = Math.floor(Math.random() * 906);

    const pokes = await supabase.from('pokemons').select('*');
    let allPokesList = pokes.data!;

    const props: GamePageServerSideProps = {
        allPokesList
    }

    return { props };
}

export default GamePage;
