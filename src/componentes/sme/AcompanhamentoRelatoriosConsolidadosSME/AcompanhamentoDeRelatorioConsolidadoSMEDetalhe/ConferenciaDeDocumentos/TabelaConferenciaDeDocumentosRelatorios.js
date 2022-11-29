import React, {useEffect, memo, useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faDownload, faCheckCircle, faEdit} from "@fortawesome/free-solid-svg-icons";
import {gravarAcertosDocumentos, detalhamentoConferenciaDocumentos, marcarAcertosDocumentosComoNaoCorreto, marcarAcertosDocumentosComoCorreto, downloadDocumentoRelatorio} from "../../../../../services/sme/AcompanhamentoSME.service";
import {ModalAdicionarAcertosDocumentos} from "./ModalAdicionarAcertosDocumentos";
import {ModalCheckNaoPermitidoConfererenciaDeDocumentos} from "../../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/ModalCheckNaoPermitidoConfererenciaDeDocumentos";
import {toastCustom} from "../../../../Globais/ToastCustom";
import {ModalFormBodyPdf} from "../../../../Globais/ModalBootstrap"
import Dropdown from "react-bootstrap/Dropdown";
import Loading from "../../../../../utils/Loading";
import {AxiosError} from "axios";

const TabelaConferenciaDeDocumentosRelatorios = ({
    relatorioConsolidado,
    setListaDeDocumentosRelatorio,
    listaDeDocumentosRelatorio,
    carregaListaDeDocumentosRelatorio,
    rowsPerPage,
    loadingDocumentosRelatorio,
    editavel
}) => {

    const params = useParams();
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [exibirBtnMarcarComoCorreto, setExibirBtnMarcarComoCorreto] = useState(false)
    const [exibirBtnMarcarComoNaoConferido, setExibirBtnMarcarComoNaoConferido] = useState(false)
    const [documentoAcertoInfo, setDocumentoAcertoInfo] = useState(null)
    const [detalhamentoTxt, setDetalhamentoTxt] = useState({'detalhamento': ''})
    const [showModalAdicionarAcertos, setShowModalAdicionarAcertos] = useState(false)
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)
    const [pdfVisualizacao, setPdfVisualizacao] = useState('')
    const [showModalPdfDownload, setShowModalPdfDownload] = useState(false)

    useEffect(() => {
        let {consolidado_dre_uuid} = params
        setDetalhamentoConferenciaDocumentos(consolidado_dre_uuid)
    }, [documentoAcertoInfo])

    const getDetalhamentoConferenciaDocumentos = async (consolidado_dre_uuid) => {
        const response = await detalhamentoConferenciaDocumentos(consolidado_dre_uuid, relatorioConsolidado.analise_atual?.uuid)
        const documento = response ?. data ?. lista_documentos.find((item) => item.uuid === documentoAcertoInfo ?. documento)
        return documento ?. analise_documento_consolidado_dre.detalhamento ?? ''
    }

    const setDetalhamentoConferenciaDocumentos = async (consolidado_dre_uuid) => {
        let detalhamento = await getDetalhamentoConferenciaDocumentos(consolidado_dre_uuid)
        setDetalhamentoTxt({'detalhamento': detalhamento})
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                        <input checked={false}
                            type="checkbox"
                            value=""
                            onChange={
                                (e) => e
                            }
                            name="checkHeaderDocumentos"
                            id="checkHeaderDocumentos"
                            disabled={false}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={
                            (e) => selecionarPorStatus(e, "CORRETO")
                        }>Selecionar todos corretos</Dropdown.Item>
                        <Dropdown.Item onClick={
                            (e) => selecionarPorStatus(e, null)
                        }>Selecionar todos não conferidos</Dropdown.Item>
                        <Dropdown.Item onClick={
                            (e) => selecionarPorStatus(e, "AJUSTE")
                        }>Selecionar todos com solicitação de acertos</Dropdown.Item>
                        <Dropdown.Item onClick={
                            (e) => desmarcarTodos(e)
                        }>Desmarcar todos</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }

    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input checked={
                        listaDeDocumentosRelatorio.find(u => u.uuid === rowData.uuid).selecionado
                    }
                    type="checkbox"
                    onChange={
                        (e) => tratarSelecionado(e, rowData.uuid, rowData)
                    }
                    name="checkAtribuidoDocumento"
                    id="checkAtribuidoDocumento"
                    disabled={
                        !editavel
                    }/>
            </div>
        )
    }

    const selecionarPorStatus = (event, status = null) => {
        event.preventDefault();
        desmarcarTodos(event)
        let cont = 0;
        let result
        if (status == 'CORRETO') {
            setExibirBtnMarcarComoCorreto(false)
            setExibirBtnMarcarComoNaoConferido(true)
            result = listaDeDocumentosRelatorio.reduce((acc, o) => {
                let obj = o.analise_documento_consolidado_dre && o.analise_documento_consolidado_dre.resultado && o.analise_documento_consolidado_dre.resultado === status ? Object.assign(o, {selecionado: true}) : o;
                if (obj.selecionado) {
                    cont = cont + 1;
                }
                acc.push(obj);
                return acc;
            }, []);
        } else {
            setExibirBtnMarcarComoCorreto(true)
            setExibirBtnMarcarComoNaoConferido(false)
            result = listaDeDocumentosRelatorio.reduce((acc, o) => {
                var obj = o.analise_documento_consolidado_dre && o.analise_documento_consolidado_dre.resultado === status ? Object.assign(o, {selecionado: true}) : o
                if (obj.selecionado) {
                    cont = cont + 1;
                }
                acc.push(obj);
                return acc;
            }, []);
        }
        setListaDeDocumentosRelatorio(result);
        setQuantidadeSelecionada(cont);
    }

    const desmarcarTodos = () => {
        setExibirBtnMarcarComoCorreto(false)
        setExibirBtnMarcarComoNaoConferido(false)
        let result = listaDeDocumentosRelatorio.reduce((acc, o) => {
            let obj = Object.assign(o, {selecionado: false});
            acc.push(obj);
            return acc;
        }, []);
        setListaDeDocumentosRelatorio(result);
        setQuantidadeSelecionada(0);
    }

    const setExibicaoBotoesMarcarComo = (rowData) => {
        if (rowData.analise_documento_consolidado_dre.resultado === 'CORRETO') {
            setExibirBtnMarcarComoCorreto(false)
            setExibirBtnMarcarComoNaoConferido(true)
        } else if (rowData.analise_documento_consolidado_dre.resultado === 'AJUSTE'){
            setExibirBtnMarcarComoNaoConferido(true)
            setExibirBtnMarcarComoCorreto(true)
        }
        else {
            setExibirBtnMarcarComoCorreto(true)
            setExibirBtnMarcarComoNaoConferido(false)
        }
    }

    const marcarComoNaoConferido = async () => {
        let documentos_marcados_como_nao_conferidos = getDocumentosSelecionados()
        if (documentos_marcados_como_nao_conferidos.length > 0) {
            let payload = {
                analise_atual_consolidado: relatorioConsolidado.analise_atual?.uuid,
                uuids_analises_documentos: documentos_marcados_como_nao_conferidos.map(item => item.analise_documento_consolidado_dre.uuid)
            }
            try {
                const {status, data} = await marcarAcertosDocumentosComoNaoCorreto(payload);

                if (status === 200) {
                    toastCustom.ToastCustomSuccess(data.mensagem, "")
                    carregaListaDeDocumentosRelatorio()
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    toastCustom.ToastCustomError(err.response.data ?. mensagem ?? "Algo inesperado aconteceu", "tente novamente mais tarde")
                }
            } finally {
                desmarcarTodos()
            }
        }
    }

    const marcarComoCorreto = async () => {
        let documentos_marcados_como_corretos = getDocumentosSelecionados()
        if (documentos_marcados_como_corretos.length > 0) {
            let payload = {
                analise_atual_consolidado: relatorioConsolidado.analise_atual?.uuid,
                documentos: documentos_marcados_como_corretos.map(item => ({tipo_documento: item.tipo_documento, uuid_documento: item.uuid}))
            }
            try {
                const {status, data} = await marcarAcertosDocumentosComoCorreto(payload);

                if (status === 200) {
                    toastCustom.ToastCustomSuccess(data.mensagem, "")
                    carregaListaDeDocumentosRelatorio()
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    toastCustom.ToastCustomError(err.response.data ?. mensagem ?? "Algo inesperado aconteceu", "tente novamente mais tarde")
                }
            } finally {
                desmarcarTodos()
            }
        }
    }

    const verificaSePodeSerCheckado = (e, rowData) => {
        let selecionados = getDocumentosSelecionados()
        const statusSelecionado = selecionados[0] ?. analise_documento_consolidado_dre.resultado

        if (!(statusSelecionado === rowData.analise_documento_consolidado_dre.resultado || selecionados.length === 0)) {
            setTextoModalCheckNaoPermitido('<p>Esse documento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>')
            setShowModalCheckNaoPermitido(true)
            e.target.checked = false
            return false
        }

        return true;
    }

    const tratarSelecionado = (e, lancamentosParaConferenciaUuid, rowData) => {
        if (editavel) {
            let verifica_se_pode_ser_checkado = verificaSePodeSerCheckado(e, rowData)
            if (verifica_se_pode_ser_checkado) {
                let cont = quantidadeSelecionada;
                if (e.target.checked) {
                    cont = cont + 1
                } else {
                    cont = cont - 1
                }
                setQuantidadeSelecionada(cont);
                let result = listaDeDocumentosRelatorio.reduce((acc, o) => {
                    let obj = lancamentosParaConferenciaUuid === o.uuid ? Object.assign(o, {selecionado: e.target.checked}) : o;
                    acc.push(obj);
                    return acc;
                }, []);
                setListaDeDocumentosRelatorio(result);
                setExibicaoBotoesMarcarComo(rowData)
            }
        }
    }

    const getDocumentosSelecionados = useCallback(() => {
        return listaDeDocumentosRelatorio.filter((lancamento) => lancamento.selecionado)
    }, [listaDeDocumentosRelatorio])

    const montagemSelecionar = () => {
        return (
            <div className="row">
                <div className="col-12"
                    style={
                        {
                            background: "#00585E",
                            color: 'white',
                            padding: "15px",
                            margin: "0px 15px",
                            flex: "100%"
                        }
                }>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada}
                            {" "}
                            {
                            quantidadeSelecionada === 1 ? "documento selecionado " : "documentos selecionados "
                        }
                            / {totalDeDocumentosParaConferencia}
                            {" "}
                            totais
                        </div>
                        <div className="col-7">
                            <div className="row">
                                <div className="col-12">
                                    <button className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={
                                            (e) => desmarcarTodos(e)
                                        }
                                        style={
                                            {
                                                textDecoration: "underline",
                                                cursor: "pointer"
                                            }
                                    }>
                                        <strong>Cancelar</strong>
                                    </button>
                                    {
                                    exibirBtnMarcarComoCorreto && <>
                                        <div className="float-right"
                                            style={
                                                {padding: "0px 10px"}
                                        }>|</div>
                                        <button className="float-right btn btn-link btn-montagem-selecionar"
                                            onClick={
                                                () => marcarComoCorreto()
                                            }
                                            style={
                                                {
                                                    textDecoration: "underline",
                                                    cursor: "pointer"
                                                }
                                        }>
                                            <FontAwesomeIcon style={
                                                    {
                                                        color: "white",
                                                        fontSize: '15px',
                                                        marginRight: "3px"
                                                    }
                                                }
                                                icon={faCheckCircle}/>
                                            <strong>Marcar como Correto</strong>
                                        </button>
                                    </>
                                }
                                    {
                                    exibirBtnMarcarComoNaoConferido && <>
                                        <div className="float-right"
                                            style={
                                                {padding: "0px 10px"}
                                        }>|</div>
                                        <button className="float-right btn btn-link btn-montagem-selecionar"
                                            onClick={
                                                () => marcarComoNaoConferido()
                                            }
                                            style={
                                                {
                                                    textDecoration: "underline",
                                                    cursor: "pointer"
                                                }
                                        }>
                                            <FontAwesomeIcon style={
                                                    {
                                                        color: "white",
                                                        fontSize: '15px',
                                                        marginRight: "3px"
                                                    }
                                                }
                                                icon={faCheckCircle}/>
                                            <strong>Marcar como Não conferido</strong>
                                        </button>
                                    </>
                                } </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const totalDeDocumentosParaConferencia = listaDeDocumentosRelatorio.length

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12"
                    style={
                        {
                            padding: "15px 0px",
                            margin: "0px 15px",
                            flex: "100%"
                        }
                }>
                    Exibindo {" "}
                    <span style={
                        {
                            color: "#00585E",
                            fontWeight: "bold"
                        }
                    }>
                        {totalDeDocumentosParaConferencia} </span>
                    documentos
                </div>
            </div>
        )
    }

    const openModalAcertos = (data) => {
        setDocumentoAcertoInfo({documento: data.uuid, tipo_documento: data.tipo_documento, uuids_analises_documento: data.analise_documento_consolidado_dre.uuid})
        setShowModalAdicionarAcertos(true)
    }

    const conferidoTemplate = (rowData) => {
        if (!rowData.analise_documento_consolidado_dre.uuid) {
            return '-';
        } else if (rowData.analise_documento_consolidado_dre.resultado === 'CORRETO') {
            return (
                <div className='p-2'>
                    <FontAwesomeIcon style={
                            {
                                marginRight: "3px",
                                color: '#297805'
                            }
                        }
                        icon={faCheckCircle}/>
                </div>
            )
        } else if (rowData.analise_documento_consolidado_dre.resultado === 'AJUSTE') {
            return (
                <div className='p-2'>
                    <FontAwesomeIcon style={
                            {
                                marginRight: "3px",
                                color: '#B40C02'
                            }
                        }
                        icon={faCheckCircle}/>
                </div>
            )
        }
    }

    const getDownloadDocumentoRelatorio = async (rowData) => {
        try {
            const response = await downloadDocumentoRelatorio(rowData)
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const filename = `${rowData.nome.split(' ').join("_")}.pdf`
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        } catch (e) {
            console.log(e);
        }

    }

    const handleShowPdf = async (rowData) => {
        try {
            const response = await downloadDocumentoRelatorio(rowData)
            const url = URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
            setPdfVisualizacao(url)
            setShowModalPdfDownload(true)
        } catch (e) {
            console.log(e)
        }
    }

    const acoesTemplate = (rowData) => {
        if (rowData.tipo_documento !== "DOCUMENTO_ADICIONAL") {
            return (
                <>
                    <button disabled={
                            !editavel
                        }
                        title="Visualizar"
                        className="btn btn-link fonte-14"
                        type="button"
                        onClick={() => handleShowPdf(rowData)}>
                        <FontAwesomeIcon style={
                                {
                                    fontSize: '18px',
                                    marginRight: "5px",
                                    color: "#00585E"
                                }
                            }
                            icon={faEye}/>
                    </button>
                    <button disabled={
                            !editavel
                        }
                        title="Download"
                        onClick={() => getDownloadDocumentoRelatorio(rowData)}
                        className="btn btn-link fonte-14"
                        type="button">
                        <FontAwesomeIcon style={
                                {
                                    fontSize: '18px',
                                    marginRight: "5px",
                                    color: "#00585E"
                                }
                            }
                            icon={faDownload}/>
                    </button>
                </>
            )
        }

        return null;
    };

    const rowClassName = (rowData) => {
        if (rowData && rowData.analise_documento_consolidado_dre && rowData.analise_documento_consolidado_dre.resultado) {
            return {'linha-conferencia-de-lancamentos-correto': true}
        }
    }

    const nomeDocumento = (rowData) => {
        return rowData.nome
    }

    const adicionarAcertos = (rowData) => {
        return (
            <button disabled={
                    !editavel
                }
                onClick={
                    () => openModalAcertos(rowData)
                }
                className="btn btn-link fonte-14"
                type="button">
                <FontAwesomeIcon style={
                        {
                            fontSize: '18px',
                            marginRight: "5px",
                            color: "#00585E"
                        }
                    }
                    icon={faEdit}/>
            </button>
        )
    };

    const handleSubmitModal = async (data) => {
        let payload = {
            analise_atual_consolidado: relatorioConsolidado.analise_atual?.uuid,
            tipo_documento: documentoAcertoInfo.tipo_documento,
            documento: documentoAcertoInfo.documento,
            detalhamento: data.detalhamento
        }
        let response = await gravarAcertosDocumentos(payload)
        if (response.status === 200) {
            payload = {
                "analise_atual_consolidado": relatorioConsolidado.analise_atual?.uuid,
                "uuids_analises_documentos": [documentoAcertoInfo.uuids_analises_documento]
            }
            toastCustom.ToastCustomSuccess('Conferência adicionada com sucesso.', 'Status de documento conferido foi aplicado com sucesso.')
        } else {
            toastCustom.ToastCustomError('Erro ao tentar inserir conferência.', 'Verifique se o detalhamento foi inserido corretamente.')
        }
        setShowModalAdicionarAcertos(false)
        setDocumentoAcertoInfo((state) => ({
            ...state,
            detalhamento: data.detalhamento
        }))
        desmarcarTodos()
        carregaListaDeDocumentosRelatorio();
    }

    return (
        <> {
            loadingDocumentosRelatorio ? (
                <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0"/>
            ) : <> {
                    quantidadeSelecionada > 0 ? montagemSelecionar() : mensagemQuantidadeExibida()
                }
                    <DataTable value={listaDeDocumentosRelatorio}
                        paginator={
                            listaDeDocumentosRelatorio.length > rowsPerPage
                        }
                        rows={rowsPerPage}
                        rowClassName={rowClassName}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        stripedRows
                        className=""
                        autoLayout={true}>
                        <Column
                            header={selecionarHeader()}
                            className="align-middle text-left borda-coluna"
                            body={selecionarTemplate}
                            style={
                                {
                                    borderRight: 'none',
                                    width: '1%'
                                }
                            }/>
                        <Column header={'Nome do Documento'}
                            field='nome'
                            className="align-middle text-left borda-coluna"
                            body={nomeDocumento}
                            style={
                                {
                                    borderLeft: 'none',
                                    width: '200px'
                                }
                            }/>
                        <Column header={'Conferido'}
                            body={conferidoTemplate}
                            className="align-middle text-left borda-coluna"
                            style={
                                {
                                    borderRight: 'none',
                                    width: '10%'
                                }
                            }/>
                        <Column field='acoes' header='Ações'
                            body={acoesTemplate}
                            className="align-middle text-left borda-coluna"
                            style={
                                {
                                    borderRight: 'none',
                                    width: '10%'
                                }
                            }/>
                        <Column field='adicionar_acertos' header='Adicionar Acerto'
                            body={adicionarAcertos}
                            className="align-middle text-left borda-coluna"
                            style={
                                {width: '2%'}
                            }/>
                    </DataTable>
                </>
        }
            <section>
                <ModalAdicionarAcertosDocumentos titulo="Detalhamento do acerto"
                    handleSubmitModal={handleSubmitModal}
                    handleClose={
                        () => setShowModalAdicionarAcertos(false)
                    }
                    initialValues={detalhamentoTxt}
                    show={showModalAdicionarAcertos}/>
            </section>
            <section>
                <ModalCheckNaoPermitidoConfererenciaDeDocumentos show={showModalCheckNaoPermitido}
                    handleClose={
                        () => setShowModalCheckNaoPermitido(false)
                    }
                    titulo='Seleção não permitida'
                    texto={textoModalCheckNaoPermitido}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"/>
            </section>
            <section>
                <ModalCheckNaoPermitidoConfererenciaDeDocumentos show={showModalCheckNaoPermitido}
                    handleClose={
                        () => setShowModalCheckNaoPermitido(false)
                    }
                    titulo='Seleção não permitida'
                    texto={textoModalCheckNaoPermitido}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"/>
            </section>
            <section>
                <ModalFormBodyPdf
                    show={showModalPdfDownload}
                    size="lg"
                    titulo={'Visualização do documento.'}
                    onHide={() => setShowModalPdfDownload(false)}
                >
                <embed src={pdfVisualizacao} frameBorder="0" width="100%" height="700px"></embed>
                </ModalFormBodyPdf>
            </section>
        </>
    )
}
export default memo(TabelaConferenciaDeDocumentosRelatorios)
