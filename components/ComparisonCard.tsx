import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs'
import styled from 'styled-components';

export const ComparisonCard = ({n1, n2, unidade}: {n1: number, n2: number, unidade: string}) => {
    if (n1 > n2)
        return (
            <ComparisonBall chuteCerto={false}>
                {unidade == '' ? 'Gen ' : ''}{n1}{unidade} <Arrow><BsArrowDownShort size={30}/></Arrow>
            </ComparisonBall>
        );
    
    if (n2 > n1)
        return (
            <ComparisonBall chuteCerto={false}>
                {unidade == '' ? 'Gen ' : ''}{n1}{unidade} <Arrow><BsArrowUpShort size={30}/></Arrow>
            </ComparisonBall>
        );
    
    return <ComparisonBall chuteCerto={true}>{unidade == '' ? 'Gen ' : ''}{n1}{unidade}</ComparisonBall>;
}

const ComparisonBall = styled.div<{chuteCerto: boolean}>`
    background-color: ${(props: any) => props.chuteCerto ? '#3ea33e' : '#c03d3d'};
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 600;
`;

const Arrow = styled.div`
    align-self: flex-start;
    justify-self: flex-end;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 2px 2px 2px black;
    width: 20px;
    height: 20px;
    color: black;
    font-weight: 600;
    background-color: white;
    border-radius: 50%;
    margin-top: -20px;
`;