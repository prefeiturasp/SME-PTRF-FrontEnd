import React, {useEffect, useState, useCallback} from "react";
import {useParams, Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

import { getPeriodos } from "../../../../services/dres/Dashboard.service";
import { getTabelaAssociacoes } from "../../../../services/sme/Parametrizacoes.service";
import { getListaRelatoriosConsolidados } from "../../../../services/sme/DashboardSme.service";

import { PaginasContainer } from "../../../../paginas/PaginasContainer";
import { Cabecalho } from "./Cabecalho";
import { FormFiltros } from "./FormFiltros";
import { ListaRelatorios } from "./ListaRelatorios";
import Loading from "../../../../utils/Loading";
import { MsgImgLadoDireito } from "../../../Globais/Mensagens/MsgImgLadoDireito";
import Img404 from "../../../../assets/img/img-404.svg";

export const AcompanhamentoRelatorioConsolidadosSmeListagem = () => {
    let {periodo_uuid, status_sme} = useParams();
    const rowsPerPage = 10;

    const initialStateFiltros = {
        filtrar_por_dre: "",
        filtrar_por_tipo_de_relatorio: "",
    };

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEscolhido] = useState(false);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [selectedStatusPc, setSelectedStatusPc] = useState([]);
    const [listaFiltroDre, setListaFiltroDre] = useState({});
    const [listaFiltroTipoRelatorio, setListaFiltroTipoRelatorio] = useState({});
    const [listaFiltroStatusSme, setListaFiltroStatusSme] = useState({});
    const [relatoriosConsolidados, setRelatoriosConsolidados] = useState([])

    const [loading, setLoading] = useState(true);

    const carregaPeriodos = useCallback(async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodo_uuid) {
            setPeriodoEscolhido(periodo_uuid)
        } else if (periodos && periodos.length > 0) {
            setPeriodoEscolhido(periodos[0].uuid)
        }
    }, [periodo_uuid]) ;

    useEffect(()=>{
        carregaPeriodos()
    }, [carregaPeriodos])

    const carregaListaFiltroDre = useCallback(async () => {
        let tabela = await getTabelaAssociacoes();
        setListaFiltroDre(tabela.dres);
    }, []);

    useEffect(() => {
        carregaListaFiltroDre();
    }, [carregaListaFiltroDre]);

    const carregaListaFiltroTipoRelatorio = useCallback(async () => {
        let tipos_disponiveis = [
            {
                id: "UNICO",
                nome: "Única"
            },
            {
                id: "PARCIAL",
                nome: "Parcial"
            },
            {
                id: "RETIFICACAO",
                nome: "Retificação"
            }
        ]

        setListaFiltroTipoRelatorio(tipos_disponiveis)
    }, [])

    useEffect(() => {
        carregaListaFiltroTipoRelatorio();
    }, [carregaListaFiltroTipoRelatorio]);

    
    const carregaListaFiltroStatusSme = useCallback(async () => {
        let status_disponiveis = [
            {
                id: "NAO_GERADO",
                nome: "Não gerado"
            },
            {
                id: "NAO_PUBLICADO",
                nome: "Não Publicado no D.O"
            },
            {
                id: "PUBLICADO",
                nome: "Publicado no D.O"
            },
            {
                id: "EM_ANALISE",
                nome: "Em análise"
            },
            {
                id: "DEVOLVIDO",
                nome: "Devolvido para acerto"
            },
            {
                id: "ANALISADO",
                nome: "Relatório Analisado"
            }
        ]

        setListaFiltroStatusSme(status_disponiveis)
    }, [])

    useEffect(() => {
        carregaListaFiltroStatusSme();
    }, [carregaListaFiltroStatusSme]);


    const carregaStatus = useCallback(() => {
        if(status_sme !== undefined){
            setSelectedStatusPc([status_sme]);
        }

    }, [status_sme]) ;

    useEffect(()=>{
        carregaStatus();
    }, [carregaStatus])

    const carregaRelatoriosConsolidados = useCallback(async () => {
        setLoading(true);
        if(periodoEscolhido){
            let filtro_status = status_sme === "TODOS" ? null : status_sme;
            let relatorios = await getListaRelatoriosConsolidados(periodoEscolhido, filtro_status)
            setRelatoriosConsolidados(relatorios)
            setLoading(false);
        }
        
    }, [periodoEscolhido, status_sme])

    useEffect(() => {
        carregaRelatoriosConsolidados();
    }, [carregaRelatoriosConsolidados])

    // Handles
    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEscolhido(uuid_periodo)
    };

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleChangeSelectStatusPc =  async (value) => {
        let lista_com_status_selecionados = value;
        let nova_lista = []

        // Essa logica é utilizada para que não seja possivel
        // selecionar o status TODOS em conjunto com os demais status

        for(let i=0; i<=lista_com_status_selecionados.length-1; i++){
            if(lista_com_status_selecionados[i] === "TODOS"){
                nova_lista = ["TODOS"]
            }else{
                let index = nova_lista.indexOf("TODOS")
                if(index > -1){
                    nova_lista.splice(index, 1);
                }
                nova_lista.push(lista_com_status_selecionados[i]); 
            }
        }

        setSelectedStatusPc([...nova_lista]);
    }

    const handleLimpaFiltros = async () => {
        setLoading(true);
        setStateFiltros({
            ...initialStateFiltros,
        });
        setSelectedStatusPc([])
        let filtro_status = null
        let relatorios = await getListaRelatoriosConsolidados(
            periodoEscolhido,
            filtro_status,
        )
        setRelatoriosConsolidados(relatorios)
        setLoading(false);
    };

    const handleSubmitFiltros = async () => {
        setLoading(true);
        let filtro_status = !selectedStatusPc.includes("TODOS") ? selectedStatusPc : null
        filtro_status = filtro_status && filtro_status.length > 0 ? filtro_status : null
        let relatorios = await getListaRelatoriosConsolidados(
            periodoEscolhido,
            filtro_status,
            stateFiltros.filtrar_por_dre,
            stateFiltros.filtrar_por_tipo_de_relatorio,
        )
        setRelatoriosConsolidados(relatorios)
        setLoading(false);
    };

    const acoesTemplate = (rowData) => {
        
        return (
            <div>
                {rowData.pode_visualizar 
                
                    ?
                        <Link
                            to={{
                                pathname: `/analise-relatorio-consolidado-dre-detalhe/${rowData.uuid_consolidado_dre}`,
                            }}
                            className="btn btn-link"
                        >
                            <FontAwesomeIcon
                                style={{marginRight: "0", color: '#00585E'}}
                                icon={faEye}
                                title="Visualizar"
                            />
                        </Link>

                    :
                        <span className="btn remove-pointer">&nbsp;</span>
                }
            </div>
        )
    };

    const statusSmeTemplate = (rowData) => {
        if(rowData.status_sme === "NAO_GERADO"){
            return (
                <div>
                    <span className="status-sme-preto">{`${rowData.status_sme_label}`}</span>
                </div>
            )
        }
        else if(rowData.status_sme === "ANALISADO" || rowData.status_sme === "PUBLICADO"){
            return (
                <div>
                    <span className="status-sme-verde">{`${rowData.status_sme_label}`}</span>
                </div>
            )
        }
        else if(rowData.status_sme === "EM_ANALISE" || rowData.status_sme === "DEVOLVIDO"){
            return (
                <div>
                    <span className="status-sme-laranja">{`${rowData.status_sme_label}`}</span>
                </div>
            )
        }
        else if(rowData.status_sme === "NAO_PUBLICADO"){
            return (
                <div>
                    <span className="status-sme-vermelho">{`${rowData.status_sme_label}`}</span>
                </div>
            )
        }

        
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Análise dos relatórios consolidados das DRES</h1>
            <div className="page-content-inner">
                <Cabecalho
                    periodos={periodos}
                    periodoEscolhido={periodoEscolhido}
                    handleChangePeriodos={handleChangePeriodos}
                />

                <FormFiltros
                    stateFiltros={stateFiltros}
                    selectedStatusPc={selectedStatusPc}
                    listaFiltroDre={listaFiltroDre}
                    listaFiltroTipoRelatorio={listaFiltroTipoRelatorio}
                    listaFiltroStatusSme={listaFiltroStatusSme}
                    handleChangeFiltros={handleChangeFiltros}
                    handleChangeSelectStatusPc={handleChangeSelectStatusPc}
                    handleLimpaFiltros={handleLimpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                />

            {loading 
                ? 
                    (
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    ) 
                :
                    relatoriosConsolidados && relatoriosConsolidados.length > 0 
                        ? 
                            <ListaRelatorios
                                relatoriosConsolidados={relatoriosConsolidados}
                                rowsPerPage={rowsPerPage}
                                acoesTemplate={acoesTemplate}
                                statusSmeTemplate={statusSmeTemplate}
                            />
                        :
                            <MsgImgLadoDireito
                                texto='Nenhum relatório retornado. Tente novamente com outros filtros'
                                img={Img404}
                            />
                    
            }
            </div>
        </PaginasContainer>

        
    )
};