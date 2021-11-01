import React, {useEffect, useMemo, useState, memo} from "react";
import {useHistory} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faListUl} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import {ModalCheckNaoPermitidoConfererenciaDeLancamentos} from "./ModalCheckNaoPermitidoConfererenciaDeLancamentos";
import {FiltrosConferenciaDeLancamentos} from "./FiltrosConferenciaDeLancamentos";
import {postLancamentosParaConferenciaMarcarComoCorreto, postLancamentosParaConferenciaMarcarNaoConferido} from "../../../../../services/dres/PrestacaoDeContas.service";

// Hooks Personalizados
import useValorTemplate from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate";
import {useCarregaTabelaDespesa} from "../../../../../hooks/Globais/useCarregaTabelaDespesa";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import useConferidoTemplate from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate";
import useRowExpansionDespesaTemplate from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionDespesaTemplate";
import useRowExpansionReceitaTemplate from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionReceitaTemplate";
import useNumeroDocumentoTemplate from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate";
// Redux
import {useDispatch} from "react-redux";
import {addDetalharAcertos, limparDetalharAcertos} from "../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions";


const TabelaConferenciaDeLancamentos = ({setLancamentosParaConferencia, lancamentosParaConferencia, contaUuid, carregaLancamentosParaConferencia,prestacaoDeContas, editavel}) => {

    const rowsPerPage = 10;
    const history = useHistory();

    const [expandedRows, setExpandedRows] = useState(null);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [exibirBtnMarcarComoCorreto, setExibirBtnMarcarComoCorreto] = useState(false)
    const [exibirBtnMarcarComoNaoConferido, setExibirBtnMarcarComoNaoConferido] = useState(false)
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)

    // Hooks Personalizados
    const valor_template = useValorTemplate()
    const dataTemplate = useDataTemplate()
    const conferidoTemplate = useConferidoTemplate()
    const tabelaDespesa = useCarregaTabelaDespesa(prestacaoDeContas)
    const rowExpansionDespesaTemplate = useRowExpansionDespesaTemplate(prestacaoDeContas)
    const rowExpansionReceitaTemplate = useRowExpansionReceitaTemplate()
    const numeroDocumentoTemplate = useNumeroDocumentoTemplate()

    // Redux
    const dispatch = useDispatch()

    useEffect(() => {
        desmarcarTodos()
    }, [contaUuid])

    const rowClassName = (rowData) => {
        if (rowData && rowData.analise_lancamento && rowData.analise_lancamento.resultado) {
            return {'linha-conferencia-de-lancamentos-correto': true}
        }
    }

    const rowExpansionTemplate = (data) => {
        if (data.tipo_transacao === 'Crédito') {
            return (
                rowExpansionReceitaTemplate(data)
            )
        } else {
            return (
                rowExpansionDespesaTemplate(data)
            )
        }
    };

    const selecionarTodos = (event) => {
        event.preventDefault();
        setExibirBtnMarcarComoCorreto(true)
        setExibirBtnMarcarComoNaoConferido(true)
        let result = lancamentosParaConferencia.reduce((acc, o) => {
            let obj = Object.assign(o, {selecionado: true});
            acc.push(obj);
            return acc;
        }, []);
        setLancamentosParaConferencia(result);
        setQuantidadeSelecionada(lancamentosParaConferencia.length);
    }

    const selecionarPorStatus = (event, status = null) => {
        event.preventDefault();
        desmarcarTodos(event)
        let cont = 0;
        let result
        if (status) {
            setExibirBtnMarcarComoCorreto(false)
            setExibirBtnMarcarComoNaoConferido(true)
            result = lancamentosParaConferencia.reduce((acc, o) => {
                let obj = o.analise_lancamento && o.analise_lancamento.resultado && o.analise_lancamento.resultado === status ? Object.assign(o, {selecionado: true}) : o;
                if (obj.selecionado) {
                    cont = cont + 1;
                }
                acc.push(obj);
                return acc;
            }, []);
        } else {
            setExibirBtnMarcarComoCorreto(true)
            setExibirBtnMarcarComoNaoConferido(false)
            result = lancamentosParaConferencia.reduce((acc, o) => {
                let obj = !o.analise_lancamento ? Object.assign(o, {selecionado: true}) : o;
                if (obj.selecionado) {
                    cont = cont + 1;
                }
                acc.push(obj);
                return acc;
            }, []);
        }
        setLancamentosParaConferencia(result);
        setQuantidadeSelecionada(cont);
    }

    const desmarcarTodos = () => {
        setExibirBtnMarcarComoCorreto(false)
        setExibirBtnMarcarComoNaoConferido(false)
        let result = lancamentosParaConferencia.reduce((acc, o) => {
            let obj = Object.assign(o, {selecionado: false});
            acc.push(obj);
            return acc;
        }, []);
        setLancamentosParaConferencia(result);
        setQuantidadeSelecionada(0);
    }

    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={lancamentosParaConferencia.filter(u => u.documento_mestre.uuid === rowData.documento_mestre.uuid)[0].selecionado}
                    type="checkbox"
                    value=""
                    onChange={(e) => tratarSelecionado(e, rowData.documento_mestre.uuid, rowData)}
                    name="checkAtribuido"
                    id="checkAtribuido"
                    disabled={!editavel}
                />
            </div>
        )
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
                                name="checkHeader"
                                id="checkHeader"
                                disabled={!editavel}
                            />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {/*<Dropdown.Item onClick={(e) => selecionarTodos(e)}>Selecionar todos</Dropdown.Item>*/}
                            <Dropdown.Item onClick={(e) => selecionarPorStatus(e, "CORRETO")}>Selecionar todos corretos</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => selecionarPorStatus(e, null)}>Selecionar todos não conferidos</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => desmarcarTodos(e)}>Desmarcar todos</Dropdown.Item>
                        </Dropdown.Menu>

                    </Dropdown>
                }
            </div>
        )
    }

    const montagemSelecionar = () => {
        return (
            <div className="row">
                <div className="col-12"
                     style={{background: "#00585E", color: 'white', padding: "15px", margin: "0px 15px", flex: "100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "lançamento selecionado" : "lançamentos selecionados"} / {totalDelancamentosParaConferencia} totais
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
                                    <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={() => detalharAcertos()}
                                        style={{textDecoration: "underline", cursor: "pointer"}}
                                    >
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faListUl}
                                        />
                                        <strong>Detalhar acertos</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Quando a state da lista sofrer alteração
    const totalDelancamentosParaConferencia = useMemo(() => lancamentosParaConferencia.length, [lancamentosParaConferencia]);

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12" style={{padding: "15px 0px", margin: "0px 15px", flex: "100%"}}>
                    Exibindo <span style={{
                    color: "#00585E",
                    fontWeight: "bold"
                }}>{totalDelancamentosParaConferencia}</span> lançamentos
                </div>
            </div>
        )
    }

    const verificaSeExisteLancamentoComStatusDeAjuste = () => {
        let marcados = getLancamentosSelecionados()
        if (marcados && marcados.length > 0) {
            return marcados.find(element => element && element.analise_lancamento && element.analise_lancamento.resultado === 'AJUSTE')
        }
    }

    const setExibicaoBotoesMarcarComo = (rowData) => {
        let tem_lancamento_status_de_ajuste = verificaSeExisteLancamentoComStatusDeAjuste()
        if (rowData.analise_lancamento && rowData.analise_lancamento.resultado === 'CORRETO') {
            setExibirBtnMarcarComoCorreto(false)
            setExibirBtnMarcarComoNaoConferido(true)
        } else {
            if (tem_lancamento_status_de_ajuste === undefined) {
                setExibirBtnMarcarComoCorreto(true)
                setExibirBtnMarcarComoNaoConferido(false)
            } else {
                setExibirBtnMarcarComoCorreto(false)
                setExibirBtnMarcarComoNaoConferido(false)
            }
        }
    }

    const verificaSePodeSerCheckado = (e, rowData) => {

        let selecionados = getLancamentosSelecionados()
        let status_permitido = []

        if (selecionados.length > 0) {
            if (!selecionados[0].analise_lancamento || (selecionados[0].analise_lancamento && selecionados[0].analise_lancamento.resultado && selecionados[0].analise_lancamento.resultado === "AJUSTE")) {
                status_permitido = [null, 'AJUSTE']
            } else {
                status_permitido = ['CORRETO']
            }
        }

        if (e.target.checked && status_permitido.length > 0) {
            if (status_permitido.includes(rowData.analise_lancamento) || (rowData.analise_lancamento && rowData.analise_lancamento && rowData.analise_lancamento.resultado && status_permitido.includes(rowData.analise_lancamento.resultado))) {
                return true
            } else {
                setShowModalCheckNaoPermitido(true)
                return false
            }
        } else {
            return true
        }
    }

    const tratarSelecionado = (e, lancamentosParaConferenciaUuid, rowData) => {
        if (editavel){
            let verifica_se_pode_ser_checkado = verificaSePodeSerCheckado(e, rowData)
            if (verifica_se_pode_ser_checkado) {

                let cont = quantidadeSelecionada;
                if (e.target.checked) {
                    cont = cont + 1
                } else {
                    cont = cont - 1
                }
                setQuantidadeSelecionada(cont);
                let result = lancamentosParaConferencia.reduce((acc, o) => {
                    let obj = lancamentosParaConferenciaUuid === o.documento_mestre.uuid ? Object.assign(o, {selecionado: e.target.checked}) : o;
                    acc.push(obj);
                    return acc;
                }, []);
                setLancamentosParaConferencia(result);
                setExibicaoBotoesMarcarComo(rowData)
            }
        }

    }

    const marcarComoCorreto = async () => {
        let lancamentos_marcados_como_corretos = getLancamentosSelecionados()

        if (lancamentos_marcados_como_corretos && lancamentos_marcados_como_corretos.length > 0) {
            let payload = [];
            lancamentos_marcados_como_corretos.map((lancamento) =>
                payload.push({
                    "tipo_lancamento": lancamento.tipo_transacao === 'Gasto' ? 'GASTO' : 'CREDITO',
                    "lancamento": lancamento.documento_mestre.uuid,
                })
            );
            payload = {
                'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
                'lancamentos_corretos': [
                    ...payload
                ]
            }
            try {
                await postLancamentosParaConferenciaMarcarComoCorreto(prestacaoDeContas.uuid, payload)
                console.log("Marcados como correto com sucesso!")
                desmarcarTodos()
                await carregaLancamentosParaConferencia(prestacaoDeContas, contaUuid)
            } catch (e) {
                console.log("Erro ao marcar como correto ", e.response)
            }
        }
    }

    const marcarComoNaoConferido = async () => {
        let lancamentos_marcados_como_nao_conferidos = getLancamentosSelecionados()

        if (lancamentos_marcados_como_nao_conferidos && lancamentos_marcados_como_nao_conferidos.length > 0) {
            let payload = [];
            lancamentos_marcados_como_nao_conferidos.map((lancamento) =>
                payload.push({
                    "tipo_lancamento": lancamento.tipo_transacao === 'Gasto' ? 'GASTO' : 'CREDITO',
                    "lancamento": lancamento.documento_mestre.uuid,
                })
            );

            payload = {
                'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
                'lancamentos_nao_conferidos': [
                    ...payload
                ]
            }
            try {
                await postLancamentosParaConferenciaMarcarNaoConferido(prestacaoDeContas.uuid, payload)
                console.log("Marcados como não conferido com sucesso!")
                desmarcarTodos()
                await carregaLancamentosParaConferencia(prestacaoDeContas, contaUuid)
            } catch (e) {
                console.log("Erro ao marcar como não conferido ", e.response)
            }
        }
    }

    const getLancamentosSelecionados = () => {
        return lancamentosParaConferencia.filter((lancamento) => lancamento.selecionado)
    }

    // Filtros Lancamentos
    const initialStateFiltros = {
        filtrar_por_acao: '',
        filtrar_por_lancamento: '',
    }
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleSubmitFiltros = async () => {
        desmarcarTodos()
        await carregaLancamentosParaConferencia(prestacaoDeContas, contaUuid, stateFiltros.filtrar_por_acao, stateFiltros.filtrar_por_lancamento)
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaLancamentosParaConferencia(prestacaoDeContas, contaUuid);
    };

    const addDispatchRedireciona = (lancamentos) => {
        dispatch(limparDetalharAcertos())
        dispatch(addDetalharAcertos(lancamentos))
        history.push(`/dre-detalhe-prestacao-de-contas-detalhar-acertos/${prestacaoDeContas.uuid}`)
    }

    const detalharAcertos = () => {
        let lancamentos_marcados_para_acertos = getLancamentosSelecionados()
        addDispatchRedireciona(lancamentos_marcados_para_acertos)
    }

    const redirecionaDetalhe = (lancamento) => {
        if (editavel){
            addDispatchRedireciona(lancamento)
        }

    }

    return (
        <>
            <FiltrosConferenciaDeLancamentos
                stateFiltros={stateFiltros}
                tabelasDespesa={tabelaDespesa}
                handleChangeFiltros={handleChangeFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
            />
            {quantidadeSelecionada > 0 ?
                montagemSelecionar() :
                mensagemQuantidadeExibida()
            }
            {lancamentosParaConferencia && lancamentosParaConferencia.length > 0 &&
            <DataTable
                value={lancamentosParaConferencia}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                paginator={lancamentosParaConferencia.length > rowsPerPage}
                rows={rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                rowClassName={rowClassName}
                selectionMode="single"
                onRowClick={e => redirecionaDetalhe(e.data)}
                stripedRows
            >
                <Column
                    header={selecionarHeader()}
                    body={selecionarTemplate}
                    style={{borderRight: 'none', width: '75px'}}
                />
                <Column
                    field='data'
                    header='Data'
                    body={dataTemplate}
                    className="align-middle text-left borda-coluna"
                />
                <Column field='tipo_transacao' header='Tipo de lançamento'
                        className="align-middle text-left borda-coluna"/>
                <Column
                    field='numero_documento'
                    header='N.º do documento'
                    body={numeroDocumentoTemplate}
                    className="align-middle text-left borda-coluna"
                />
                <Column field='descricao' header='Descrição' className="align-middle text-left borda-coluna"/>
                <Column
                    field='valor_transacao_total'
                    header='Valor (R$)'
                    body={valor_template}
                    className="align-middle text-left borda-coluna"
                />
                <Column
                    field='analise_lancamento'
                    header='Conferido'
                    body={conferidoTemplate}
                    className="align-middle text-left borda-coluna"
                    style={{borderRight: 'none'}}
                />
                <Column expander style={{width: '3em', borderLeft: 'none'}}/>
            </DataTable>
            }
            <section>
                <ModalCheckNaoPermitidoConfererenciaDeLancamentos
                    show={showModalCheckNaoPermitido}
                    handleClose={() => setShowModalCheckNaoPermitido(false)}
                    titulo='Seleção não permitida'
                    texto='<p>Esse lançamento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>'
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                />
            </section>
        </>
    )
}

export default memo(TabelaConferenciaDeLancamentos)