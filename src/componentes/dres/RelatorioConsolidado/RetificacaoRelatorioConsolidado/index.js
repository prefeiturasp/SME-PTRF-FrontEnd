import React, {memo, useCallback, useEffect, useState, useRef} from "react";
import { PaginasContainer } from "../../../../paginas/PaginasContainer";
import '../relatorio-consolidado.scss'
import { Cabecalho } from "./Cabecalho";
import { MotivoRetificacao } from "./MotivoRetificacao";
import { Filtros } from "./Filtros";
import { TabelaPcsRetificaveis } from "./TabelaPcsRetificaveis";
import { TabelaPcsEmRetificacao } from "./TabelaPcsEmRetificacao";
import {useHistory, useParams, useLocation} from "react-router-dom";
import { getConsolidadoDrePorUuid, getPcsRetificaveis, postRetificarPcs, getPcsEmRetificacao, postDesfazerRetificacaoPcs, patchMotivoRetificaoPcs, updateRetificarPcs } from "../../../../services/dres/RelatorioConsolidado.service";
import { getTabelaAssociacoes } from "../../../../services/sme/Parametrizacoes.service";
import Loading from "../../../../utils/Loading";
import { PERIODO_RELATORIO_CONSOLIDADO_DRE } from "../../../../services/auth.service";
import { exibeDataPT_BR } from "../../../../utils/ValidacoesAdicionaisFormularios";
import Dropdown from 'react-bootstrap/Dropdown';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleLeft, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { ModalAntDesignConfirmacao } from "../../../Globais/ModalAntDesign";
import { TituloTabela } from "./TituloTabela";
import ReactTooltip from "react-tooltip";
import { toastCustom } from "../../../Globais/ToastCustom";

