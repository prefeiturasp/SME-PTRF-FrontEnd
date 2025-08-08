import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {
    getTabelaAssociacoes,
    getRegularidadeAssociacoesAno,
    filtrosRegularidadeAssociacoes,
    getAnosAnaliseRegularidade
} from "../../../services/dres/Associacoes.service";
import "./associacoes.scss"
import {TabelaAssociacoes} from "./TabelaAssociacoes";
import {FiltrosAssociacoes} from "./FiltrosAssociacoes";
import Loading from "../../../utils/Loading";
import Img404 from "../../../assets/img/img-404.svg";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../Globais/Mensagens/MsgImgLadoDireito";
import {visoesService} from "../../../services/visoes.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

export const RegularidadeAssociacoes = () =>{

    const rowsPerPage = 15;

    const initialStateFiltros = {
        unidade_escolar_ou_associacao: "",
        regularidade: "",
        tipo_de_unidade: "",
        ano: new Date().getFullYear(),
    };

    const [loading, setLoading] = useState(true);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [anosAnaliseRegularidade, setAnosAnaliseRegularidade] = useState({});
    const [associacoes, setAssociacoes] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [anoSelected, setAnoSelected] = useState(new Date().getFullYear());
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [urlRedirect, setRrlRedirect] = useState('');

    useEffect(()=>{
        buscaTabelaAssociacoes();
    }, []);

    useEffect(()=>{
        buscaAssociacoesPorUnidade();
    }, []);

    useEffect(() => {
        buscaAnosAnaliseRegularidade();
    }, []);

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    const buscaAnosAnaliseRegularidade = async () => {
        let anosAnaliseRegularidade = await getAnosAnaliseRegularidade();
        setAnosAnaliseRegularidade(anosAnaliseRegularidade);
    };

    const buscaAssociacoesPorUnidade = async ()=>{
        try {
            let associacoes = await getRegularidadeAssociacoesAno();
            setAssociacoes(associacoes);
        }catch (e) {
            console.log("Erro ao buscar associacoes ", e)
        }
        setLoading(false)
    };


    const unidadeEscolarTemplate = (rowData) =>{
        return (
            <div>
                {rowData['associacao']['unidade']['nome_com_tipo'] ? <strong>{rowData['associacao']['unidade']['nome_com_tipo']}</strong> : ''}
            </div>
        )
    };

    const statusRegularidadeTemplate = (rowData) =>{
        let label_status_reguralidade;
        if (rowData['status_regularidade'] === "PENDENTE"){
            label_status_reguralidade = "Pendente"
        }else if (rowData['status_regularidade'] === "REGULAR"){
            label_status_reguralidade = "Regular"
        }
        return (
            <div className={`status-regularidade-${rowData['status_regularidade'].toLowerCase()}`}>
                {rowData['status_regularidade'] ? <strong>{label_status_reguralidade}</strong> : ''}
            </div>
        )
    };

    const acoesTemplate = (rowData) =>{
        return (
                <>

                    <button
                        onClick={()=>setRrlRedirect(`/analises-regularidade-associacao/${rowData.associacao.uuid}/`)}
                        className="btn btn-link"
                        disabled={
                            visoesService.getPermissoes(['access_regularidade_dre'])? false : true
                        }
                    >
                        <FontAwesomeIcon
                            style={{marginRight: "0", color: '#00585E'}}
                            icon={faEye}
                        />

                        {urlRedirect &&
                            <Navigate
                                to={{
                                    pathname: urlRedirect,
                                }}
                                replace
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
        let resultado_filtros = await filtrosRegularidadeAssociacoes(stateFiltros.unidade_escolar_ou_associacao, stateFiltros.regularidade, stateFiltros.tipo_de_unidade, stateFiltros.ano);
        setAssociacoes(resultado_filtros);
        setAnoSelected(stateFiltros.ano)
        setLoading(false)
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await buscaAssociacoesPorUnidade();
        setAnoSelected(stateFiltros.ano)
        setLoading(false)

    };

    return(
        <>
            <FiltrosAssociacoes
                tabelaAssociacoes={tabelaAssociacoes}
                stateFiltros={stateFiltros}
                handleChangeFiltrosAssociacao={handleChangeFiltrosAssociacao}
                handleSubmitFiltrosAssociacao={handleSubmitFiltrosAssociacao}
                limpaFiltros={limpaFiltros}
                anosAnaliseRegularidade={anosAnaliseRegularidade}
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
                        statusRegularidadeTemplate={statusRegularidadeTemplate}
                        acoesTemplate={acoesTemplate}
                        exibeAcaoDetalhe={anoSelected == new Date().getFullYear()}
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