import React, {useEffect, useMemo, useState} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {getTabelasReceita} from "../../../../services/escolas/Receitas.service";
import {getDespesasTabelas} from "../../../../services/escolas/Despesas.service";
import Dropdown from "react-bootstrap/Dropdown";
import ReactTooltip from "react-tooltip";

export const TabelaConferenciaDeLancamentos = ({setLancamentosParaConferencia, lancamentosParaConferencia}) => {

    console.log("XXXXXXXXXXXXXXX LANCAMENTOS ", lancamentosParaConferencia)

    const rowsPerPage = 10;

    const [expandedRows, setExpandedRows] = useState(null);
    const [tabelasReceita, setTabelasReceita] = useState([]);
    const [tabelasDespesa, setTabelasDespesa] = useState([]);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [exibirBtnMarcarComoCorreto, setExibirBtnMarcarComoCorreto] = useState(false)
    const [exibirBtnMarcarComoNaoConferido, setExibirBtnMarcarComoNaoConferido] = useState(false)

    useEffect(() => {
        const carregaTabelasReceita = async () => {
            getTabelasReceita().then(response => {
                setTabelasReceita(response.data);
            }).catch(error => {
                console.log(error);
            });
        };
        carregaTabelasReceita()
    }, []);

    useEffect(() => {
        const carregaTabelasDespesa = async () => {
            const resp = await getDespesasTabelas();
            setTabelasDespesa(resp);
        };
        carregaTabelasDespesa();
    }, []);

    const dataTemplate = (rowData = '', column = '', data_passada = null) => {
        if (rowData && column) {
            return (
                <div className='p-2'>
                    {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : '-'}
                </div>
            )
        } else if (data_passada) {
            return (
                data_passada ? moment(data_passada).format('DD/MM/YYYY') : '-'
            )
        }
    };

    const numeroDocumentoTemplate = (rowData, column) => {
        return (
            <div className='p-2 text-wrap-conferencia-de-lancamentos'>
                {rowData[column.field] ? rowData[column.field] : '-'}
            </div>
        )
    }

    const valorTemplate = (rowData = null, column = null, valor = null) => {
        let valor_para_formatar;
        if (valor) {
            valor_para_formatar = valor
        } else {
            valor_para_formatar = rowData[column.field]
        }
        let valor_formatado = Number(valor_para_formatar).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");

        if (rowData && rowData.valor_transacao_na_conta !== rowData.valor_transacao_total) {
            let texto_exibir = `<div><strong>Valor total de despesa:</strong> ${Number(rowData.valor_transacao_total).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}</div>`;
            rowData.valores_por_conta.map((item) => (
                texto_exibir += `<div><strong>Conta ${item.conta_associacao__tipo_conta__nome}:</strong> ${Number(item.valor_rateio__sum).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}</div>`
            ));

            return (
                <div data-tip={texto_exibir} data-html={true}>
                    <span>
                        {valor_formatado}
                    </span>
                    <FontAwesomeIcon
                        style={{fontSize: '18px', marginLeft: "3px", color: '#C65D00'}}
                        icon={faInfoCircle}
                    />
                    <ReactTooltip/>
                </div>
            )
        } else {
            return valor_formatado
        }

    };

    const conferidoTemplate = (rowData, column) => {
        if (rowData[column.field] && rowData[column.field]['resultado'] && rowData[column.field]['resultado'] === 'CORRETO') {
            return (
                <div className='p-2'>
                    <FontAwesomeIcon
                        style={{marginRight: "3px", color: '#297805'}}
                        icon={faCheckCircle}
                    />
                </div>
            )
        } else if (rowData[column.field] && rowData[column.field]['resultado'] && rowData[column.field]['resultado'] === 'AJUSTE') {
            return (
                <div className='p-2'>
                    <FontAwesomeIcon
                        style={{marginRight: "3px", color: '#B40C02'}}
                        icon={faCheckCircle}
                    />
                </div>
            )
        } else {
            return (
                <div className='p-2'>-</div>
            )
        }
    }

    const conferidoRateioTemplate = (rateio) => {
        return (
            <div>
                <input
                    defaultValue={rateio.conferido}
                    defaultChecked={rateio.conferido}
                    type="checkbox"
                    //value={checkboxTransacoes}
                    //onChange={()=>{}}
                    name="checkConferido"
                    id="checkConferido"
                    disabled={true}
                />
            </div>
        )
    };

    const tagRateioTemplate = (rateio) => {
        if (rateio && rateio.tag && rateio.tag.nome) {
            return (
                <span
                    className='span-rateio-tag-conferencia-de-lancamentos text-wrap-conferencia-de-lancamentos'>rateio.tag.nome</span>
            )
        } else {
            return (
                <span> - </span>
            )
        }
    }

    const rowClassName = (rowData) => {
        if (rowData && rowData.analise_lancamento && rowData.analise_lancamento.resultado) {
            return {'linha-conferencia-de-lancamentos-correto': true}
        }
    }

    const rowExpansionDespesaTemplate = (data) => {
        return (
            <div className='col-12 px-4 py-2'>
                <div className='row'>
                    <div className='col border'>
                        <p className='mt-2 mb-0'><strong>CNPJ / CPF</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.cpf_cnpj_fornecedor ? data.documento_mestre.cpf_cnpj_fornecedor : ''}</p>
                    </div>
                    <div className='col border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Tipo de documento</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.tipo_documento && data.documento_mestre.tipo_documento.nome ? data.documento_mestre.tipo_documento.nome : ''}</p>
                    </div>
                    <div className='col border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Tipo de transação</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.tipo_transacao && data.documento_mestre.tipo_transacao.nome ? data.documento_mestre.tipo_transacao.nome : ''}</p>
                    </div>
                    <div className='col border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Data de transação</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.data_transacao ? dataTemplate(null, null, data.documento_mestre.data_transacao) : ''}</p>
                    </div>
                    <div className='col border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Número do documento:</strong></p>
                        <p className='mb-2'>{data.documento_mestre.documento_transacao}</p>
                    </div>
                </div>
                {data.rateios && data.rateios.length > 0 && data.rateios.map((rateio, index) => (
                    <div key={index} className='row border-bottom border-right border-left pb-3'>

                        <div className='col-12 mb-2'>
                            <p className='font-weight-bold mb-2 mt-2 pb-2 titulo-row-expanded-conferencia-de-lancamentos'>Despesa {index + 1}</p>
                        </div>

                        <div className='col-12'>
                            <div className='col-12 border'>
                                <div className='row'>
                                    <div className='col p-2'>
                                        <p className='mb-0 font-weight-bold'>Tipo de despesa:</p>
                                        {rateio.tipo_custeio && rateio.tipo_custeio.nome ? rateio.tipo_custeio.nome : ''}
                                    </div>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Especificação:</p>
                                        {rateio.especificacao_material_servico && rateio.especificacao_material_servico.descricao ? rateio.especificacao_material_servico.descricao : ''}
                                    </div>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Tipo de aplicação</p>
                                        {rateio.aplicacao_recurso ? tabelasDespesa.tipos_aplicacao_recurso.find(element => element.id === rateio.aplicacao_recurso).nome : ''}
                                    </div>

                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Demonstrado</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-12'>
                            <div className='col-12 border-bottom border-right border-left'>
                                <div className='row'>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Tipo de ação:</p>
                                        {rateio.acao_associacao && rateio.acao_associacao.nome ? rateio.acao_associacao.nome : ''}
                                    </div>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Valor</p>
                                        {rateio.valor_rateio ? valorTemplate(null, null, rateio.valor_rateio) : 0}
                                    </div>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Vínculo a atividade</p>
                                        {tagRateioTemplate(rateio)}
                                    </div>
                                    <div
                                        className='col border-left p-2 d-flex justify-content-center align-items-center'>
                                        {conferidoRateioTemplate(rateio)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const rowExpansionReceitaTemplate = (data) => {
        return (
            <div className='col-12 px-4 py-2'>
                <div className='row'>
                    <div className='col-4 border'>
                        <p className='mt-2 mb-0'><strong>Detalhamento do crédito</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.detalhamento ? data.documento_mestre.detalhamento : ''}</p>
                    </div>
                    <div className='col-4 border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Classificação do crédito</strong></p>
                        <p className='mb-2'>{data.documento_mestre && data.documento_mestre.categoria_receita ? tabelasReceita.categorias_receita.find(elemnt => elemnt.id === data.documento_mestre.categoria_receita).nome : ''}</p>
                    </div>
                    <div className='col-4 border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Tipo de ação</strong></p>
                        <p className='mb-2'>{data.documento_mestre && data.documento_mestre.acao_associacao && data.documento_mestre.acao_associacao.nome ? data.documento_mestre.acao_associacao.nome : ''}</p>
                    </div>
                </div>
            </div>
        )
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

    const desmarcarTodos = (event) => {
        event.preventDefault();
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
                />
            </div>
        )
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle text-center">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                        <input
                            checked={false}
                            type="checkbox"
                            value=""
                            onChange={(e) => e}
                            name="checkHeader"
                            id="checkHeader"
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => selecionarTodos(e)}>Selecionar todos</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => desmarcarTodos(e)}>Desmarcar todos</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatus(e, "CORRETO")}>Selecionar todos corretos</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatus(e, null)}>Selecionar todos não conferidos</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
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
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "unidade selecionada" : "unidades selecionadas"} / {lancamentosParaConferencia.length} totais
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
                                                style={{color: "white", fontSize: '15px', marginRight: "2px"}}
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
                                                style={{color: "white", fontSize: '15px', marginRight: "2px"}}
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

    // Quando a state da lista sofrer alteração
    const totalDeTipos = useMemo(() => lancamentosParaConferencia.length, [lancamentosParaConferencia]);

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12" style={{padding: "15px 0px", margin: "0px 15px", flex: "100%"}}>
                    Exibindo <span style={{color: "#00585E", fontWeight: "bold"}}>{totalDeTipos}</span> unidades
                </div>
            </div>
        )
    }

    const tratarSelecionado = async (e, lancamentosParaConferenciaUuid) => {

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
    }

    const marcarComoCorreto = () => {
        let lancamentos_marcados_como_corretos = getLancamentosSelecionados()
        console.log("XXXXXXX marcarComoCorreto ", lancamentos_marcados_como_corretos)
    }

    const marcarComoNaoConferido = () => {
        let lancamentos_marcados_como_nao_conferidos = getLancamentosSelecionados()
        console.log("XXXXXXX marcarComoNaoConferido ", lancamentos_marcados_como_nao_conferidos)
    }

    const getLancamentosSelecionados = () =>{
        return lancamentosParaConferencia.filter((lancamento) => lancamento.selecionado)

    }

    return (
        <>
            {quantidadeSelecionada > 0 ?
                (montagemSelecionar()) :
                (mensagemQuantidadeExibida())
            }
            <DataTable
                value={lancamentosParaConferencia}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                paginator={lancamentosParaConferencia.length > rowsPerPage}
                rows={rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                rowClassName={rowClassName}
                stripedRows
            >
                <Column header={selecionarHeader()} body={selecionarTemplate}/>
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
                    body={valorTemplate}
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
        </>
    )
}