const RetificacaoRelatorioConsolidado = () => {
    const initialValuesFiltros = {
        filtro_por_nome: '',
        filtro_por_tipo: ''
    }

    const initialValuesFiltrosPcsEmRetificacao = {
        filtro_por_nome: '',
        filtro_por_tipo: ''
    }


    const [relatorioConsolidado, setRelatorioConsolidado] = useState(false);
    const [referenciaPublicacao, setReferenciaPublicacao] = useState("");
    const [ehEdicaoRetificacao, setEhEdicaoRetificacao] = useState(null);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [pcsRetificaveis, setPcsRetificaveis] = useState(false);
    const [todasAsPcsRetificaveis, setTodasAsPcsRetificaveis] = useState(false);
    const [pcsEmRetificacao, setPcsEmRetificacao] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [quantidadeSelecionadaEmRetificacao, setQuantidadeSelecionadaEmRetificacao] = useState(0);
    const [formErrors, setFormErrors] = useState({})
    const [showModal, setShowModal] = useState(false);
    const [showModalDesfazerRetificacao, setShowModalDesfazerRetificacao] = useState(false);
    const [showModalDeveApagarRetificacao, setShowModalDeveApagarRetificacao] = useState(false);
    const [identificadorCheckboxClicado, setIdentificadorCheckboxClicado] = useState(false);
    const [identificadorCheckboxClicadoPcsEmRetificacao, setIdentificadorCheckboxClicadoPcsEmRetificacao] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingPcsRetificaveis, setLoadingPcsRetificaveis] = useState(true);
    const [loadingPcsEmRetificacao, setLoadingPcsEmRetificacao] = useState(true);
    const [estadoBotaoSalvarMotivo, setEstadoBotaoSalvarMotivo] = useState(false);

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
            setReferenciaPublicacao(parametros.state.referencia_publicacao)
        }

        if(parametros && parametros.state && parametros.state.eh_edicao_retificacao){
            setEhEdicaoRetificacao(parametros.state.eh_edicao_retificacao)
        }
    }, [parametros])

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    useEffect(()=>{
        buscaTabelaAssociacoes();
    }, []);

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
            setTodasAsPcsRetificaveis(pcs)
            setLoadingPcsRetificaveis(false);
        }

    }, [relatorio_consolidado_uuid])

    useEffect(() => {
        carregaPcsRetificaveis()
    }, [carregaPcsRetificaveis])

    const carregaPcsEmRetificacao = useCallback(async () => {
        if(relatorio_consolidado_uuid && ehEdicaoRetificacao){
            let prestacoes_de_contas = await getPcsEmRetificacao(relatorio_consolidado_uuid);
            let pcs = prestacoes_de_contas.map(obj => {
                return {
                    ...obj,
                    selecionado: false
                    }
                });

            setPcsEmRetificacao(pcs);
            setLoadingPcsEmRetificacao(false);
        }

    }, [relatorio_consolidado_uuid, ehEdicaoRetificacao])

    useEffect(() => {
        carregaPcsEmRetificacao()
    }, [carregaPcsEmRetificacao])

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
            <>
                <span data-tip={rowData.tooltip_nao_pode_desfazer_retificacao}>{`${rowData.unidade_tipo_unidade} ${rowData.unidade_nome}`}</span>
                
                {rowData.tooltip_nao_pode_desfazer_retificacao &&
                    <ReactTooltip/>
                }     
            </>
        )
    }

    const selecionarTodos = (event, listaEmRetificacao) => {
        event.preventDefault();

        if(listaEmRetificacao){
            let quantidade = 0;
            let result = pcsEmRetificacao.reduce((acc, o) => {
                
                if(o.pode_desfazer_retificacao){
                    let obj = Object.assign(o, { selecionado: true }) ;
                    acc.push(obj);
                    quantidade += 1;
                }
                else{
                    acc.push(o)
                }

                return acc;
            
            }, []);

            setPcsEmRetificacao(result);
            setQuantidadeSelecionadaEmRetificacao(quantidade)
            setIdentificadorCheckboxClicadoPcsEmRetificacao(true);
        }
        else{
            let result = pcsRetificaveis.reduce((acc, o) => {
                let obj = Object.assign(o, { selecionado: true }) ;
                acc.push(obj);
    
                return acc;
            
            }, []);

            setPcsRetificaveis(result);
            setQuantidadeSelecionada(pcsRetificaveis.length);
            setIdentificadorCheckboxClicado(true);
        }
    }

    const desmarcarTodos = (event, listaEmRetificacao=false) => {
        event.preventDefault();

        if(listaEmRetificacao){
            let result = pcsEmRetificacao.reduce((acc, o) => {

                let obj = Object.assign(o, { selecionado: false }) ;
            
                acc.push(obj);
            
                return acc;
            
            }, []);

            setPcsEmRetificacao(result);
            setQuantidadeSelecionadaEmRetificacao(0);
            setIdentificadorCheckboxClicadoPcsEmRetificacao(false);
        }
        else{
            let result = pcsRetificaveis.reduce((acc, o) => {

                let obj = Object.assign(o, { selecionado: false }) ;
            
                acc.push(obj);
            
                return acc;
            
            }, []);
            setPcsRetificaveis(result);
            setQuantidadeSelecionada(0);
            setIdentificadorCheckboxClicado(false);
        }
    }

    const selecionarHeader = (listaEmRetificacao=false) => {
        return (
            <div className="align-middle">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="p-0">
                        <input
                            checked={listaEmRetificacao ? identificadorCheckboxClicadoPcsEmRetificacao : identificadorCheckboxClicado}
                            type="checkbox"
                            value=""
                            onChange={(e) => e}
                            name="checkHeader"
                            id="checkHeader"
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="super-colors" id='dropdown-menu-tabela-acertos-lancamentos'>
                        <Dropdown.Item  onClick={(e) => selecionarTodos(e, listaEmRetificacao)}>Selecionar todos</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => desmarcarTodos(e, listaEmRetificacao)}>Desmarcar todos</Dropdown.Item>
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

    // Pcs em retificacao
    const selecionarTemplatePcsEmRetificacao = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={pcsEmRetificacao.filter(u => u.uuid === rowData.uuid)[0].selecionado}
                    type="checkbox"
                    value=""
                    onChange={(e) => tratarSelecionado(e, rowData.uuid, true)}
                    name="checkAtribuidoEmRetificacao"
                    id="checkAtribuidoEmRetificacao"
                    disabled={!rowData.pode_desfazer_retificacao}
                    className={`${!rowData.pode_desfazer_retificacao && 'cursor-desabilitado'}`}
                />
            </div>
        )
    }

    const tratarSelecionado = (e, unidadeUuid, listaEmRetificacao=false) => {
        if(listaEmRetificacao){
            let cont = quantidadeSelecionadaEmRetificacao;

            if (e.target.checked) {
                cont = cont + 1
            } else {
                cont = cont - 1
            }

            setQuantidadeSelecionadaEmRetificacao(cont);
            let qtde_permite_selecao = pcsEmRetificacao.filter(pc => pc.pode_desfazer_retificacao === true).length;

            let result2 = pcsEmRetificacao.reduce((acc, o) => {
                let obj = unidadeUuid === o.uuid ? Object.assign(o, { selecionado: e.target.checked }) : o;

                acc.push(obj);
                return acc;
            
            }, []);

            if(cont === qtde_permite_selecao){
                setIdentificadorCheckboxClicadoPcsEmRetificacao(true);
            }
            else{
                setIdentificadorCheckboxClicadoPcsEmRetificacao(false);
            }

            setPcsEmRetificacao(result2)
        }
        else{
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

            if(cont === pcsRetificaveis.length){
                setIdentificadorCheckboxClicado(true);
            }
            else{
                setIdentificadorCheckboxClicado(false);
            }

            setPcsRetificaveis(result2)
        }
    }

    const mensagemQuantidadeExibida = (listaEmRetificacao=false) => {

        if(listaEmRetificacao){
            if(pcsEmRetificacao && pcsEmRetificacao.length === 1){
                return (
                    <div className="row">
                        <div className="col-12" style={{padding:"15px 0px", margin:"0px 15px", flex:"100%"}}>
                            Exibindo <span style={{color: "#00585E", fontWeight:"bold"}}>{pcsEmRetificacao.length}</span> unidade
                        </div>
                    </div>
                )
            }
            else if(pcsEmRetificacao && pcsEmRetificacao.length > 1){
                return (
                    <div className="row">
                        <div className="col-12" style={{padding:"15px 0px", margin:"0px 15px", flex:"100%"}}>
                            Exibindo <span style={{color: "#00585E", fontWeight:"bold"}}>{pcsEmRetificacao.length}</span> unidades
                        </div>
                    </div>
                )
            }
        }
        else{
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
                                    onClick={(e) => desmarcarTodos(e, false)} style={{textDecoration:"underline", cursor:"pointer"}}
                                >
                                    <strong>Cancelar</strong>
                                </button>
                                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                <button
                                    className="float-right btn btn-link btn-montagem-selecionar"
                                    onClick={() => disparaModalRetificar()}
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

    const montagemDesfazerRetificacao = () => {
        return(
            <div className="row">
                <div className="col-12" style={{background: "#00585E", color: 'white', padding:"15px", margin:"0px 15px", flex:"100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionadaEmRetificacao} {quantidadeSelecionadaEmRetificacao === 1 ? "unidade selecionada" : "unidades selecionadas"}  / {pcsEmRetificacao.length} totais
                        </div>
                        <div className="col-7">
                                <button
                                    className="float-right btn btn-link btn-montagem-selecionar"
                                    onClick={(e) => desmarcarTodos(e, true)} style={{textDecoration:"underline", cursor:"pointer"}}
                                >
                                    <strong>Cancelar</strong>
                                </button>
                                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                <button
                                    className="float-right btn btn-link btn-montagem-selecionar"
                                    onClick={() => disparaModalDesfazerRetificacao()}
                                    style={{textDecoration:"underline", cursor:"pointer", color: '#FFFFFF'}}
                                >
                                    <FontAwesomeIcon
                                        style={{color: "white", fontSize: '15px', marginRight: "2px"}}
                                        icon={faTimesCircle}
                                    />
                                    <strong>Desfazer Retificação</strong>
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const validateFormRetificacao = async(values) => {
        const errors = {};

        if(values.motivo_retificacao === undefined || values.motivo_retificacao === "" || values.motivo_retificacao === null){
            errors.motivo_retificacao = "Campo motivo da retificação é obrigatório";
            setEstadoBotaoSalvarMotivo(false);
        }

        setFormErrors(errors);

        return errors;
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

    const handleSubmitFiltrosPcsEmRetificacao = async(values) => {
        setLoadingPcsEmRetificacao(true);
        let prestacoes_de_contas = await getPcsEmRetificacao(relatorio_consolidado_uuid);
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

        setPcsEmRetificacao(pcs);
        setQuantidadeSelecionadaEmRetificacao(0);
        setLoadingPcsEmRetificacao(false);
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

    const handleLimparFiltrosPcsEmRetificacao = async(setFieldValue) => {
        setLoadingPcsEmRetificacao(true);
        let prestacoes_de_contas = await getPcsEmRetificacao(relatorio_consolidado_uuid);
        let pcs = prestacoes_de_contas.map(obj => {
            return {
                ...obj,
                selecionado: false
                }
            });

        setFieldValue("filtro_por_nome", "")
        setFieldValue("filtro_por_tipo", "")
        setPcsEmRetificacao(pcs);
        setQuantidadeSelecionadaEmRetificacao(0);
        setLoadingPcsEmRetificacao(false);
    }

    const handleRetificar = async() => {
        let pcs_selecionadas = pcsRetificaveis.filter((item) => (item.selecionado === true));
        let lista_uuids = [];

        for(let i=0; i<=pcs_selecionadas.length-1; i++){
            let uuid = pcs_selecionadas[i].uuid;
            lista_uuids.push(uuid);
        }

        let payload = {
            motivo: formRef.current.values.motivo_retificacao,
            lista_pcs: lista_uuids
        }

        if(ehEdicaoRetificacao){
            await updateRetificarPcs(relatorio_consolidado_uuid, payload);
            toastCustom.ToastCustomSuccess('Sucesso!', 'As PCs selecionadas foram adicionadas para retificação.')

            setShowModal(false);
            setQuantidadeSelecionada(0);
            setIdentificadorCheckboxClicado(false);
            setLoadingPcsRetificaveis(true);
            setLoadingPcsEmRetificacao(true);

            await carregaPcsRetificaveis();
            await carregaPcsEmRetificacao();
            await carregaConsolidado();
        }
        else{
            await postRetificarPcs(relatorio_consolidado_uuid, payload)
            toastCustom.ToastCustomSuccess('Sucesso!', 'A retificação da publicação foi criada com sucesso.')
            onClickVoltar();
        }    
    }

    const handleDesfazerRetificao = async(deve_apagar_retificacao=false) => {
        let pcs_selecionadas = pcsEmRetificacao.filter((item) => (item.selecionado === true));
        let lista_uuids = [];

        for(let i=0; i<=pcs_selecionadas.length-1; i++){
            let uuid = pcs_selecionadas[i].uuid;
            lista_uuids.push(uuid);
        }

        let payload = {
            motivo: formRef.current.values.motivo_retificacao,
            lista_pcs: lista_uuids,
            deve_apagar_retificacao: deve_apagar_retificacao
        }

        await postDesfazerRetificacaoPcs(relatorio_consolidado_uuid, payload)

        if(deve_apagar_retificacao){
            toastCustom.ToastCustomSuccess('Sucesso!', 'A retificação da publicação foi excluída com sucesso.')
            onClickVoltar();
        }
        else{
            setShowModalDesfazerRetificacao(false);
            setIdentificadorCheckboxClicadoPcsEmRetificacao(false);
            setQuantidadeSelecionadaEmRetificacao(0);
            setLoadingPcsRetificaveis(true);
            setLoadingPcsEmRetificacao(true);

            toastCustom.ToastCustomSuccess('Sucesso!', 'PCs removidas da retificação com sucesso.')  
            
            await carregaPcsRetificaveis();
            await carregaPcsEmRetificacao();
            await carregaConsolidado();
        }
    }

    const handleEditarMotivoRetificacao = async() => {
        let payload = {
            motivo: formRef.current.values.motivo_retificacao,
        }

        await patchMotivoRetificaoPcs(relatorio_consolidado_uuid, payload)
    }

    const mudarEstadoBotaoSalvarMotivo = (state) => {
        setEstadoBotaoSalvarMotivo(state)
    }
    
    const rowClassName = (rowData) => {
        if (rowData && rowData.pode_desfazer_retificacao === false) {
            return {'linha-desabilitada': true}
        }
    }

    const disparaModalDesfazerRetificacao = async() => {
        let erros = await validateFormRetificacao(formRef.current.values);

        if(erros && !erros.motivo_retificacao){
            let pcs_selecionadas = pcsEmRetificacao.filter((item) => (item.selecionado === true));
            let deve_apagar = pcs_selecionadas.length === pcsEmRetificacao.length;
    
            if(deve_apagar){
                setShowModalDeveApagarRetificacao(true);
            }
            else{
                setShowModalDesfazerRetificacao(true);
            }
        }  
    }

    const disparaModalRetificar = async() => {
        let erros = await validateFormRetificacao(formRef.current.values);

        if(erros && !erros.motivo_retificacao){
            setShowModal(true);
        } 
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
                                referenciaPublicacao={referenciaPublicacao}
                                onClickVoltar={onClickVoltar}
                                formataPeriodo={formataPeriodo}
                            />

                            <MotivoRetificacao
                                relatorioConsolidado={relatorioConsolidado}
                                validateFormRetificacao={validateFormRetificacao}
                                handleEditarMotivoRetificacao={handleEditarMotivoRetificacao}
                                estadoBotaoSalvarMotivo={estadoBotaoSalvarMotivo}
                                mudarEstadoBotaoSalvarMotivo={mudarEstadoBotaoSalvarMotivo}
                                ehEdicaoRetificacao={ehEdicaoRetificacao}
                                formErrors={formErrors}
                                formRef={formRef}
                            />
                            
                            {ehEdicaoRetificacao &&
                                <>
                                    <TituloTabela
                                        titulo={"Unidades com PCs em retificação"}
                                    />

                                    <Filtros
                                        tabelaAssociacoes={tabelaAssociacoes}
                                        handleSubmitFiltros={handleSubmitFiltrosPcsEmRetificacao}
                                        handleLimparFiltros={handleLimparFiltrosPcsEmRetificacao}
                                        initialValuesFiltros={initialValuesFiltrosPcsEmRetificacao}
                                    />

                                    {loadingPcsEmRetificacao ? (
                                        <div className="mt-5">
                                            <Loading
                                                corGrafico="black"
                                                corFonte="dark"
                                                marginTop="0"
                                                marginBottom="0"
                                            />
                                        </div>
                                    ) :
                                        <TabelaPcsEmRetificacao
                                            pcsEmRetificacao={pcsEmRetificacao}
                                            rowsPerPage={rowsPerPage}
                                            nomeComTipoTemplate={nomeComTipoTemplate}
                                            selecionarHeader={selecionarHeader}
                                            selecionarTemplatePcsEmRetificacao={selecionarTemplatePcsEmRetificacao}
                                            quantidadeSelecionadaEmRetificacao={quantidadeSelecionadaEmRetificacao}
                                            montagemDesfazerRetificacao={montagemDesfazerRetificacao}
                                            mensagemQuantidadeExibida={mensagemQuantidadeExibida}
                                            rowClassName={rowClassName}
                                        />
                                        
                                    }
                                </>
                            }

                            {todasAsPcsRetificaveis.length > 0 &&
                                <>
                                    <TituloTabela
                                    titulo={"Unidades com PCs não retificadas"}
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
                                </>   
                                    
                            }
                            <ModalAntDesignConfirmacao
                                handleShow={showModal}
                                titulo={"Confirmar Retificação"}
                                bodyText="Lembre-se que apenas as prestações de contas selecionadas serão reabertas para edição e gerarão novos documentos e nova lauda a ser publicada."
                                handleOk={(e) => handleRetificar()}
                                okText="Continuar"
                                handleCancel={(e) => setShowModal(false)}
                                cancelText="Cancelar"
                            />

                            <ModalAntDesignConfirmacao
                                handleShow={showModalDesfazerRetificacao}
                                titulo={"Desfazer Retificação"}
                                bodyText="Você confirma que deseja desfazer a retificação das PCs selecionadas?"
                                handleOk={(e) => handleDesfazerRetificao()}
                                okText="Confirmar"
                                handleCancel={(e) => setShowModalDesfazerRetificacao(false)}
                                cancelText="Cancelar"
                            />

                            <ModalAntDesignConfirmacao
                                handleShow={showModalDeveApagarRetificacao}
                                titulo={"Desfazer Retificação"}
                                bodyText="Você confirma que deseja desfazer a retificação de todas as PCs retificadas? Esta ação apagará a retificação da publicação."
                                handleOk={(e) => handleDesfazerRetificao(true)}
                                okText="Confirmar"
                                handleCancel={(e) => setShowModalDeveApagarRetificacao(false)}
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