import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodasAcoesDasAssociacoes} from "../../../../../services/sme/Parametrizacoes.service";
import '../parametrizacoes-estrutura.scss'
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";

export const AcoesDasAssociacoes = () => {

    const [todasAsAcoes, setTodasAsAcoes] = useState([]);
    const [count, setCount] = useState(0);

    const carregaTodasAsAcoes = useCallback(async () =>{
        let todas_acoes = await getTodasAcoesDasAssociacoes();
        console.log('carregaTodasAsAcoes ', todas_acoes)
        setTodasAsAcoes(todas_acoes)
    }, []);

    useEffect(()=>{
        carregaTodasAsAcoes();
    }, [carregaTodasAsAcoes]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeAcoes =  useMemo(() => todasAsAcoes.length, [todasAsAcoes]);

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Ações das Associações</h1>
            <div className="page-content-inner">
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
                <p>Exibindo <span className='total-acoes'>{totalDeAcoes}</span> ações de associações</p>
                {/*<button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback</button>*/}
            </div>
        </PaginasContainer>
    )
};