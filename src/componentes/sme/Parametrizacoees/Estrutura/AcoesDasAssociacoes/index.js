import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodasAcoesDasAssociacoes} from "../../../../../services/sme/Parametrizacoes.service";
import '../parametrizacoes-estrutura.scss'
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {Filtros} from "./Filtros";
import {getDespesasTabelas} from "../../../../../services/escolas/Despesas.service";

export const AcoesDasAssociacoes = () => {

    const initialStateFiltros = {
        filtrar_por_nome_cod_eol: "",
        filtrar_por_acao: "",
        filtrar_por_status: "",
    };

    const [todasAsAcoes, setTodasAsAcoes] = useState([]);
    const [count, setCount] = useState(0);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [despesasTabelas, setDespesasTabelas] = useState([]);

    const carregaTodasAsAcoes = useCallback(async () =>{
        let todas_acoes = await getTodasAcoesDasAssociacoes();
        console.log('carregaTodasAsAcoes ', todas_acoes)
        setTodasAsAcoes(todas_acoes)
    }, []);

    useEffect(()=>{
        carregaTodasAsAcoes();
    }, [carregaTodasAsAcoes]);

    const carregaTabelasDespesas = useCallback(async () =>{
        const resp = await getDespesasTabelas();
        setDespesasTabelas(resp);
    }, []);

    useEffect(()=>{
        carregaTabelasDespesas();
    }, [carregaTabelasDespesas]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeAcoes =  useMemo(() => todasAsAcoes.length, [todasAsAcoes]);

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Ações das Associações</h1>
            <div className="page-content-inner">
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
                <Filtros
                    stateFiltros={stateFiltros}
                    handleChangeFiltros={handleChangeFiltros}
                    despesasTabelas={despesasTabelas}
                />
                <p>Exibindo <span className='total-acoes'>{totalDeAcoes}</span> ações de associações</p>
                {/*<button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback</button>*/}
            </div>
        </PaginasContainer>
    )
};