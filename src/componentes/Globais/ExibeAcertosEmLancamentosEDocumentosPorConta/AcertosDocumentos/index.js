import React, {Fragment, memo, useCallback, useEffect, useState} from "react";
import {
    getAnaliseDocumentosPrestacaoConta,
    getDocumentosAjustes,
    postJustificarNaoRealizacaoDocumentoPrestacaoConta,
    postLimparStatusDocumentoPrestacaoConta,
    postMarcarComoDocumentoEsclarecido,
    postMarcarComoRealizadoDocumentoPrestacaoConta,
    postSalvarJustificativasAdicionais,
    postRestaurarJustificativasAdicionais
} from "../../../../services/dres/PrestacaoDeContas.service";
import TabelaAcertosDocumentos from "./TabelaAcertosDocumentos";
import {visoesService} from "../../../../services/visoes.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {barraMensagemCustom} from "../../BarraMensagem";
import BotoesDetalhesParaAcertosDeCategoriasDocumentos from "../BotoesDetalhesParaAcertosDeCategoriasDocumentos";
import Loading from "../../../../utils/Loading";
import { mantemEstadoAnaliseDre as meapcservice } from "../../../../services/mantemEstadoAnaliseDre.service";
import { ModalRestaurarJustificativa } from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/Modais/ModalRestaurarJustificativa";

const tagColors = {
    'JUSTIFICADO':  '#5C4EF8',
    'REALIZADO': '#198459',
}

