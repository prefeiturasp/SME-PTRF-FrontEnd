import React, {Fragment, memo, useCallback, useEffect, useState} from "react";
import {
    getAnaliseDocumentosPrestacaoConta,
    getDocumentosAjustes,
    postJustificarNaoRealizacaoDocumentoPrestacaoConta,
    postLimparStatusDocumentoPrestacaoConta,
    postMarcarComoDocumentoEsclarecido,
    postMarcarComoRealizadoDocumentoPrestacaoConta
} from "../../../../services/dres/PrestacaoDeContas.service";
import TabelaAcertosDocumentos from "./TabelaAcertosDocumentos";
import {visoesService} from "../../../../services/visoes.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {barraMensagemCustom} from "../../BarraMensagem";
import BotoesDetalhesParaAcertosDeCategoriasDocumentos from "../BotoesDetalhesParaAcertosDeCategoriasDocumentos";
import Loading from "../../../../utils/Loading";
import Dropdown from "react-bootstrap/Dropdown";

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
    const [txtEsclarecimentoDocumento, setTxtEsclarecimentoDocumento] = useState({});
    const [analisePermiteEdicao, setAnalisePermiteEdicao] = useState()
    const [totalDeAcertosDosDocumentos, setTotalDeAcertosDosDocumentos] = useState(0)

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

        setDocumentosAjustes(documentosAjustes)

        setOpcoesJustificativa(status_realizacao)

        setDocumentosSelecionados([])
        setIdentificadorCheckboxClicado([{
            uuid: ''
        }])


        setLoadingDocumentos(false)
    }, [analiseAtualUuid])

    useEffect(()=>{
        carregaAcertosDocumentos()
    }, [carregaAcertosDocumentos])

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

    const limparDocumentoStatus = async (documentosSelecionados) => {
        try {
            setLoadingDocumentos(true)
            await postLimparStatusDocumentoPrestacaoConta({"uuids_solicitacoes_acertos_documentos": documentosSelecionados.map(doc => doc.uuid)})
            await carregaAcertosDocumentos()
            setLoadingDocumentos(false)
        }catch (e) {
            console.log("Erro ao limparDocumentoStatus")
        }

    }

    const marcarDocumentoComoRealizado = async (documentosSelecionados) => {
        try {
            let response = await postMarcarComoRealizadoDocumentoPrestacaoConta({"uuids_solicitacoes_acertos_documentos": documentosSelecionados.map(doc => doc.uuid)})
            if (response && !response.todas_as_solicitacoes_marcadas_como_realizado){
                // Reaproveitando o modal CheckNaoPermitido
                setTituloModalCheckNaoPermitido('Solicitações marcadas como realizado')
                setTextoModalCheckNaoPermitido(`<p>${response.mensagem}</p>`)
                setShowModalCheckNaoPermitido(true)
            }
            await carregaAcertosDocumentos()
        }catch (e) {
            console.log("Erro ao marcarDocumentoComoRealizado")
        }

    }

    const justificarNaoRealizacaoDocumentos = async (documentosSelecionados, textoConfirmadoJustificado) => {
        try {
            await postJustificarNaoRealizacaoDocumentoPrestacaoConta({
                "uuids_solicitacoes_acertos_documentos": documentosSelecionados.map(doc => doc.uuid),
                "justificativa": textoConfirmadoJustificado
            })
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

    const rowExpansionTemplateDocumentos = (data) => {
        if (data && data.solicitacoes_de_ajuste_da_analise && data.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.length > 0) {

            return (
                <>
                    {data.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.map((categoria, index) =>(

                        <Fragment key={index}>

                            {categoria && categoria.acertos.length > 0 &&

                                <div className="p-3 mb-2 bg-white text-dark container-categorias-acertos">

                                    {categoria && categoria.acertos.length > 1 &&
                                        <div className='mb-0 text-right border-bottom'>
                                            {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' && visoesService.getPermissoes(["change_analise_dre"]) && prestacaoDeContas.status === "DEVOLVIDA" && analisePermiteEdicao &&
                                                selecionarTodosItensDaCategoriaDoLancamento(categoria)
                                            }
                                        </div>
                                    }

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
                                                            checked={documentosSelecionados.includes(acerto)}
                                                            onChange={(event) => selecionarItemIndividual(event, acerto, acerto.status_realizacao)}
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
                                                        disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA' || !analisePermiteEdicao}
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
    const [documentosSelecionados, setDocumentosSelecionados] = useState([])
    const [status, setStatus] = useState()
    const [tituloModalCheckNaoPermitido, setTituloModalCheckNaoPermitido] = useState('Seleção não permitida')
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)

    const [identificadorCheckboxClicado, setIdentificadorCheckboxClicado] = useState([{
        uuid: '',
    }])


    const verificaSePodeSerSelecionado = (statusId) => {
        if (documentosSelecionados && documentosSelecionados.length > 0){
            if (documentosSelecionados[0].status_realizacao !== statusId){
                setTituloModalCheckNaoPermitido('Seleção não permitida')
                setTextoModalCheckNaoPermitido('<p>Esse documento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>')
                setShowModalCheckNaoPermitido(true)
                return false
            }else {
                return true
            }
        }else {
            return true
        }
    }

    const limparDocumentos = ({rowData, categoria}) => {

        if (categoria){
            // eslint-disable-next-line array-callback-return
            categoria.acertos.map((acerto) => {
                    setDocumentosSelecionados((current) => current.filter((item) => item !== acerto));
                }
            )
            setIdentificadorCheckboxClicado((current) => current.filter((item) => item.uuid !== categoria.categoria));

        }else if (rowData){
            rowData.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.map((categoria) =>
                // eslint-disable-next-line array-callback-return
                categoria.acertos.map((acerto) => {
                    setDocumentosSelecionados((current) => current.filter((item) => item !== acerto));
                    }
                )
            )
            setIdentificadorCheckboxClicado((current) => current.filter((item) => item.uuid !== rowData.uuid))

        }else {
            setDocumentosSelecionados([])
            setIdentificadorCheckboxClicado([{
                uuid: '',
            }])
        }
    }

    const selecionarPorStatusTodosItensDosDocumentos = (event, statusId) => {
        event.preventDefault()

        documentosAjustes.map((lancamento) =>
            lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.map((categoria) =>
                // eslint-disable-next-line array-callback-return
                categoria.acertos.map((acerto) => {

                    if (verificaSePodeSerSelecionado(statusId)) {

                        setStatus(statusId)

                        if (acerto.status_realizacao === statusId) {
                            if (!documentosSelecionados.includes(acerto)) {
                                setDocumentosSelecionados((array) => [...array, acerto]);
                            }
                        } else {
                            setDocumentosSelecionados((current) => current.filter((item) => item !== acerto));
                        }
                    }
                })
            )
        )
        if (verificaSePodeSerSelecionado(statusId)) {
            setIdentificadorCheckboxClicado((array) => [...array, {uuid: 'TODOS'}]);
        }
    }

    const selecionarTodosItensDosDocumentos = () => {
        return (
            <div className="align-middle">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="p-0">
                        <input
                            checked={identificadorCheckboxClicado.some(uuid => uuid.uuid === 'TODOS') && documentosSelecionados.length > 0}
                            type="checkbox"
                            value=""
                            onChange={(e) => e}
                            name="checkHeader"
                            id="checkHeader"
                            disabled={false}
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="super-colors" id='dropdown-menu-tabela-acertos-lancamentos'>
                        <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDosDocumentos(e, 'REALIZADO')}>Selecionar todos realizados</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDosDocumentos(e, 'JUSTIFICADO')}>Selecionar todos justificados</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDosDocumentos(e, 'PENDENTE')}>Selecionar todos sem status </Dropdown.Item>
                        <Dropdown.Item onClick={()=>limparDocumentos({rowData: null, categoria: null}) }>Desmarcar todos</Dropdown.Item>
                    </Dropdown.Menu>

                </Dropdown>
            </div>
        )
    }

    const selecionarPorStatusTodosItensDoDocumento = (event, statusId, rowData) => {
        event.preventDefault()

        rowData.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.map((categoria) =>
            // eslint-disable-next-line array-callback-return
            categoria.acertos.map((acerto) => {

                if (verificaSePodeSerSelecionado(statusId)) {

                    setStatus(statusId)

                    if (acerto.status_realizacao === statusId) {
                        if (!documentosSelecionados.includes(acerto)) {
                            setDocumentosSelecionados((array) => [...array, acerto]);
                        }
                    } else {
                        setDocumentosSelecionados((current) => current.filter((item) => item !== acerto));
                    }
                }
            })
        )
        if (verificaSePodeSerSelecionado(statusId)) {
            setIdentificadorCheckboxClicado((array) => [...array, {uuid: rowData.uuid}]);
        }
    }

    const selecionarTodosItensDoDocumento = (rowData) => {
        return (
            <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                    <input
                        checked={ (identificadorCheckboxClicado.some(uuid => uuid.uuid === 'TODOS') && documentosSelecionados.length > 0 ) || (identificadorCheckboxClicado.some(uuid => uuid.uuid === rowData.uuid) && documentosSelecionados.length > 0) }
                        type="checkbox"
                        value=""
                        onChange={(e) => e}
                        name="checkHeader"
                        id="checkHeader"
                        disabled={false}
                    />
                </Dropdown.Toggle>

                <Dropdown.Menu className="super-colors" id='dropdown-menu-tabela-acertos-lancamentos'>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDoDocumento(e, 'REALIZADO', rowData)}>Selecionar todos realizados</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDoDocumento(e, 'JUSTIFICADO', rowData)}>Selecionar todos justificados</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDoDocumento(e, 'PENDENTE', rowData)}>Selecionar todos sem status </Dropdown.Item>
                    <Dropdown.Item onClick={()=>limparDocumentos({rowData: rowData, categoria: null})}>Desmarcar todos</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    const selecionarPorStatusTodosItensDaCategoriaDoDocumento = (event, statusId, categoria) => {
        event.preventDefault()

        // eslint-disable-next-line array-callback-return
        categoria.acertos.map((acerto) => {
                if (verificaSePodeSerSelecionado(statusId)){
                    setStatus(statusId)
                    if (acerto.status_realizacao === statusId) {
                        if (!documentosSelecionados.includes(acerto)) {
                            setDocumentosSelecionados((array) => [...array, acerto]);
                        }
                    }else {
                        setDocumentosSelecionados((current) => current.filter((item) => item !== acerto));
                    }
                }
            }
        )
        if (verificaSePodeSerSelecionado(statusId)) {
            setIdentificadorCheckboxClicado((array) => [...array, {uuid: categoria.categoria}]);
        }
    }

    const selecionarTodosItensDaCategoriaDoLancamento = (categoria) => {

        return (
            <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                    <span>Selecionar todos </span>
                    <input
                        checked={identificadorCheckboxClicado.some(uuid => uuid.uuid === categoria.categoria) && documentosSelecionados.length > 0 }
                        type="checkbox"
                        value=""
                        onChange={(e) => e}
                        name="checkHeader"
                        id="checkHeader"
                        disabled={false}
                    />
                </Dropdown.Toggle>

                <Dropdown.Menu className="super-colors" id='dropdown-menu-tabela-acertos-lancamentos'>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDaCategoriaDoDocumento(e, 'REALIZADO', categoria)}>Selecionar todos realizados</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDaCategoriaDoDocumento(e, 'JUSTIFICADO', categoria)}>Selecionar todos justificados</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDaCategoriaDoDocumento(e, 'PENDENTE', categoria)}>Selecionar todos sem status </Dropdown.Item>
                    <Dropdown.Item onClick={() => limparDocumentos({rowData: null, categoria: categoria})}>Desmarcar todos</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    const selecionarItemIndividual = (event, acerto, statusId) => {

        if (verificaSePodeSerSelecionado(statusId)){
            setStatus(statusId)
            if (!documentosSelecionados.includes(acerto)) {
                setDocumentosSelecionados((array) => [...array, acerto]);
            }else {
                setDocumentosSelecionados((current) => current.filter((item) => item !== acerto));
            }
        }
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
                    documentosSelecionados={documentosSelecionados}
                    setDocumentosSelecionados={setDocumentosSelecionados}
                    status={status}
                    setStatus={setStatus}
                    tituloModalCheckNaoPermitido={tituloModalCheckNaoPermitido}
                    textoModalCheckNaoPermitido={textoModalCheckNaoPermitido}
                    showModalCheckNaoPermitido={showModalCheckNaoPermitido}
                    setShowModalCheckNaoPermitido={setShowModalCheckNaoPermitido}
                    selecionarTodosItensDosDocumentos={selecionarTodosItensDosDocumentos}
                    totalDeAcertosDosDocumentos={totalDeAcertosDosDocumentos}
                    selecionarTodosItensDoDocumento={selecionarTodosItensDoDocumento}
                    opcoesJustificativa={opcoesJustificativa}
                    limparDocumentos={limparDocumentos}
                    analisePermiteEdicao={analisePermiteEdicao}
                />
            }
        </>
    )
}

export default memo(AcertosDocumentos)

