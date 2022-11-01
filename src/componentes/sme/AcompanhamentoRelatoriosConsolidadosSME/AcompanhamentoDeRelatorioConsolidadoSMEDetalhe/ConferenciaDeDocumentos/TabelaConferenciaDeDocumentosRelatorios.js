import React, {useEffect, memo, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faDownload, faCheckCircle, faEdit} from "@fortawesome/free-solid-svg-icons";
import {gravarAcertosDocumentos, detalhamentoConferenciaDocumentos} from "../../../../../services/sme/AcompanhamentoSME.service";
import {ModalAdicionarAcertosDocumentos} from "./ModalAdicionarAcertosDocumentos";
import {ModalCheckNaoPermitidoConfererenciaDeDocumentos} from "./../../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/ModalCheckNaoPermitidoConfererenciaDeDocumentos";
import {toastCustom} from "../../../../Globais/ToastCustom";
import Dropdown from "react-bootstrap/Dropdown";
import Loading from "../../../../../utils/Loading";

const TabelaConferenciaDeDocumentosRelatorios = ({carregaListaDeDocumentosRelatorio, setListaDeDocumentosRelatorio, listaDeDocumentosRelatorio, rowsPerPage, prestacaoDeContas, loadingDocumentosParaConferencia, editavel}) => {

    const params = useParams();
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [exibirBtnMarcarComoCorreto, setExibirBtnMarcarComoCorreto] = useState(false)
    const [exibirBtnMarcarComoNaoConferido, setExibirBtnMarcarComoNaoConferido] = useState(false)
    const [documentoAcertoInfo, setDocumentoAcertoInfo] = useState(null)
    const [detalhamentoTxt, setDetalhamentoTxt] = useState({'detalhamento': ''})
    const [showModalAdicionarAcertos, setShowModalAdicionarAcertos] = useState(false)
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)

    useEffect(() => {
        let {consolidado_dre_uuid} = params
        setDetalhamentoConferenciaDocumentos(consolidado_dre_uuid)
    }, [documentoAcertoInfo])

    const getDetalhamentoConferenciaDocumentos = async (consolidado_dre_uuid) => {
        const response = await detalhamentoConferenciaDocumentos(consolidado_dre_uuid, localStorage.getItem('analise_atual'))
        const documento = response?.data?.lista_documentos.find((item) => item.uuid === documentoAcertoInfo?.documento)
        return documento?.analise_documento_consolidado_dre.detalhamento ?? ''
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
                        <input
                            checked={false}
                            type="checkbox"
                            value=""
                            onChange={(e) => e}
                            name="checkHeaderDocumentos"
                            id="checkHeaderDocumentos"
                            disabled={false}
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => selecionarPorStatus(e, "CORRETO")}>Selecionar todos corretos</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatus(e, null)}>Selecionar todos não conferidos</Dropdown.Item>
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
                    checked={listaDeDocumentosRelatorio.filter(u => u.uuid === rowData.uuid)[0].selecionado}
                    type="checkbox"
                    value=''
                    onChange={(e) => tratarSelecionado(e, rowData.uuid, rowData)}
                    name="checkAtribuidoDocumento"
                    id="checkAtribuidoDocumento"
                    disabled={!editavel}
                />
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
        if (rowData.analise_documento && rowData.analise_documento_consolidado_dre.resultado === 'CORRETO') {
            setExibirBtnMarcarComoCorreto(false)
            setExibirBtnMarcarComoNaoConferido(true)
        } else {
            setExibirBtnMarcarComoCorreto(true)
            setExibirBtnMarcarComoNaoConferido(false)
        }
    }


    const verificaSePodeSerCheckado = (e, rowData) => {
        console.log('rowData', rowData)
        let selecionados = getDocumentosSelecionados()
        let status_permitido = []

        if (selecionados.length > 0) {
            if (!selecionados[0].analise_documento_consolidado_dre || (selecionados[0].analise_documento_consolidado_dre && selecionados[0].analise_documento_consolidado_dre.resultado && selecionados[0].analise_documento_consolidado_dre.resultado === "AJUSTE")) {
                status_permitido = [null]
            } else {
                status_permitido = ['CORRETO']
            }
        }

        if (e.target.checked && rowData.analise_documento_consolidado_dre && rowData.analise_documento_consolidado_dre.resultado && rowData.analise_documento_consolidado_dre.resultado === "AJUSTE") {
            setTextoModalCheckNaoPermitido('<p>Documentos com status de ajuste solicitado não podem ser selecionados!</p>')
            setShowModalCheckNaoPermitido(true)
            return false
        }else {
            if (e.target.checked && status_permitido.length > 0) {
                if (status_permitido.includes(rowData.analise_documento_consolidado_dre) || (rowData.analise_documento_consolidado_dre && rowData.analise_documento_consolidado_dre.resultado && status_permitido.includes(rowData.analise_documento_consolidado_dre.resultado))) {
                    setTextoModalCheckNaoPermitido('')
                    return true
                } else {
                    setTextoModalCheckNaoPermitido('<p>Esse documento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>')
                    setShowModalCheckNaoPermitido(true)
                    return false
                }
            } else {
                setTextoModalCheckNaoPermitido('')
                return true
            }
        }
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

    const getDocumentosSelecionados = () => {
        return listaDeDocumentosRelatorio.filter((lancamento) => lancamento.selecionado)
    }

    const montagemSelecionar = () => {
        return (
            <div className="row">
                <div className="col-12"
                    style={{background: "#00585E", color: 'white', padding: "15px", margin: "0px 15px", flex: "100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "documento selecionado" : "documentos selecionados"} / {totalDeDocumentosParaConferencia} totais
                        </div>
                        <div className="col-7">
                            <div className="row">
                                <div className="col-12">
                                    <button className="float-right btn btn-link btn-montagem-selecionar"
                                            onClick={(e) => desmarcarTodos(e)}
                                            style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <strong>Cancelar</strong>
                                    </button>
                                    {exibirBtnMarcarComoCorreto &&
                                    <>
                                        <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                        <button
                                            className="float-right btn btn-link btn-montagem-selecionar"
                                            onClick={() => marcarComoCorreto()}
                                            style={{textDecoration: "underline", cursor: "pointer"}}
                                        >
                                            <FontAwesomeIcon
                                                style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                                icon={faCheckCircle}
                                            />
                                            <strong>Marcar como Correto</strong>
                                        </button>
                                    </>
                                    }
                                    {exibirBtnMarcarComoNaoConferido &&
                                    <>
                                        <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                        <button
                                            className="float-right btn btn-link btn-montagem-selecionar"
                                            onClick={() => marcarComoNaoConferido()}
                                            style={{textDecoration: "underline", cursor: "pointer"}}
                                        >
                                            <FontAwesomeIcon
                                                style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                                icon={faCheckCircle}
                                            />
                                            <strong>Marcar como Não conferido</strong>
                                        </button>
                                    </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const totalDeDocumentosParaConferencia = useMemo(() => listaDeDocumentosRelatorio.length, [listaDeDocumentosRelatorio]);

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12" style={{padding: "15px 0px", margin: "0px 15px", flex: "100%"}}>
                    Exibindo <span style={{
                    color: "#00585E",
                    fontWeight: "bold"
                }}>{totalDeDocumentosParaConferencia}</span> documentos
                </div>
            </div>
        )
    }

    const marcarComoCorreto = async () => {
        // let documentos_marcados_como_corretos = getDocumentosSelecionados()
        // if (documentos_marcados_como_corretos && documentos_marcados_como_corretos.length > 0) {
        //     let payload = [];
        //     documentos_marcados_como_corretos.map((documento) =>
        //         payload.push({
        //             "tipo_documento": documento.tipo_documento_prestacao_conta.uuid,
        //             "conta_associacao": documento.tipo_documento_prestacao_conta.conta_associacao,
        //         })
        //     );
        //     payload = {
        //         'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
        //         'documentos_corretos': [
        //             ...payload
        //         ]
        //     }
        //     try {
        //         // await postDocumentosParaConferenciaMarcarComoCorreto(prestacaoDeContas.uuid, payload)
        //         console.log("Documentos marcados como correto com sucesso!")
        //         desmarcarTodos()
        //         await carregaListaDeDocumentosRelatorio()
        //     } catch (e) {
        //         console.log("Erro ao marcar documentos como correto ", e.response)
        //     }
        // }
    }

    const marcarComoNaoConferido = async () => {
        // let documentos_marcados_como_nao_conferidos = getDocumentosSelecionados()
        // if (documentos_marcados_como_nao_conferidos && documentos_marcados_como_nao_conferidos.length > 0) {
        //     let payload = [];
        //     documentos_marcados_como_nao_conferidos.map((documento) =>
        //         payload.push({
        //             "tipo_documento": documento.tipo_documento_prestacao_conta.uuid,
        //             "conta_associacao": documento.tipo_documento_prestacao_conta.conta_associacao,
        //         })
        //     );
        //     payload = {
        //         'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
        //         'documentos_nao_conferidos': [
        //             ...payload
        //         ]
        //     }
        //     try {
        //         // await postDocumentosParaConferenciaMarcarNaoConferido(prestacaoDeContas.uuid, payload)
        //         console.log("Documentos marcados como não conferido com sucesso!")
        //         desmarcarTodos()
        //         await carregaListaDeDocumentosRelatorio()
        //     } catch (e) {
        //         console.log("Erro ao marcar documentos como não conferido ", e.response)
        //     }
        // }
    }

    const openModalAcertos = (data) => {
        setDocumentoAcertoInfo({
            documento: data.uuid,
            tipo_documento: data.tipo_documento,
            uuids_analises_documento: data.analise_documento_consolidado_dre.uuid
        })
        setShowModalAdicionarAcertos(true)
    }

    const conferidoTemplate = (rowData) => {
        if (!rowData.analise_documento_consolidado_dre.uuid){
            return '-';
        }
        switch(rowData.analise_documento_consolidado_dre.resultado){
            case 'CORRETO':
                return (
                    <div className='p-2'>
                        <FontAwesomeIcon
                            style={{marginRight: "3px", color: '#297805'}}
                            icon={faCheckCircle}
                        />
                    </div>
                )
            case 'AJUSTE':
                return (
                    <div className='p-2'>
                        <FontAwesomeIcon
                            style={{marginRight: "3px", color: '#B40C02'}}
                            icon={faCheckCircle}
                        />
                    </div>
                )
            }
    }

    const acoesTemplate = (rowData) => {
        return (
            <>
            <button disabled={!editavel} className="btn btn-link fonte-14" type="button">
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "5px", color: "#00585E"}}
                    icon={faEye}
                />
            </button>
            <button disabled={!editavel} className="btn btn-link fonte-14" type="button">
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "5px", color: "#00585E"}}
                    icon={faDownload}/>
            </button>
            </>
        )

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
            <button disabled={!editavel} onClick={() => openModalAcertos(rowData)} className="btn btn-link fonte-14" type="button">
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "5px", color: "#00585E"}}
                    icon={faEdit}
                />
            </button>
        )
    };

    const handleSubmitModal = async (data) => { 
        let payload = {
            analise_atual_consolidado: localStorage.getItem('analise_atual'),
            tipo_documento: documentoAcertoInfo.tipo_documento,
            documento: documentoAcertoInfo.documento,
            detalhamento: data.detalhamento
        }
        let response = await gravarAcertosDocumentos(payload)
        if (response.status === 200) {
            payload = {
                    "analise_atual_consolidado": localStorage.getItem('analise_atual'),
                    "uuids_analises_documentos" : [documentoAcertoInfo.uuids_analises_documento]
                }
            toastCustom.ToastCustomSuccess('Conferência adicionada com sucesso.', 'Status de documento conferido foi aplicado com sucesso.')
        } else {
            toastCustom.ToastCustomError('Erro ao tentar inserir conferência.', 'Verifique se o detalhamento foi inserido corretamente.')
        }
        setShowModalAdicionarAcertos(false)
        setDocumentoAcertoInfo((state) => ({...state, detalhamento: data.detalhamento}))
    }

    return(
        <>
            {loadingDocumentosParaConferencia ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                    {quantidadeSelecionada > 0 ?
                        montagemSelecionar() :
                        mensagemQuantidadeExibida()
                    }
                    <DataTable
                        value={listaDeDocumentosRelatorio}
                        paginator={listaDeDocumentosRelatorio.length > rowsPerPage}
                        rows={rowsPerPage}
                        rowClassName={rowClassName}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        stripedRows
                        autoLayout={true}
                    >
                        <Column
                            header={selecionarHeader()}
                            body={selecionarTemplate}
                            style={{borderRight: 'none', width: '1%'}}
                        />
                        <Column
                            header={'Nome do Documento'}
                            field='nome'
                            body={nomeDocumento}
                            style={{borderLeft: 'none', width: '200px',}}
                        />
                        <Column
                            header={'Conferido'}
                            body={conferidoTemplate}
                            style={{borderRight: 'none', width: '10%'}}
                        />
                        <Column
                            field='acoes'
                            header='Ações'
                            body={acoesTemplate}
                            style={{borderRight: 'none', width: '12%'}}
                        />
                        <Column
                            field='adicionar_acertos'
                            header='Adicionar Acerto'
                            body={adicionarAcertos}
                            style={{width: '1%'}}
                        />
                    </DataTable>
                </>
            }
            <section>
                <ModalAdicionarAcertosDocumentos
                    titulo="Detalhamento do acerto"
                    handleSubmitModal={handleSubmitModal}
                    handleClose={() => setShowModalAdicionarAcertos(false)}
                    initialValues={detalhamentoTxt}
                    show={showModalAdicionarAcertos}
                />
            </section>
            <section>
                <ModalCheckNaoPermitidoConfererenciaDeDocumentos
                    show={showModalCheckNaoPermitido}
                    handleClose={() => setShowModalCheckNaoPermitido(false)}
                    titulo='Seleção não permitida'
                    texto={textoModalCheckNaoPermitido}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                />
            </section>
        </>
    )
}
export default memo(TabelaConferenciaDeDocumentosRelatorios)