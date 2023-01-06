import React, {memo, useCallback, useEffect, useState, useRef} from "react";
import { PaginasContainer } from "../../../../paginas/PaginasContainer";
import '../relatorio-consolidado.scss'
import { Cabecalho } from "./Cabecalho";
import { MotivoRetificacao } from "./MotivoRetificacao";
import { Filtros } from "./Filtros";
import { TabelaPcsRetificaveis } from "./TabelaPcsRetificaveis";
import {useHistory, useParams, useLocation} from "react-router-dom";
import { getConsolidadoDrePorUuid, getPcsRetificaveis, postRetificarPcs } from "../../../../services/dres/RelatorioConsolidado.service";
import { getTabelaAssociacoes } from "../../../../services/sme/Parametrizacoes.service";
import Loading from "../../../../utils/Loading";
import { PERIODO_RELATORIO_CONSOLIDADO_DRE } from "../../../../services/auth.service";
import { exibeDataPT_BR } from "../../../../utils/ValidacoesAdicionaisFormularios";
import Dropdown from 'react-bootstrap/Dropdown';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleLeft} from "@fortawesome/free-solid-svg-icons";
import { ModalAntDesignConfirmacao } from "../../../Globais/ModalAntDesign";

const RetificacaoRelatorioConsolidado = () => {
    const initialValuesFiltros = {
        filtro_por_nome: '',
        filtro_por_tipo: ''
    }


    const [relatorioConsolidado, setRelatorioConsolidado] = useState(false);
    const [referencia_publicacao, setReferencia_publicacao] = useState("");
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [pcsRetificaveis, setPcsRetificaveis] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [formErrors, setFormErrors] = useState({})
    const [disableBtnRetificar, setDisableBtnRetificar] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [identificadorCheckboxClicado, setIdentificadorCheckboxClicado] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingPcsRetificaveis, setLoadingPcsRetificaveis] = useState(true);

    const {relatorio_consolidado_uuid} = useParams();
    const parametros = useLocation();
    const history = useHistory();
    const formRef = useRef();
    const rowsPerPage = 10;

    const carregaConsolidado = useCallback(async () => {
        if(relatorio_consolidado_uuid){
            let consolidado = await getConsolidadoDrePorUuid(relatorio_consolidado_uuid);
            setRelatorioConsolidado(consolidado);
            setLoading(false);
        }

    }, [relatorio_consolidado_uuid])

    useEffect(() => {
        carregaConsolidado()
    }, [carregaConsolidado])

    useEffect(() => {
        if(parametros && parametros.state && parametros.state.referencia_publicacao){
            setReferencia_publicacao(parametros.state.referencia_publicacao)
        }
    }, [parametros])

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    useEffect(()=>{
        buscaTabelaAssociacoes();
    }, []);

    const onChangeMotivoRetificacao = (value) => {
        if(value === "" || value === undefined){
            setDisableBtnRetificar(true);
        }
        else{
            setDisableBtnRetificar(false);
        }
    }

    const carregaPcsRetificaveis = useCallback(async () => {
        if(relatorio_consolidado_uuid){
            let prestacoes_de_contas = await getPcsRetificaveis(relatorio_consolidado_uuid);
            let pcs = prestacoes_de_contas.map(obj => {
                return {
                    ...obj,
                    selecionado: false
                    }
                });

            setPcsRetificaveis(pcs)
            setLoadingPcsRetificaveis(false);
        }

    }, [relatorio_consolidado_uuid])

    useEffect(() => {
        carregaPcsRetificaveis()
    }, [carregaPcsRetificaveis])

    const onClickVoltar = () => {
        if(relatorioConsolidado && relatorioConsolidado.periodo){
            let uuid_periodo = relatorioConsolidado.periodo.uuid;
            localStorage.setItem(PERIODO_RELATORIO_CONSOLIDADO_DRE, uuid_periodo);
            history.push(`/dre-relatorio-consolidado/`)
        }
    }

    const formataPeriodo = () => {
        if(relatorioConsolidado && relatorioConsolidado.periodo){
            let periodo_formatado = `${relatorioConsolidado.periodo.referencia} - ${exibeDataPT_BR(relatorioConsolidado.periodo.data_inicio_realizacao_despesas)} à ${exibeDataPT_BR(relatorioConsolidado.periodo.data_fim_realizacao_despesas)}`;
            return periodo_formatado;
        }

        return "";
    }

    const nomeComTipoTemplate = (rowData) => {
        return(
            <span>{`${rowData.unidade_tipo_unidade} ${rowData.unidade_nome}`}</span>
        )
    }

    const selecionarTodos = (event) => {
        event.preventDefault();
        let result = pcsRetificaveis.reduce((acc, o) => {
            let obj = Object.assign(o, { selecionado: true }) ;
            acc.push(obj);

            return acc;
        
        }, []);
        setPcsRetificaveis(result);
        setQuantidadeSelecionada(pcsRetificaveis.length);
        setIdentificadorCheckboxClicado(true);
    }

    const desmarcarTodos = (event) => {
        event.preventDefault();
        let result = pcsRetificaveis.reduce((acc, o) => {

            let obj = Object.assign(o, { selecionado: false }) ;
        
            acc.push(obj);
        
            return acc;
        
        }, []);
        setPcsRetificaveis(result);
        setQuantidadeSelecionada(0);
        setIdentificadorCheckboxClicado(false);
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="p-0">
                        <input
                            checked={identificadorCheckboxClicado}
                            type="checkbox"
                            value=""
                            onChange={(e) => e}
                            name="checkHeader"
                            id="checkHeader"
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="super-colors" id='dropdown-menu-tabela-acertos-lancamentos'>
                        <Dropdown.Item  onClick={(e) => selecionarTodos(e)}>Selecionar todos</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => desmarcarTodos(e)}>Desmarcar todos</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }

    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={pcsRetificaveis.filter(u => u.uuid === rowData.uuid)[0].selecionado}
                    type="checkbox"
                    value=""
                    onChange={(e) => tratarSelecionado(e, rowData.uuid)}
                    name="checkAtribuido"
                    id="checkAtribuido"
                />
            </div>
        )
    }

    const tratarSelecionado = (e, unidadeUuid) => {
        let cont = quantidadeSelecionada;
        if (e.target.checked) {
            cont = cont + 1
        } else {
            cont = cont - 1
        }
        setQuantidadeSelecionada(cont);
        let result2 = pcsRetificaveis.reduce((acc, o) => {

            let obj = unidadeUuid === o.uuid ? Object.assign(o, { selecionado: e.target.checked }) : o;
        
            acc.push(obj);
        
            return acc;
        
        }, []);
        setPcsRetificaveis(result2);
    }

    const mensagemQuantidadeExibida = () => {
        if(pcsRetificaveis && pcsRetificaveis.length === 1){
            return (
                <div className="row">
                    <div className="col-12" style={{padding:"15px 0px", margin:"0px 15px", flex:"100%"}}>
                        Exibindo <span style={{color: "#00585E", fontWeight:"bold"}}>{pcsRetificaveis.length}</span> unidade
                    </div>
                </div>
            )
        }
        else if(pcsRetificaveis && pcsRetificaveis.length > 1){
            return (
                <div className="row">
                    <div className="col-12" style={{padding:"15px 0px", margin:"0px 15px", flex:"100%"}}>
                        Exibindo <span style={{color: "#00585E", fontWeight:"bold"}}>{pcsRetificaveis.length}</span> unidades
                    </div>
                </div>
            )
        }
    }

    const montagemRetificar = () => {
        return(
            <div className="row">
                <div className="col-12" style={{background: "#00585E", color: 'white', padding:"15px", margin:"0px 15px", flex:"100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "unidade selecionada" : "unidades selecionadas"}  / {pcsRetificaveis.length} totais
                        </div>
                        <div className="col-7">
                            
                               
                                <button
                                    className="float-right btn btn-link btn-montagem-selecionar"
                                    onClick={(e) => desmarcarTodos(e)} style={{textDecoration:"underline", cursor:"pointer"}}
                                >
                                    <strong>Cancelar</strong>
                                </button>
                                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                <button
                                    className="float-right btn btn-link btn-montagem-selecionar"
                                    disabled={disableBtnRetificar}
                                    onClick={() => setShowModal(true)}
                                    style={{textDecoration:"underline", cursor:"pointer", color: '#FFFFFF'}}
                                >
                                    <FontAwesomeIcon
                                        style={{color: "white", fontSize: '15px', marginRight: "2px"}}
                                        icon={faAngleDoubleLeft}
                                    />
                                    <strong>Retificar</strong>
                                </button>
                                
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const validateFormRetificacao = async(values) => {
        const errors = {};

        if(values.motivo_retificacao === undefined || values.motivo_retificacao === ""){
            errors.motivo_retificacao = "Campo motivo da retificação é obrigatório";
        }

        setFormErrors(errors);
    }

    const handleSubmitFiltros = async(values) => {
        setLoadingPcsRetificaveis(true);
        let prestacoes_de_contas = await getPcsRetificaveis(relatorio_consolidado_uuid);
        let pcs = prestacoes_de_contas.map(obj => {
            return {
                ...obj,
                selecionado: false
                }
            });

        let filtro_por_nome = values.filtro_por_nome;
        let filtro_por_tipo = values.filtro_por_tipo;

        if(filtro_por_nome !== ""){
            filtro_por_nome = filtro_por_nome.toUpperCase()
            pcs = pcs.filter((item) => (item.unidade_nome.includes(filtro_por_nome)))
        }

        if(filtro_por_tipo !== ""){
            pcs = pcs.filter((item) => (item.unidade_tipo_unidade === filtro_por_tipo))
        }

        setPcsRetificaveis(pcs);
        setQuantidadeSelecionada(0);
        setLoadingPcsRetificaveis(false);
    }

    const handleLimparFiltros = async(setFieldValue) => {
        setLoadingPcsRetificaveis(true);
        let prestacoes_de_contas = await getPcsRetificaveis(relatorio_consolidado_uuid);
        let pcs = prestacoes_de_contas.map(obj => {
            return {
                ...obj,
                selecionado: false
                }
            });
        
        setFieldValue("filtro_por_nome", "")
        setFieldValue("filtro_por_tipo", "")
        setPcsRetificaveis(pcs);
        setQuantidadeSelecionada(0);
        setLoadingPcsRetificaveis(false);
    }

    const handleRetificar = async() => {
        let pcs_selecionadas = pcsRetificaveis.filter((item) => (item.selecionado === true));
        let lista_uuids = [];

        for(let i=0; i<=pcs_selecionadas.length-1; i++){
            let uuid = pcs_selecionadas[i].uuid;
            lista_uuids.push(uuid);
        }

        let payload = {
            motivo_retificacao: formRef.current.values.motivo_retificacao,
            pcs_a_retificar: lista_uuids
        }

        let retificacao = await postRetificarPcs(relatorio_consolidado_uuid, payload)

        setShowModal(false);
        setQuantidadeSelecionada(0);
        onClickVoltar();
    } 

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Retificação da publicação</h1>
            <>
                <div className="page-content-inner pt-0">
                    {loading ? (
                        <div className="mt-5">
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        </div>
                    ) :
                        <>
                            <Cabecalho
                                referencia_publicacao={referencia_publicacao}
                                onClickVoltar={onClickVoltar}
                                formataPeriodo={formataPeriodo}
                            />

                            <MotivoRetificacao
                                relatorioConsolidado={relatorioConsolidado}
                                validateFormRetificacao={validateFormRetificacao}
                                formErrors={formErrors}
                                onChangeMotivoRetificacao={onChangeMotivoRetificacao}
                                formRef={formRef}
                            />

                            <Filtros
                                tabelaAssociacoes={tabelaAssociacoes}
                                handleSubmitFiltros={handleSubmitFiltros}
                                handleLimparFiltros={handleLimparFiltros}
                                initialValuesFiltros={initialValuesFiltros}
                            />

                            {loadingPcsRetificaveis ? (
                                <div className="mt-5">
                                    <Loading
                                        corGrafico="black"
                                        corFonte="dark"
                                        marginTop="0"
                                        marginBottom="0"
                                    />
                                </div>
                            ) :

                                <TabelaPcsRetificaveis
                                    pcsRetificaveis={pcsRetificaveis}
                                    rowsPerPage={rowsPerPage}
                                    nomeComTipoTemplate={nomeComTipoTemplate}
                                    selecionarHeader={selecionarHeader}
                                    selecionarTemplate={selecionarTemplate}
                                    quantidadeSelecionada={quantidadeSelecionada}
                                    montagemRetificar={montagemRetificar}
                                    mensagemQuantidadeExibida={mensagemQuantidadeExibida}
                                />
                            }
<<<<<<< HEAD
=======

>>>>>>> homolog
                            <ModalAntDesignConfirmacao
                                handleShow={showModal}
                                titulo={"Confirmar Retificação"}
                                bodyText="Lembre-se que apenas as prestações de contas selecionadas serão reabertas para edição e gerarão novos documentos e nova lauda a ser publicada."
<<<<<<< HEAD
                                handleOk={(e) => handleRetificar()}
=======
                                handleOk={(e) => handleRetificar()} 
>>>>>>> homolog
                                okText="Continuar"
                                handleCancel={(e) => setShowModal(false)}
                                cancelText="Cancelar"
                            />
                            
                        </>
                    }
                </div>
            </>
        </PaginasContainer>
    )
}

export default memo(RetificacaoRelatorioConsolidado)