const AcertosDocumentos = ({analiseAtualUuid, prestacaoDeContas, prestacaoDeContasUuid}) =>{

    const rowsPerPageAcertosDocumentos = 5;

    const [loadingDocumentos, setLoadingDocumentos] = useState(true)
    const [documentosAjustes, setDocumentosAjustes] = useState([])
    const [opcoesJustificativa, setOpcoesJustificativa] = useState([])
    const [expandedRowsDocumentos, setExpandedRowsDocumentos] = useState(null);
    const [textareaJustificativa, setTextareaJustificativa] = useState(() => {});
    const [showSalvar, setShowSalvar] = useState({});
    const [showSalvarEsclarecimento, setShowSalvarEsclarecimento] = useState({});
    const [showSalvarJustificativaAdicionais, setShowSalvarJustificativaAdicionais] = useState({});
    const [txtEsclarecimentoDocumento, setTxtEsclarecimentoDocumento] = useState({});
    const [txtJustificativasAdicionais, setTxtJustificativasAdicionais] = useState({});
    const [disableRestaurarJustificativa, setDisableRestaurarJustificativa] = useState({});
    const [analisePermiteEdicao, setAnalisePermiteEdicao] = useState()
    const [totalDeAcertosDosDocumentos, setTotalDeAcertosDosDocumentos] = useState(0);
    const [identificadorCheckboxClicado, setIdentificadorCheckboxClicado] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [showModalRestaurarJustificativa, setShowModalRestaurarJustificativa] = useState(false)
    const [acertoParaRestaurarJustificativa, setAcertoParaRestaurarJustificativa] = useState(null)

    useEffect(() => {
        let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado()
        let expanded_uuids = dados_analise_dre_usuario_logado.conferencia_de_documentos.expanded
        let lista_objetos_expanded = []

        for(let i=0; i<=expanded_uuids.length-1; i++){
            let uuid = expanded_uuids[i]
            let analise_encontrada = documentosAjustes.filter((item) => item.uuid === uuid)
            lista_objetos_expanded.push(...analise_encontrada)
        }

        if(lista_objetos_expanded.length > 0){
            setExpandedRowsDocumentos(lista_objetos_expanded)
        }

    }, [documentosAjustes])

    const getTotalDeAcertosDosDocumentos = useCallback(()=>{

        if (documentosAjustes && documentosAjustes.length > 0){
            let qtde = 0
            documentosAjustes.map((lancamento) =>
                qtde += lancamento.solicitacoes_de_ajuste_da_analise_total
            )
            setTotalDeAcertosDosDocumentos(qtde)
        }else {
            setTotalDeAcertosDosDocumentos(0)
        }

    }, [documentosAjustes])

    useEffect(()=>{
        getTotalDeAcertosDosDocumentos()
    }, [getTotalDeAcertosDosDocumentos])

    const carregaAcertosDocumentos = useCallback(async () => {

        setLoadingDocumentos(true)

        // Aqui TABELA
        const visao = visoesService.getItemUsuarioLogado('visao_selecionada.nome')
        let status_realizacao = await getAnaliseDocumentosPrestacaoConta(analiseAtualUuid, visao)

        setAnalisePermiteEdicao(status_realizacao.editavel)

        let documentosAjustes = await getDocumentosAjustes(analiseAtualUuid)

        // Necessário para iniciar check box dos documentos nao selecionadas
        let documentos_com_flag_selecionado = [];
        for(let documento=0; documento<=documentosAjustes.length-1; documento++){
            // Referente a row da tabela
            documentosAjustes[documento].selecionado = false;

            // Referente aos acertos dentro da row da tabela
            setaCheckBoxSolicitacoes(documentosAjustes[documento], false)

            documentos_com_flag_selecionado.push(documentosAjustes[documento])
        }


        setDocumentosAjustes(documentos_com_flag_selecionado)

        setOpcoesJustificativa(status_realizacao)

        setIdentificadorCheckboxClicado(false);
        setQuantidadeSelecionada(0);

        setLoadingDocumentos(false)
    }, [analiseAtualUuid])

    useEffect(()=>{
        carregaAcertosDocumentos()
    }, [carregaAcertosDocumentos])

    const guardaEstadoExpandedRowsDocumentos = useCallback(() => {
        if(expandedRowsDocumentos){
            let lista = []
            for(let i=0; i<=expandedRowsDocumentos.length-1; i++){
                lista.push(expandedRowsDocumentos[i].uuid)
            }

            salvaEstadoExpandedRowsDocumentosLocalStorage(lista)
        }
    }, [expandedRowsDocumentos])

    useEffect(() => {
        guardaEstadoExpandedRowsDocumentos()
    }, [guardaEstadoExpandedRowsDocumentos])

    const tagJustificativa = useCallback( (rowData) => {

        let status = '-'

        let statusId = rowData.status_realizacao

        if (statusId && statusId !== 'PENDENTE') {
            let nomeStatus = opcoesJustificativa.status_realizacao_solicitacao.find(justificativa => justificativa.id === statusId)

            status = nomeStatus?.nome ?? '-'
        }

        return (
            <div className="tag-justificativa"
                 style={{ backgroundColor: statusId ? tagColors[statusId] : 'none', color: statusId === 'PENDENTE' ? '#000' : '#fff' }}
            >
                {status}
            </div>
        )


    }, [opcoesJustificativa])

    const limparDocumentoStatus = async () => {
        try {
            setLoadingDocumentos(true)
            let selecionados = getSolicitacoesSelecionadas();
            await postLimparStatusDocumentoPrestacaoConta({"uuids_solicitacoes_acertos_documentos": selecionados.map(doc => doc.uuid)})
            await carregaAcertosDocumentos()
            setLoadingDocumentos(false)
        }catch (e) {
            console.log("Erro ao limparDocumentoStatus")
        }

    }

    const marcarDocumentoComoRealizado = async () => {
        try {
            let selecionados = getSolicitacoesSelecionadas();
            let response = await postMarcarComoRealizadoDocumentoPrestacaoConta({"uuids_solicitacoes_acertos_documentos": selecionados.map(doc => doc.uuid)})
            if (response && !response.todas_as_solicitacoes_marcadas_como_realizado){
                // Reaproveitando o modal CheckNaoPermitido
                setTituloModalCheckNaoPermitido('Não é possível marcar a solicitação como realizada')
                setTextoModalCheckNaoPermitido(`<p>${response.mensagem}</p>`)
                setShowModalCheckNaoPermitido(true)
            }
            await carregaAcertosDocumentos()
        }catch (e) {
            console.log("Erro ao marcarDocumentoComoRealizado")
        }

    }

    const justificarNaoRealizacaoDocumentos = async (textoConfirmadoJustificado) => {
        try {
            let selecionados = getSolicitacoesSelecionadas();
            let response = await postJustificarNaoRealizacaoDocumentoPrestacaoConta({
                "uuids_solicitacoes_acertos_documentos": selecionados.map(doc => doc.uuid),
                "justificativa": textoConfirmadoJustificado
            })

            if (response && !response.todas_as_solicitacoes_marcadas_como_justificado){
                // Reaproveitando o modal CheckNaoPermitido
                setTituloModalCheckNaoPermitido('Não é possível marcar a solicitação como justificada')
                setTextoModalCheckNaoPermitido(`<p>${response.mensagem}</p>`)
                setShowModalCheckNaoPermitido(true)
            }
            await carregaAcertosDocumentos()
        }catch (e) {
            console.log("Erro ao justificarNaoRealizacaoDocumentos")
        }
    }

    const marcarComoEsclarecido = async (data) => {
        let payload = {
            'esclarecimento': txtEsclarecimentoDocumento[data.uuid],
            'uuid_solicitacao_acerto': data.uuid,
        }
        try {

            await postMarcarComoDocumentoEsclarecido(payload)

            setShowSalvarEsclarecimento({
                ...showSalvarEsclarecimento,
                [data.uuid]: true
            });
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    const handleChangeTextareaJustificativa = (event, id) => {
        setShowSalvar({
            ...showSalvar,
            [id]: false
        })
        setTextareaJustificativa({
            ...textareaJustificativa,
            [id]: event.target.value
        })
    };

    const handleChangeTextareaEsclarecimentoDocumento = (event, id) => {
        setShowSalvarEsclarecimento({
            ...showSalvarEsclarecimento,
            [id]: false
        })
        setTxtEsclarecimentoDocumento({
            ...txtEsclarecimentoDocumento,
            [id]: event.target.value
        })
    }

    const handleChangeTextareaJustificativaAdicionais = (event, id) => {
        setShowSalvarJustificativaAdicionais({
            ...showSalvarJustificativaAdicionais,
            [id]: false
        })
        setTxtJustificativasAdicionais({
            ...txtJustificativasAdicionais,
            [id]: event.target.value
        })
    }

    const handleOnClickSalvarJustificativa = (acerto_uuid) => {
        salvarJustificativa(acerto_uuid);
    }

    const salvarJustificativa = async (acerto_uuid) => {
        try {
            let payload = {
                'justificativa': textareaJustificativa[acerto_uuid],
                "uuids_solicitacoes_acertos_documentos": [acerto_uuid],
            }
            await postJustificarNaoRealizacaoDocumentoPrestacaoConta(payload)
            setShowSalvar({
                ...showSalvar,
                [acerto_uuid]: true
            });
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    const possuiSolicitacaoEsclarecimento = (value) => {
        if(value){
            return value.tipo_acerto.categoria === 'SOLICITACAO_ESCLARECIMENTO';
        }
        return false;
    }

    const salvarDesabilitadosEsclarecimento = (acerto) => {
        return !txtEsclarecimentoDocumento?.[acerto.uuid] || txtEsclarecimentoDocumento?.[acerto.uuid] === acerto.esclarecimentos || showSalvarEsclarecimento?.[acerto.uuid] || !analisePermiteEdicao
    }

    const salvarDesabilitadosJustificativa = (acerto) => {
        return !textareaJustificativa?.[acerto.uuid] || textareaJustificativa?.[acerto.uuid] === acerto.justificativa || showSalvar?.[acerto.uuid] || !analisePermiteEdicao
    }

    const possuiSolicitacaoEdicaoInformacao = (value) => {
        if(value){
            return value.tipo_acerto.categoria === 'EDICAO_INFORMACAO';
        }
        return false;
    }

    const salvarDesabilitadosJustificativasAdicionais = (acerto) => {
        return !txtJustificativasAdicionais?.[acerto.uuid] || txtJustificativasAdicionais?.[acerto.uuid] === acerto.justificativa_conciliacao || showSalvarJustificativaAdicionais?.[acerto.uuid] || !analisePermiteEdicao
    }

    const salvarJustificativasAdicionais = async (data, acerto) => {

        let payload = {
            'justificativa_conciliacao': txtJustificativasAdicionais[acerto.uuid],
            'uuid_analise_documento': data.uuid,
        }

        try {

            await postSalvarJustificativasAdicionais(payload)

            setShowSalvarJustificativaAdicionais({
                ...showSalvarJustificativaAdicionais,
                [acerto.uuid]: true
            });

            setDisableRestaurarJustificativa({
                ...disableRestaurarJustificativa,
                [acerto.uuid]: false
            });

            await carregaAcertosDocumentos()
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    const verificaDisableRestaurarJustificativa = (acerto) => {
        if(disableRestaurarJustificativa){
            let justificativa = acerto.justificativa_conciliacao
            let justificativa_original = acerto.justificativa_conciliacao_original

            if(justificativa !== justificativa_original){
                return false;
            }

            if(Object.keys(disableRestaurarJustificativa).length === 0){
                return true;
            }

            if(disableRestaurarJustificativa[acerto.uuid] === undefined){
                return true;
            }
            
            return disableRestaurarJustificativa[acerto.uuid];
        }

        return true;
    }

    const onClickRestaurarJustificativa = (acerto) => {
        setAcertoParaRestaurarJustificativa(acerto);
        setShowModalRestaurarJustificativa(true);
    }

    const acaoRestaurarJustificativa = async() => {
        let uuid_acerto = acertoParaRestaurarJustificativa.uuid;
        let justificativa_original = acertoParaRestaurarJustificativa.justificativa_conciliacao_original

        let payload = {
            "uuid_solicitacao_acerto": uuid_acerto
        }

        try {

            await postRestaurarJustificativasAdicionais(payload)

            setAcertoParaRestaurarJustificativa(null);
            setShowModalRestaurarJustificativa(false);

            setShowSalvarJustificativaAdicionais({
                ...showSalvarJustificativaAdicionais,
                [uuid_acerto]: false
            });

            setTxtJustificativasAdicionais({
                ...txtJustificativasAdicionais,
                [uuid_acerto]: justificativa_original
            })

            setDisableRestaurarJustificativa({
                ...disableRestaurarJustificativa,
                [uuid_acerto]: true
            });

            await carregaAcertosDocumentos()
        } catch (e) {
            console.log("Erro: ", e.message)
        } 
    }

    const rowExpansionTemplateDocumentos = (data) => {
        if (data && data.solicitacoes_de_ajuste_da_analise && data.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.length > 0) {

            return (
                <>
                    {data.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.map((categoria, index) =>(

                        <Fragment key={index}>

                            {categoria && categoria.acertos.length > 0 &&

                                <div className="p-3 mb-2 bg-white text-dark container-categorias-acertos">

                                    {categoria.requer_ajustes_externos &&
                                        <div className='row mb-2'>
                                            <div className='col-12'>
                                                {barraMensagemCustom.BarraMensagemAcertoExterno("Acerto externo ao sistema.")}
                                            </div>
                                        </div>
                                    }

                                    {categoria && categoria.acertos.length > 0 && categoria.acertos.map((acerto) => (

                                        <div key={acerto.uuid} className='border-bottom py-2'>
                                            <div className='row'>
                                                <div className='col-auto'>
                                                    <p className='texto-numero-do-item'><strong>Item: {acerto.ordem}</strong></p>
                                                </div>
                                                <div className='col'>
                                                    <p className='mb-0'><strong>Tipo de acerto:</strong></p>
                                                    <p className='mb-0'>{acerto.tipo_acerto.nome}</p>
                                                </div>

                                                {acerto.detalhamento ? (
                                                        <div className='col'>
                                                            <p className='mb-0'><strong>Detalhamento:</strong></p>
                                                            <p className='mb-0'>{acerto.detalhamento}</p>
                                                        </div>
                                                    ) :

                                                    <div className='col'>
                                                        <p className='mb-0' style={{color:"#fff"}}><strong>Detalhamento:</strong></p>
                                                    </div>

                                                }
                                                <div className='col'>
                                                    <p className='mb-0'><strong>Status:</strong></p>
                                                    {tagJustificativa(acerto)}
                                                </div>

                                                {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' && visoesService.getPermissoes(["change_analise_dre"]) && prestacaoDeContas.status === "DEVOLVIDA" && analisePermiteEdicao &&
                                                    <div className='col-auto'>
                                                        <input
                                                            type="checkbox"
                                                            id={`acerto_${acerto}`}
                                                            name="topping"
                                                            value={acerto.uuid}
                                                            checked={acerto.selecionado}
                                                            onChange={(event) => tratarSelecionadoIndividual(event, data, acerto)}
                                                        />
                                                    </div>
                                                }
                                            </div>

                                            {acerto.justificativa?.length > 0 && (
                                                <div className="row">
                                                    <div className="col-12 px-4 py-2">
                                                        <div className='titulo-row-expanded-conferencia-de-lancamentos mb-3'>
                                                            <p className='mb-1'><strong>Justificativa</strong></p>
                                                        </div>
                                                    </div>
                                                    <div className="form-group w-100 px-4 py-2" id="pointer-event-all">
                                                        <textarea
                                                            defaultValue={acerto.justificativa}
                                                            onChange={(event) => handleChangeTextareaJustificativa(event, acerto.uuid)}
                                                            className="form-control"
                                                            rows="3"
                                                            id="justificativa"
                                                            name="justificativa"
                                                            placeholder="Escreva o comentário"
                                                            disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA' || !analisePermiteEdicao}
                                                        >
                                                        </textarea>
                                                        <div className="bd-highlight d-flex justify-content-end align-items-center">

                                                            {showSalvar?.[acerto.uuid] &&
                                                                <div className="">
                                                                    <p className="mr-2 mt-3">
                                                                        <span className="mr-1">
                                                                            <FontAwesomeIcon
                                                                                style={{fontSize: '16px', color: '#297805'}}
                                                                                icon={faCheck}
                                                                            />
                                                                        </span>
                                                                        Salvo
                                                                    </p>
                                                                </div>
                                                            }
                                                            <button
                                                                disabled={salvarDesabilitadosJustificativa(acerto)}
                                                                type="button"
                                                                className={`btn btn-${salvarDesabilitadosJustificativa(acerto) ? 'secondary' : 'success'} mt-2 mb-0`}
                                                                onClick={() => handleOnClickSalvarJustificativa(acerto.uuid)}
                                                            >
                                                                <strong>Salvar Justificativas</strong>
                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>
                                            )}


                                            {possuiSolicitacaoEsclarecimento(acerto) &&
                                                <div className="form-group w-100 col-12 px-3" id="pointer-event-all">
                                                    <div className='titulo-row-expanded-conferencia-de-lancamentos mb-4 '>
                                                        <p className='mb-1'><strong>Esclarecimento do documento</strong></p>
                                                    </div>
                                                    <textarea
                                                        rows="4"
                                                        cols="50"
                                                        name='esclarecimento'
                                                        defaultValue={acerto.esclarecimentos}
                                                        onChange={(event) => handleChangeTextareaEsclarecimentoDocumento(event, acerto.uuid)}
                                                        className="form-control"
                                                        placeholder="Digite aqui o esclarecimento"
                                                        disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA' || !analisePermiteEdicao || acerto.status_realizacao === "JUSTIFICADO"}
                                                    />
                                                </div>
                                            }

                                            <div className="bd-highlight d-flex justify-content-end align-items-center" id="pointer-event-all">
                                                {showSalvarEsclarecimento?.[acerto.uuid] &&
                                                    <div className="">
                                                        <p className="mr-2 mt-3">
                                                            <span className="mr-1">
                                                                <FontAwesomeIcon
                                                                    style={{fontSize: '16px', color: '#297805'}}
                                                                    icon={faCheck}
                                                                />
                                                            </span>
                                                            Salvo
                                                        </p>
                                                    </div>
                                                }
                                                {possuiSolicitacaoEsclarecimento(acerto) &&
                                                    <button
                                                        disabled={salvarDesabilitadosEsclarecimento(acerto) || !analisePermiteEdicao}
                                                        type="button"
                                                        className={`btn btn-${salvarDesabilitadosEsclarecimento(acerto) ? 'secondary' : 'success'} mr-3`}
                                                        onClick={() => marcarComoEsclarecido(acerto)}
                                                    >
                                                        <strong>Salvar esclarecimento</strong>
                                                    </button>
                                                }
                                            </div>

                                            {possuiSolicitacaoEdicaoInformacao(acerto) &&
                                                <div className="form-group w-100 col-12 px-3" id="pointer-event-all">
                                                    <div className='titulo-row-expanded-conferencia-de-lancamentos mb-4 '>
                                                        <p className='mb-1'><strong>Justificativas e informações adicionais</strong></p>
                                                    </div>

                                                    {acerto.justificativa_conciliacao_original !== null && acerto.justificativa_conciliacao_original !== "" && visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' && analisePermiteEdicao && prestacaoDeContas.status === 'DEVOLVIDA' &&
                                                        <div className="d-flex justify-content-end mb-2">
                                                            <button
                                                                className='btn btn-link link-restaurar-justificativa text-center restaurar-justificativa'
                                                                disabled={verificaDisableRestaurarJustificativa(acerto) || ![['change_analise_dre']].some(visoesService.getPermissoes)}
                                                                onClick={() => onClickRestaurarJustificativa(acerto)}
                                                                title="A opção Restaurar justificativas permite retornar ao texto original da justificativa informado no Demonstrativo Financeiro da Conta."
                                                            >
                                                                <strong>Restaurar Justificativas</strong>
                                                            </button>
                                                        </div>
                                                    }
                                                    
                                                    <textarea
                                                        rows="4"
                                                        cols="50"
                                                        name='justificativas_informacoes_adicionais'
                                                        defaultValue={acerto.justificativa_conciliacao}
                                                        onChange={(event) => handleChangeTextareaJustificativaAdicionais(event, acerto.uuid)}
                                                        className="form-control"
                                                        placeholder="Digite a justificativa"
                                                        disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA' || !analisePermiteEdicao}
                                                    />
                                                </div>
                                            }

                                            <div className="bd-highlight d-flex justify-content-end align-items-center" id="pointer-event-all">
                                                {showSalvarJustificativaAdicionais?.[acerto.uuid] &&
                                                    <div className="">
                                                        <p className="mr-2 mt-3">
                                                            <span className="mr-1">
                                                                <FontAwesomeIcon
                                                                    style={{fontSize: '16px', color: '#297805'}}
                                                                    icon={faCheck}
                                                                />
                                                            </span>
                                                            Salvo
                                                        </p>
                                                    </div>
                                                }
                                                {possuiSolicitacaoEdicaoInformacao(acerto) &&
                                                    <button
                                                        disabled={salvarDesabilitadosJustificativasAdicionais(acerto) || !analisePermiteEdicao}
                                                        type="button"
                                                        className={`btn btn-${salvarDesabilitadosJustificativasAdicionais(acerto) ? 'secondary' : 'success'} mr-3`}
                                                        onClick={() => salvarJustificativasAdicionais(data, acerto)}
                                                    >
                                                        <strong>Salvar justificativas</strong>
                                                    </button>
                                                }
                                            </div>

                                            <BotoesDetalhesParaAcertosDeCategoriasDocumentos
                                                analise_documento={categoria}
                                                acerto={acerto}
                                                uuid_acerto_documento={acerto.uuid}
                                                prestacaoDeContasUuid={prestacaoDeContasUuid}
                                                prestacaoDeContas={prestacaoDeContas}
                                                analisePermiteEdicao={analisePermiteEdicao}
                                            />

                                        </div>
                                    ))}

                                </div>
                            }

                        </Fragment>
                    ))}
                </>
            )
        }
    };

    // ############# Métodos para Seleção
    const [tituloModalCheckNaoPermitido, setTituloModalCheckNaoPermitido] = useState('Seleção não permitida')
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)

    const selecionarTodosItensDosDocumentosGlobal = () => {
        return (
            <div className="align-middle">
                <input
                    checked={identificadorCheckboxClicado}
                    type="checkbox"
                    value=""
                    onChange={(e) => selecionarTodosGlobal(e.target)}
                    name="checkHeader"
                    id="checkHeader"
                    disabled={false}
                />
            </div>
        )
    }

    const selecionarTodosItensDoDocumentoRow = (rowData) => {
        return (
            <input
                checked={documentosAjustes.filter(element => element.uuid === rowData.uuid)[0].selecionado}
                type="checkbox"
                value=""
                onChange={(e) => tratarSelecionado(e, rowData.uuid)}
                name="checkHeader"
                id="checkHeader"
                disabled={false}
            />
        );
    }

    const salvaEstadoExpandedRowsDocumentosLocalStorage = (lista) => {
        let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado();
        dados_analise_dre_usuario_logado.conferencia_de_documentos.expanded = lista
        meapcservice.setAnaliseDrePorUsuario(visoesService.getUsuarioLogin(), dados_analise_dre_usuario_logado)
    }

    const setaCheckBoxSolicitacoes = (obj, flag) => {
        let solicitacoes_acerto_por_categoria = obj.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria;

        for(let solicitacao=0; solicitacao<=solicitacoes_acerto_por_categoria.length-1; solicitacao++){
            let acertos = solicitacoes_acerto_por_categoria[solicitacao].acertos;

            for(let acerto=0; acerto<=acertos.length-1; acerto++){
                acertos[acerto].selecionado = flag;
            }
        }
    }

    const selecionarTodosGlobal = (e) => {
        if(identificadorCheckboxClicado){
            let result = documentosAjustes.reduce((acc, o) => {
                let obj_completo = o;
                obj_completo.selecionado = false;

                setaCheckBoxSolicitacoes(obj_completo, false);

                acc.push(obj_completo);
                return acc;
            }, [])
    
            setDocumentosAjustes(result);
            setIdentificadorCheckboxClicado(false);
            
            let qtde = getQuantidadeAcertosSelecionados();
            setQuantidadeSelecionada(qtde);
        }
        else{
            let result = documentosAjustes.reduce((acc, o) => {
                let obj_completo = o;
                obj_completo.selecionado = true;

                setaCheckBoxSolicitacoes(obj_completo, true);
            
                acc.push(obj_completo);
                return acc;
            }, [])
    
            setDocumentosAjustes(result);
            setIdentificadorCheckboxClicado(true);
            
            let qtde = getQuantidadeAcertosSelecionados();
            setQuantidadeSelecionada(qtde);
        }
    }

    const getQuantidadeAcertosSelecionados = () => {
        let quantidade = 0;

        for(let i=0; i<=documentosAjustes.length-1; i++){
            let solicitacoes_acerto_por_categoria = documentosAjustes[i].solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria;
        
            for(let x=0; x<=solicitacoes_acerto_por_categoria.length-1; x++){
                let solicitacao = solicitacoes_acerto_por_categoria[x];
                let acertos_selecionados = solicitacao.acertos.filter(element => element.selecionado === true)
    
                if(acertos_selecionados.length > 0){
                    quantidade = quantidade + acertos_selecionados.length;
                }
            }
        
        }

        return quantidade;
    }

    const tratarSelecionado = (e, uuid) => {
        let result2 = documentosAjustes.reduce((acc, o) => {
            let obj_completo = o;

            if(obj_completo.uuid === uuid){
                obj_completo.selecionado = e.target.checked;

                setaCheckBoxSolicitacoes(obj_completo, e.target.checked)

                if(todosDocumentosCheckados()){
                    setIdentificadorCheckboxClicado(true);
                }
                else{
                    setIdentificadorCheckboxClicado(false);
                }
            }
        
            acc.push(obj_completo);
            return acc;
        }, []);
        setDocumentosAjustes(result2);
        
        let qtde = getQuantidadeAcertosSelecionados();
        setQuantidadeSelecionada(qtde);
    }

    const todosDocumentosCheckados = () => {
        let total_documentos = documentosAjustes.length;
        let total_documentos_selecionados = 0;
        
        let documentos_selecionados = documentosAjustes.filter(element => element.selecionado === true);
        
        if(documentos_selecionados.length > 0){
            total_documentos_selecionados = documentos_selecionados.length;
        }

        
        if(total_documentos === total_documentos_selecionados){
            return true;
        }

        return false;
    }

    const tratarSelecionadoIndividual = (e, data, acerto) => {
        let result2 = documentosAjustes.reduce((acc, o) => {
            let obj_completo = o;

            if(obj_completo.uuid === data.uuid){
                let solicitacoes_acerto_por_categoria = obj_completo.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria; 

                for(let i=0; i<=solicitacoes_acerto_por_categoria.length-1; i++){
                    let acertos = solicitacoes_acerto_por_categoria[i].acertos;
                    
                    for(let x=0; x<=acertos.length-1; x++){
                        
                        if(acertos[x].uuid === acerto.uuid){
                            acertos[x].selecionado = e.target.checked;
                            
                            if(todosAcertosCheckados(data)){
                                obj_completo.selecionado = true;

                                if(todosDocumentosCheckados()){
                                    setIdentificadorCheckboxClicado(true);
                                }
                                else{
                                    setIdentificadorCheckboxClicado(false);
                                }
                            }
                            else{
                                obj_completo.selecionado = false;
                                
                                if(todosDocumentosCheckados()){
                                    setIdentificadorCheckboxClicado(true);
                                }
                                else{
                                    setIdentificadorCheckboxClicado(false);
                                }
                            }
                        }
                    }
                }
                
            }
        
            acc.push(obj_completo);
            return acc;
        }, []);

        setDocumentosAjustes(result2);
        
        let qtde = getQuantidadeAcertosSelecionados();
        setQuantidadeSelecionada(qtde);
    }

    const todosAcertosCheckados = (data) => {
        let solicitacoes_acerto_por_categoria = data.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria;
        let total_acertos = data.solicitacoes_de_ajuste_da_analise_total;
        let total_selecionados = 0;

        for(let i=0; i<=solicitacoes_acerto_por_categoria.length-1; i++){
            let solicitacao = solicitacoes_acerto_por_categoria[i];

            let acertos_selecionados = solicitacao.acertos.filter(element => element.selecionado === true)
            if(acertos_selecionados.length > 0){
                total_selecionados = total_selecionados + acertos_selecionados.length
            }
        }

        if(total_acertos === total_selecionados){
            return true;
        }

        return false;
    }

    const acoesDisponiveis = () => {
        let selecionados = getSolicitacoesSelecionadas();

        let status_selecionados = {
            JUSTIFICADO_E_REALIZADO: false,
            REALIZADO_E_PENDENTE: false,
            JUSTIFICADO_E_REALIZADO_E_PENDENTE: false,
            JUSTIFICADO_E_PENDENTE: false,

            REALIZADO: false,
            JUSTIFICADO: false,
            PENDENTE: false
        }

        let selecionados_status_pendente = selecionados.filter(element => element.status_realizacao === "PENDENTE");
        let selecionados_status_justificado = selecionados.filter(element => element.status_realizacao === "JUSTIFICADO");
        let selecionados_status_realizado = selecionados.filter(element => element.status_realizacao === "REALIZADO");

        // Logica status conjunto
        if(selecionados_status_justificado.length > 0 && selecionados_status_realizado.length > 0 && selecionados_status_pendente.length === 0){
            status_selecionados.JUSTIFICADO_E_REALIZADO = true;
        }
        else if(selecionados_status_realizado.length > 0 && selecionados_status_pendente.length > 0 && selecionados_status_justificado.length === 0){
            status_selecionados.REALIZADO_E_PENDENTE = true;
        }
        else if(selecionados_status_justificado.length > 0 && selecionados_status_realizado.length > 0 && selecionados_status_pendente.length > 0){
            status_selecionados.JUSTIFICADO_E_REALIZADO_E_PENDENTE = true;
        }
        else if(selecionados_status_justificado.length > 0 && selecionados_status_pendente.length > 0 && selecionados_status_realizado.length === 0){
            status_selecionados.JUSTIFICADO_E_PENDENTE = true;
        }

        // Logica status individuais
        else if(selecionados_status_realizado.length > 0 && selecionados_status_justificado.length === 0 && selecionados_status_pendente.length === 0){
            status_selecionados.REALIZADO = true;
        }
        else if(selecionados_status_justificado.length > 0 && selecionados_status_realizado.length === 0 && selecionados_status_pendente.length === 0){
            status_selecionados.JUSTIFICADO = true;
        }
        else if(selecionados_status_pendente.length > 0 && selecionados_status_realizado.length === 0 && selecionados_status_justificado.length === 0){
            status_selecionados.PENDENTE = true;
        }

        return status_selecionados;

    }

    const getSolicitacoesSelecionadas = () => {
        let selecionados = [];

        for(let i=0; i<=documentosAjustes.length-1; i++){
            let solicitacoes_acerto_por_categoria = documentosAjustes[i].solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria;
        
            for(let x=0; x<=solicitacoes_acerto_por_categoria.length-1; x++){
                let solicitacao = solicitacoes_acerto_por_categoria[x];
                let acertos_selecionados = solicitacao.acertos.filter(element => element.selecionado === true)
    
                if(acertos_selecionados.length > 0){
                    selecionados.push(...acertos_selecionados)
                }
            }
        }

        return selecionados;
    }

    const acaoCancelar = () => {
        let documentos_com_flag_selecionado = [];
        let documentos_ajustes = documentosAjustes;

        for(let documento=0; documento<=documentos_ajustes.length-1; documento++){
            documentos_ajustes[documento].selecionado = false;
            
            setaCheckBoxSolicitacoes(documentos_ajustes[documento], false)
            documentos_com_flag_selecionado.push(documentos_ajustes[documento])
        }

        setDocumentosAjustes(documentos_com_flag_selecionado);
        setIdentificadorCheckboxClicado(false);
        setQuantidadeSelecionada(0);
    }

    return(
        <>
            <hr className="mt-4 mb-3"/>
            <h5 className="mb-4 mt-4"><strong>Acertos nos documentos</strong></h5>

            {loadingDocumentos ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                <TabelaAcertosDocumentos
                    documentosAjustes={documentosAjustes}
                    prestacaoDeContas={prestacaoDeContas}
                    marcarDocumentoComoRealizado={marcarDocumentoComoRealizado}
                    limparDocumentoStatus={limparDocumentoStatus}
                    rowsPerPageAcertosDocumentos={rowsPerPageAcertosDocumentos}
                    justificarNaoRealizacaoDocumentos={justificarNaoRealizacaoDocumentos}
                    expandedRowsDocumentos={expandedRowsDocumentos}
                    setExpandedRowsDocumentos={setExpandedRowsDocumentos}
                    rowExpansionTemplateDocumentos={rowExpansionTemplateDocumentos}
                    tituloModalCheckNaoPermitido={tituloModalCheckNaoPermitido}
                    textoModalCheckNaoPermitido={textoModalCheckNaoPermitido}
                    showModalCheckNaoPermitido={showModalCheckNaoPermitido}
                    setShowModalCheckNaoPermitido={setShowModalCheckNaoPermitido}
                    selecionarTodosItensDosDocumentosGlobal={selecionarTodosItensDosDocumentosGlobal}
                    totalDeAcertosDosDocumentos={totalDeAcertosDosDocumentos}
                    selecionarTodosItensDoDocumentoRow={selecionarTodosItensDoDocumentoRow}
                    opcoesJustificativa={opcoesJustificativa}
                    analisePermiteEdicao={analisePermiteEdicao}
                    quantidadeSelecionada={quantidadeSelecionada}
                    acoesDisponiveis={acoesDisponiveis}
                    acaoCancelar={acaoCancelar}
                />

                    <section>
                        <ModalRestaurarJustificativa
                            show={showModalRestaurarJustificativa}
                            titulo='Restaurar justificativa'
                            texto={'Deseja restaurar o texto original da justificativa?'}
                            primeiroBotaoTexto="Confirmar"
                            primeiroBotaoCss="success"
                            primeiroBotaoOnclick={() => acaoRestaurarJustificativa() }
                            segundoBotaoTexto="Cancelar"
                            segundoBotaoCss="danger"
                            handleClose={() => setShowModalRestaurarJustificativa(false)}
                        />
                    </section>
                </>
            }
        </>
    )
}

export default memo(AcertosDocumentos)