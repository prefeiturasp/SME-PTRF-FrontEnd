import React, {useEffect, useMemo, useState, memo} from "react";
import {useHistory} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import {ModalCheckNaoPermitidoConfererenciaDeLancamentos} from "./Modais/ModalCheckNaoPermitidoConfererenciaDeLancamentos";
// Hooks Personalizados
import useValorTemplate from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate";
import {useCarregaTabelaDespesa} from "../../../../../hooks/Globais/useCarregaTabelaDespesa";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import useConferidoTemplate
    from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate";
import useRowExpansionDespesaTemplate
    from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionDespesaTemplate";
import useNumeroDocumentoTemplate
    from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate";

// Redux
import {useDispatch} from "react-redux";
import {addDetalharAcertos, limparDetalharAcertos} from "../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions";
import {ModalLegendaConferenciaLancamentos} from "./Modais/ModalLegendaConferenciaLancamentos"
import { TableTags } from "../../../../Globais/TableTags";
import { LegendaInformacao } from "../../../../Globais/ModalLegendaInformacao/LegendaInformacao";
import { coresTagsDespesas } from "../../../../../utils/CoresTags";
import {Filtros} from "./Filtros";
import { useConferenciaDespesasPeriodosAnteriores } from "./context/ConferenciaDespesasPeriodosAnteriores";
import { Acoes } from "./tabela/Acoes";
import { usePostMarcarComoCorreto } from "./hooks/usePostMarcarComoCorreto";
import { usePostMarcarComoNaoCorreto } from "./hooks/usePostMarcarComoNaoCorreto";
import Loading from "../../../../../utils/Loading";
const TabelaConferenciaDeLancamentos = () => {

    const rowsPerPage = 10;
    const history = useHistory();
    // Redux
    const dispatch = useDispatch()

    const [expandedRows, setExpandedRows] = useState(null);
    const [exibirBtnMarcarComoCorreto, setExibirBtnMarcarComoCorreto] = useState(false)
    const [exibirBtnMarcarComoNaoConferido, setExibirBtnMarcarComoNaoConferido] = useState(false)
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)
    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false)
    const [showModalLegendaConferenciaLancamento, setShowModalLegendaConferenciaLancamento] = useState(false)
    const {mutationPostMarcarComoCorreto} = usePostMarcarComoCorreto();
    const {mutationPostMarcarComoNaoCorreto} = usePostMarcarComoNaoCorreto();

    const {
        prestacaoDeContas,         
        lancamentosParaConferencia,
        editavel,
        handleChangeCheckBoxOrdenarPorImposto,
        setLancamentosParaConferencia,
        onChangeOrdenamento,
        onChangePage,
        stateCheckBoxOrdenarPorImposto,
        componentState,
        isLoadingDespesas
     } = useConferenciaDespesasPeriodosAnteriores();
     
    // Hooks Personalizados
    const valor_template = useValorTemplate()
    const dataTemplate = useDataTemplate()
    const conferidoTemplate = useConferidoTemplate()
    const tabelaDespesa = useCarregaTabelaDespesa(prestacaoDeContas)
    const rowExpansionDespesaTemplate = useRowExpansionDespesaTemplate(prestacaoDeContas)
    const numeroDocumentoTemplate = useNumeroDocumentoTemplate()

    const [multiSortMeta, setMultiSortMeta] = useState(componentState?.ordenamento_tabela_lancamentos);
    const [primeiroRegistroASerExibido, setPrimeiroRegistroASerExibido] = useState(componentState?.paginacao_atual);

    const totalLancamentos = useMemo(() => lancamentosParaConferencia.length, [lancamentosParaConferencia]);
    const totalLancamentosSelecionados = useMemo(() => lancamentosParaConferencia.filter((item) => item.selecionado).length, [lancamentosParaConferencia]);


    const rowClassName = (rowData) => {
        if (rowData && rowData.analise_lancamento && rowData.analise_lancamento.resultado) {
            return {'linha-conferencia-de-lancamentos-correto': true}
        }
    }

    const rowExpansionTemplate = (data) => {
        return rowExpansionDespesaTemplate(data);
    };

    const selecionarPorStatus = (event, status = null) => {
        event.preventDefault();

        desmarcarTodos();

        let result
        if (status) {
            if(status === "CORRETO"){
                setExibirBtnMarcarComoCorreto(false)
                setExibirBtnMarcarComoNaoConferido(true)
            }
            else if(status === "AJUSTE"){
                setExibirBtnMarcarComoCorreto(true)
                setExibirBtnMarcarComoNaoConferido(false)
            }
            result = lancamentosParaConferencia.filter((o) => o.analise_lancamento && o.analise_lancamento.resultado && o.analise_lancamento.resultado === status);
        } else {
            setExibirBtnMarcarComoCorreto(true)
            setExibirBtnMarcarComoNaoConferido(false)
            result = lancamentosParaConferencia.filter((o) => !o.analise_lancamento);
        }

        setLancamentosParaConferencia(result.map((_r) => _r.documento_mestre.uuid));
    }

    const desmarcarTodos = () => {
        setExibirBtnMarcarComoCorreto(false)
        setExibirBtnMarcarComoNaoConferido(false)
        setLancamentosParaConferencia([]);
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
            }
            else {
                setExibirBtnMarcarComoCorreto(true)
                setExibirBtnMarcarComoNaoConferido(false)
            }
        }
    }

    const verificaSePodeSerCheckado = (e, rowData) => {
        const selecionados = getLancamentosSelecionados()
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
        if (editavel) {
            const verifica_se_pode_ser_checkado = verificaSePodeSerCheckado(e, rowData)
            if (verifica_se_pode_ser_checkado) {
                let result = lancamentosParaConferencia.filter((o) => lancamentosParaConferenciaUuid === o.documento_mestre.uuid)
                setLancamentosParaConferencia(result.map((_r) => _r.documento_mestre.uuid));
                setExibicaoBotoesMarcarComo(rowData)
            }
        }
    }

    const marcarComoCorreto = async () => {
            let lancamentos_marcados_como_corretos = getLancamentosSelecionados();
            if (lancamentos_marcados_como_corretos && lancamentos_marcados_como_corretos.length > 0) {
                let payload = {
                    'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
                    'lancamentos_corretos': lancamentos_marcados_como_corretos.map(lancamento => ({
                        "tipo_lancamento": 'GASTO',
                        "lancamento": lancamento.documento_mestre.uuid,
                    }))
                };

            mutationPostMarcarComoCorreto.mutate({prestacaoDeContasUUID: prestacaoDeContas.uuid, payload: payload})
        }
    }

    const marcarComoNaoConferido = async () => {
        let lancamentos_marcados_como_nao_conferidos = getLancamentosSelecionados();
        if (lancamentos_marcados_como_nao_conferidos && lancamentos_marcados_como_nao_conferidos.length > 0) {
            let payload = {
                'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
                'lancamentos_nao_conferidos': lancamentos_marcados_como_nao_conferidos.map(lancamento => ({
                    "tipo_lancamento": 'GASTO',
                    "lancamento": lancamento.documento_mestre.uuid,
                }))
            };
            mutationPostMarcarComoNaoCorreto.mutate({prestacaoDeContasUUID: prestacaoDeContas.uuid, payload: payload});
        }
    }

    const getLancamentosSelecionados = () => {
        return lancamentosParaConferencia.filter((lancamento) => lancamento.selecionado)
    }

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
        if (editavel) {
            addDispatchRedireciona(lancamento)
        }
    }

    const onPaginationClick = (event) => {
        setPrimeiroRegistroASerExibido(event.first);
        onChangePage(event.rows * event.page);
        // : 
    }
    const onSort = (event) => {   
        let copiaArrayDeOrdenamento = [...event.multiSortMeta]
        setMultiSortMeta(copiaArrayDeOrdenamento);
        onChangeOrdenamento(copiaArrayDeOrdenamento)
    };

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
            <div className="align-middle">
                {editavel &&
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" className="p-0">
                            <input
                                checked={false}
                                type="checkbox"
                                value=""
                                onChange={(e) => e.stopPropagation(e)}
                                name="checkHeader"
                                id="checkHeader"
                                disabled={!editavel}
                            />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => selecionarPorStatus(e, "CORRETO")}>Selecionar todos
                                corretos</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => selecionarPorStatus(e, "AJUSTE")}>
                                Selecionar todos com solicitação de ajuste</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => selecionarPorStatus(e, null)}>Selecionar todos não
                                conferidos</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => desmarcarTodos(e)}>Desmarcar todos</Dropdown.Item>
                        </Dropdown.Menu>

                    </Dropdown>
                }
            </div>
        )
    }
    return (
        <>
            <Filtros tabelasDespesa={tabelaDespesa}/>

            {lancamentosParaConferencia && lancamentosParaConferencia.length > 0 &&
                <div className="form-group form-check">
                    <input
                        onChange={(e)=>handleChangeCheckBoxOrdenarPorImposto(e.target.checked)}
                        checked={stateCheckBoxOrdenarPorImposto}
                        name={`checkOerdenarPorImposto`}
                        id={`checkOerdenarPorImposto`}
                        type="checkbox"
                        className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor={`checkOerdenarPorImposto`}>Ordenar com imposto vinculados às despesas</label>
                </div>
            }

            <div className="d-flex justify-content-between align-middle">
                <div>
                    Exibindo <span style={{
                    color: "#00585E",
                    fontWeight: "bold"
                }}>{totalLancamentos}</span> lançamentos
                </div>
                <div>
                    <span>
                    <LegendaInformacao
                        showModalLegendaInformacao={showModalLegendaInformacao}
                        setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                    />
                    <FontAwesomeIcon
                        style={{fontSize: '18px', marginRight: "8px", marginLeft: "8px", color: '#00585D'}}
                        icon={faInfoCircle}
                    />
                        <button className='legendas-table text-md-start' onClick={() => setShowModalLegendaConferenciaLancamento(true)} style={{color: '#00585D', outline: 'none', border: 0, background: 'inherit', padding: '4px'}} >Legenda conferência</button>
                    </span>

                </div>
            </div>

            {totalLancamentosSelecionados > 0 ? (
                <Acoes
                    totalLancamentos={totalLancamentos}
                    totalLancamentosSelecionados={totalLancamentosSelecionados}
                    exibirBtnMarcarComoCorreto={exibirBtnMarcarComoCorreto}
                    exibirBtnMarcarComoNaoConferido={exibirBtnMarcarComoNaoConferido}
                    desmarcarTodos={desmarcarTodos}
                    marcarComoCorreto={marcarComoCorreto}
                    marcarComoNaoConferido={marcarComoNaoConferido}
                />
            ) : null}

            {
                isLoadingDespesas ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) : (
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
                        // onRowClick={e => redirecionaDetalhe(e.data)}
                        stripedRows
                        sortMode="multiple"
                        // Usado para salvar no localStorage a página atual após os calculos ** ver função onPaginationClick
                        first={primeiroRegistroASerExibido}
                        onPage={onPaginationClick}
                        multiSortMeta={multiSortMeta}
                        onSort={onSort}
                        emptyMessage={"Nenhum resultado encontrado"}
                    >
                        <Column
                            header={selecionarHeader()}
                            body={selecionarTemplate}
                            style={{borderRight: 'none', width: '5%'}}
                        />
                        <Column
                            field='data'
                            header='Data'
                            body={dataTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{width: '10%'}}
                            sortable
                        />
                        <Column
                            field='numero_documento'
                            header='N.º do documento'
                            body={numeroDocumentoTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{width: '17%'}}
                        />
                        <Column field='descricao' header='Descrição' className="align-middle text-left borda-coluna"
                                style={{width: '24%'}}/>
                        <Column 
                            field='informacoes'
                            header='Informações'
                            className="align-middle text-left borda-coluna"
                            body={(rowData) => <TableTags data={rowData} coresTags={coresTagsDespesas}/>}
                            style={{width: '15%'}}
                            sortField="informacoes_ordenamento"  
                            sortable  
                        />
                        <Column
                            field='valor_transacao_total'
                            header='Valor (R$)'
                            body={valor_template}
                            className="align-middle text-left borda-coluna"
                            style={{width: '10%'}}
                            sortable
                        />
                        <Column
                            field='analise_lancamento'
                            header='Conferido'
                            body={conferidoTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{borderRight: 'none', width: '10%'}}
                        />
                        <Column expander style={{width: '5%', borderLeft: 'none'}}/>
                    </DataTable>                    
                )
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

            <ModalLegendaConferenciaLancamentos
                show={showModalLegendaConferenciaLancamento}
                primeiroBotaoOnclick={() => setShowModalLegendaConferenciaLancamento(false)}
                titulo="Legenda da Conferência de Lançamentos"
                primeiroBotaoTexto="Fechar"
                primeiroBotaoCss="outline-success"
            />
        </>
    )
}

export default memo(TabelaConferenciaDeLancamentos)