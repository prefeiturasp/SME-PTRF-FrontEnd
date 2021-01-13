import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodasAcoesDasAssociacoes, getTabelas} from "../../../../../services/sme/Parametrizacoes.service";
import '../parametrizacoes-estrutura.scss'
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {Filtros} from "./Filtros";
import {BtnAddAcoes} from "./BtnAddAcoes";
import {TabelaAcoesDasAssociacoes} from "./TabelaAcoesDasAssociacoes";

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
        const resp = await getTabelas();
        console.log('carregaTabelasDespesas ', resp)
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

    const handleSubmitFiltros = async () =>{
        console.log("handleSubmitFiltros ", stateFiltros)
    };

    const limpaFiltros = async ()=>{
      setStateFiltros(initialStateFiltros)
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Ações das Associações</h1>
            <div className="page-content-inner">
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
                <BtnAddAcoes/>
                <Filtros
                    stateFiltros={stateFiltros}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                    despesasTabelas={despesasTabelas}
                />
                <p>Exibindo <span className='total-acoes'>{totalDeAcoes}</span> ações de associações</p>
                <TabelaAcoesDasAssociacoes
                    todasAsAcoes={todasAsAcoes}
                />
                {/*<button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback: {count}</button>*/}
            </div>
        </PaginasContainer>
    )
};