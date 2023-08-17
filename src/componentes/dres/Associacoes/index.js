import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {getTabelaAssociacoes, getAssociacoesPorUnidade, filtrosAssociacoes, getAssociacao, getContasAssociacao, getContasAssociacaoEncerradas} from "../../../services/dres/Associacoes.service";
import "./associacoes.scss"
import {TabelaAssociacoes} from "./TabelaAssociacoes";
import {FiltrosAssociacoes} from "./FiltrosAssociacoes";
import Loading from "../../../utils/Loading";
import Img404 from "../../../assets/img/img-404.svg";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../Globais/Mensagens/MsgImgLadoDireito";
import {DADOS_DA_ASSOCIACAO} from "../../../services/auth.service";
import {visoesService} from "../../../services/visoes.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

export const Associacoes = () =>{

    const rowsPerPage = 15;

    const initialStateFiltros = {
        unidade_escolar_ou_associacao: "",
        tipo_de_unidade: "",
        filtro_status: []
    };

    const [loading, setLoading] = useState(true);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [associacoes, setAssociacoes] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [urlRedirect, setRrlRedirect] = useState('');
    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false);

    useEffect(()=>{
        buscaTabelaAssociacoes();
    }, []);

    useEffect(()=>{
        buscaAssociacoesPorUnidade();
    }, []);

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    const buscaAssociacoesPorUnidade = async ()=>{
        try {
            let associacoes = await getAssociacoesPorUnidade();
            setAssociacoes(associacoes);
        }catch (e) {
            console.log("Erro ao buscar associacoes ", e)
        }
        setLoading(false)
    };

    const buscaAssociacao = async (uuid_associacao, url_redirect)=>{
        setLoading(true);
        try {
            let associacao = await getAssociacao(uuid_associacao, stateFiltros.filtro_status);
            let contas = await getContasAssociacao(uuid_associacao);
            let contasEncerradas = await getContasAssociacaoEncerradas(uuid_associacao);

            let dados_da_associacao = {
                dados_da_associacao:{
                    ...associacao,
                    contas,
                    contasEncerradas
                }
            };
            localStorage.setItem(DADOS_DA_ASSOCIACAO, JSON.stringify(dados_da_associacao ));
            setRrlRedirect(url_redirect)
        }catch (e) {
            console.log("Erro ao buscar associacoes ", e)
        }
        setLoading(false);
    };

    const unidadeEscolarTemplate = (rowData) =>{
        return (
            <div>
                {rowData['unidade']['nome_com_tipo'] ? <strong>{rowData['unidade']['nome_com_tipo']}</strong> : ''}
            </div>
        )
    };

    const acoesTemplate = (rowData) =>{
        return (
                <>

                    <button
                        onClick={()=>buscaAssociacao(rowData.uuid, "/dre-detalhes-associacao")}
                        className="btn btn-link"
                        disabled={
                            visoesService.getPermissoes(["access_dados_unidade_dre"])       || 
                            visoesService.getPermissoes(["access_situacao_financeira_dre"]) ||
                            visoesService.getPermissoes(['access_processo_sei'])? false : true
                        }
                    >
                        <FontAwesomeIcon
                            style={{marginRight: "0", color: '#00585E'}}
                            icon={faEye}
                        />

                        {urlRedirect &&
                            <Redirect
                                to={{
                                    pathname: urlRedirect,
                                }}
                            />
                        }
                    </button>
                
                </>
        )
    };

    const handleChangeFiltrosAssociacao = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleSubmitFiltrosAssociacao = async (event)=>{
        setLoading(true);
        setBuscaUtilizandoFiltros(true);
        event.preventDefault();
        let resultado_filtros = await filtrosAssociacoes(stateFiltros.unidade_escolar_ou_associacao, null, stateFiltros.tipo_de_unidade, stateFiltros.filtro_status);
        setAssociacoes(resultado_filtros);
        setLoading(false)
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await buscaAssociacoesPorUnidade();
        setLoading(false)
    };

    const handleOnChangeMultipleSelectStatus =  async (value) => {
        let name = "filtro_status"

        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }

    return(
        <>
            <FiltrosAssociacoes
                tabelaAssociacoes={tabelaAssociacoes}
                stateFiltros={stateFiltros}
                handleChangeFiltrosAssociacao={handleChangeFiltrosAssociacao}
                handleSubmitFiltrosAssociacao={handleSubmitFiltrosAssociacao}
                handleOnChangeMultipleSelectStatus={handleOnChangeMultipleSelectStatus}
                limpaFiltros={limpaFiltros}
            />
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                associacoes && associacoes.length > 0 ? (
                <>
                    <TabelaAssociacoes
                        associacoes={associacoes}
                        rowsPerPage={rowsPerPage}
                        unidadeEscolarTemplate={unidadeEscolarTemplate}
                        acoesTemplate={acoesTemplate}
                        showModalLegendaInformacao={showModalLegendaInformacao}
                        setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                    />
                </>
                ) :
                buscaUtilizandoFiltros ?
                    <MsgImgCentralizada
                        texto='Não encontramos resultados, verifique os filtros e tente novamente.'
                        img={Img404}
                    />
                :
                    <MsgImgLadoDireito
                        texto='Não encontramos nenhuma Associação com este perfil, tente novamente'
                        img={Img404}
                    />
            }

        </>
    )
};