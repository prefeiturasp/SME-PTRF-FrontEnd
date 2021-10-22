import React, {memo, useMemo, useState} from "react";
import {useHistory} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

// Hooks Personalizados
import useConferidoTemplate from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faEdit} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import {ModalCheckNaoPermitidoConfererenciaDeDocumentos} from "./ModalCheckNaoPermitidoConfererenciaDeDocumentos";
import {postDocumentosParaConferenciaMarcarComoCorreto, postDocumentosParaConferenciaMarcarNaoConferido} from "../../../../../services/dres/PrestacaoDeContas.service";
import Loading from "../../../../../utils/Loading";

// Redux
import {useDispatch} from "react-redux";
import {addDetalharAcertosDocumentos, limparDetalharAcertosDocumentos} from "../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/DetalharAcertosDocumentos/actions";

const TabelaConferenciaDeDocumentos = ({carregaListaDeDocumentosParaConferencia, setListaDeDocumentosParaConferencia, listaDeDocumentosParaConferencia, rowsPerPage, prestacaoDeContas, loadingDocumentosParaConferencia, editavel}) =>{

    const history = useHistory();

    // Hooks Personalizados
    const conferidoTemplate = useConferidoTemplate()

    // Redux
    const dispatch = useDispatch()

    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [exibirBtnMarcarComoCorreto, setExibirBtnMarcarComoCorreto] = useState(false)
    const [exibirBtnMarcarComoNaoConferido, setExibirBtnMarcarComoNaoConferido] = useState(false)
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)

    const addDispatchRedireciona = (documento) => {
        if (editavel){
            dispatch(limparDetalharAcertosDocumentos())
            dispatch(addDetalharAcertosDocumentos(documento))
            history.push(`/dre-detalhe-prestacao-de-contas-detalhar-acertos-documentos/${prestacaoDeContas.uuid}`)
        }
    }

    const acoesTemplate = (rowData) => {
        return (
            <button disabled={!editavel} onClick={()=>addDispatchRedireciona(rowData)} className="btn btn-link fonte-14" type="button">
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "5px", color: "#00585E"}}
                    icon={faEdit}
                />
            </button>
        )
    };

    const rowClassName = (rowData) => {
        if (rowData && rowData.analise_documento && rowData.analise_documento.resultado) {
            return {'linha-conferencia-de-lancamentos-correto': true}
        }
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle text-center">
                {editavel &&
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                        <input
                            checked={false}
                            type="checkbox"
                            value=""
                            onChange={(e) => e}
                            name="checkHeaderDocumentos"
                            id="checkHeaderDocumentos"
                            disabled={!editavel}
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => selecionarPorStatus(e, "CORRETO")}>Selecionar todos corretos</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatus(e, null)}>Selecionar todos não conferidos</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => desmarcarTodos(e)}>Desmarcar todos</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                }
            </div>
        )
    }

    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={listaDeDocumentosParaConferencia.filter(u => u.uuid_documento === rowData.uuid_documento)[0].selecionado}
                    type="checkbox"
                    value=""
                    onChange={(e) => tratarSelecionado(e, rowData.uuid_documento, rowData)}
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
        if (status) {
            setExibirBtnMarcarComoCorreto(false)
            setExibirBtnMarcarComoNaoConferido(true)
            result = listaDeDocumentosParaConferencia.reduce((acc, o) => {
                let obj = o.analise_documento && o.analise_documento.resultado && o.analise_documento.resultado === status ? Object.assign(o, {selecionado: true}) : o;
                if (obj.selecionado) {
                    cont = cont + 1;
                }
                acc.push(obj);
                return acc;
            }, []);
        } else {
            setExibirBtnMarcarComoCorreto(true)
            setExibirBtnMarcarComoNaoConferido(false)
            result = listaDeDocumentosParaConferencia.reduce((acc, o) => {
                let obj = !o.analise_documento ? Object.assign(o, {selecionado: true}) : o;
                if (obj.selecionado) {
                    cont = cont + 1;
                }
                acc.push(obj);
                return acc;
            }, []);
        }
        setListaDeDocumentosParaConferencia(result);
        setQuantidadeSelecionada(cont);
    }

    const desmarcarTodos = () => {
        setExibirBtnMarcarComoCorreto(false)
        setExibirBtnMarcarComoNaoConferido(false)
        let result = listaDeDocumentosParaConferencia.reduce((acc, o) => {
            let obj = Object.assign(o, {selecionado: false});
            acc.push(obj);
            return acc;
        }, []);
        setListaDeDocumentosParaConferencia(result);
        setQuantidadeSelecionada(0);
    }

    const setExibicaoBotoesMarcarComo = (rowData) => {
        if (rowData.analise_documento && rowData.analise_documento.resultado === 'CORRETO') {
            setExibirBtnMarcarComoCorreto(false)
            setExibirBtnMarcarComoNaoConferido(true)
        } else {
            setExibirBtnMarcarComoCorreto(true)
            setExibirBtnMarcarComoNaoConferido(false)
        }
    }

    const verificaSePodeSerCheckado = (e, rowData) => {

        let selecionados = getDocumentosSelecionados()
        let status_permitido = []

        if (selecionados.length > 0) {
            if (!selecionados[0].analise_documento || (selecionados[0].analise_documento && selecionados[0].analise_documento.resultado && selecionados[0].analise_documento.resultado === "AJUSTE")) {
                status_permitido = [null]
            } else {
                status_permitido = ['CORRETO']
            }
        }

        if (e.target.checked && rowData.analise_documento && rowData.analise_documento.resultado && rowData.analise_documento.resultado === "AJUSTE") {
            setTextoModalCheckNaoPermitido('<p>Documentos com status de ajuste solicitado não podem ser selecionados!</p>')
            setShowModalCheckNaoPermitido(true)
            return false
        }else {
            if (e.target.checked && status_permitido.length > 0) {
                if (status_permitido.includes(rowData.analise_documento) || (rowData.analise_documento && rowData.analise_documento.resultado && status_permitido.includes(rowData.analise_documento.resultado))) {
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
                let result = listaDeDocumentosParaConferencia.reduce((acc, o) => {
                    let obj = lancamentosParaConferenciaUuid === o.uuid_documento ? Object.assign(o, {selecionado: e.target.checked}) : o;
                    acc.push(obj);
                    return acc;
                }, []);
                setListaDeDocumentosParaConferencia(result);
                setExibicaoBotoesMarcarComo(rowData)
            }
        }
    }

    const getDocumentosSelecionados = () => {
        return listaDeDocumentosParaConferencia.filter((lancamento) => lancamento.selecionado)
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

    const totalDeDocumentosParaConferencia = useMemo(() => listaDeDocumentosParaConferencia.length, [listaDeDocumentosParaConferencia]);

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
        let documentos_marcados_como_corretos = getDocumentosSelecionados()
        if (documentos_marcados_como_corretos && documentos_marcados_como_corretos.length > 0) {
            let payload = [];
            documentos_marcados_como_corretos.map((documento) =>
                payload.push({
                    "tipo_documento": documento.tipo_documento_prestacao_conta.uuid,
                    "conta_associacao": documento.tipo_documento_prestacao_conta.conta_associacao,
                })
            );
            payload = {
                'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
                'documentos_corretos': [
                    ...payload
                ]
            }
            try {
                await postDocumentosParaConferenciaMarcarComoCorreto(prestacaoDeContas.uuid, payload)
                console.log("Documentos marcados como correto com sucesso!")
                desmarcarTodos()
                await carregaListaDeDocumentosParaConferencia()
            } catch (e) {
                console.log("Erro ao marcar documentos como correto ", e.response)
            }
        }
    }

    const marcarComoNaoConferido = async () => {
        let documentos_marcados_como_nao_conferidos = getDocumentosSelecionados()
        if (documentos_marcados_como_nao_conferidos && documentos_marcados_como_nao_conferidos.length > 0) {
            let payload = [];
            documentos_marcados_como_nao_conferidos.map((documento) =>
                payload.push({
                    "tipo_documento": documento.tipo_documento_prestacao_conta.uuid,
                    "conta_associacao": documento.tipo_documento_prestacao_conta.conta_associacao,
                })
            );
            payload = {
                'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
                'documentos_nao_conferidos': [
                    ...payload
                ]
            }
            try {
                await postDocumentosParaConferenciaMarcarNaoConferido(prestacaoDeContas.uuid, payload)
                console.log("Documentos marcados como não conferido com sucesso!")
                desmarcarTodos()
                await carregaListaDeDocumentosParaConferencia()
            } catch (e) {
                console.log("Erro ao marcar documentos como não conferido ", e.response)
            }
        }
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
                        value={listaDeDocumentosParaConferencia}
                        paginator={listaDeDocumentosParaConferencia.length > rowsPerPage}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        rowClassName={rowClassName}
                        stripedRows
                        autoLayout={true}
                    >
                        <Column
                            header={selecionarHeader()}
                            body={selecionarTemplate}
                            style={{borderRight: 'none', width: '50px'}}
                        />
                        <Column field='tipo_documento_prestacao_conta.nome' header='Nome do Documento' className="align-middle text-left borda-coluna"/>
                        <Column
                            field='analise_documento'
                            header='Conferido'
                            body={conferidoTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{borderRight: 'none', width: '100px'}}
                        />
                        <Column
                            field='acoes'
                            header='Adicionar ajuste'
                            body={acoesTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{borderRight: 'none', width: '150px'}}
                        />
                    </DataTable>
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
            }
        </>
    )
}
export default memo(TabelaConferenciaDeDocumentos)