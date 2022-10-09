import Image from 'next/image';
import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import styled from 'styled-components';
import { capitalizeFirstLetter, Pokemon } from '../pages';


interface SearchBarProps {
    handleChute: Function
    allPokesList: Pokemon[]
}

export const SearchBar = ({handleChute, allPokesList}: SearchBarProps) => {
    const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
    const [searchText, setSearchText] = useState<string>('');

    const renderSuggestion = (sug: Pokemon) => (
        <SuggestionComponent>
            <Image src={sug.imagem} alt="Imagem de sugestão do pokémon" layout="fixed" width={40} height={40} />
            <p>{sug.nome}</p>
        </SuggestionComponent>
    )

    const onSuggestionsFetchRequested = ({value}: {value: string}) => {
        const inputValue = capitalizeFirstLetter(value.trim().toLowerCase());
        
        if (inputValue.length === 0) {
            return setSuggestions([])
        } else {
            return setSuggestions(allPokesList.filter((poke) => {
                return poke.nome.includes(inputValue)
            }).slice(0, 5))
        }
    }

    const onInputChange = (evt: any, {newValue}: {newValue: string}) => setSearchText(newValue);

    const onSuggestionSelected = async (event: any, { suggestion }: { suggestion: Pokemon }) => {
        handleChute(suggestion.nome);
        setSearchText('');
    }
     
    const inputProps = {
        placeholder: 'Faça seu chute aqui!',
        value: searchText,
        onChange: onInputChange
    }

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            getSuggestionValue={(sug: Pokemon) => sug.nome}
            renderSuggestion={renderSuggestion}
            onSuggestionsClearRequested={() => setSuggestions([])}
            inputProps={inputProps}
            onSuggestionSelected={onSuggestionSelected}
            highlightFirstSuggestion={true}
        />
    )
}

const SuggestionComponent = styled.div`
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 1rem;
  padding: .25rem;
`;