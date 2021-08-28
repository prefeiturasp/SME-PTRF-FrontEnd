import React, {useEffect, useState} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {getTabelasReceita} from "../../../../services/escolas/Receitas.service";
import {getDespesasTabelas} from "../../../../services/escolas/Despesas.service";

export const TabelaConferenciaDeLancamentos = ({lancamentosParaConferencia}) => {

    const rowsPerPage = 10;

    const [expandedRows, setExpandedRows] = useState(null);
    const [tabelasReceita, setTabelasReceita] = useState([]);
    const [tabelasDespesa, setTabelasDespesa] = useState([]);

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

    const dataTemplate = (rowData='', column='', data_passada=null) => {
        if (rowData && column){
            return (
                <div className='p-2'>
                    {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : '-'}
                </div>
            )
        }else if (data_passada){
            return (
                data_passada ? moment(data_passada).format('DD/MM/YYYY') : '-'
            )
        }
    };

    const numeroDocumentoTemplate = (rowData, column) => {
        return (
            <div className='p-2'>
                {rowData[column.field] ? rowData[column.field] : '-'}
            </div>
        )
    }

    const valorTemplate = (rowData, column) => {
        let valor_formatado = Number(rowData[column.field]).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
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

    const rowClassName = (rowData) => {
        if (rowData && rowData.analise_lancamento && rowData.analise_lancamento.resultado === 'CORRETO') {
            return {'linha-conferencia-de-lancamentos-correto': true}
        }
    }

    const rowExpansionDespesaTemplate = (data) => {
        return(
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
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.data_transacao ? dataTemplate(null, null, data.documento_mestre.data_transacao): ''}</p>
                    </div>
                </div>
                {data.rateios && data.rateios.length > 0 && data.rateios.map((rateio, index) => (
                    <div key={index} className='row border-bottom border-right border-left'>
                        <div className='col-12 mb-2'>
                            <p className='font-weight-bold mb-1 pb-2 border-bottom titulo-row-expanded'>Despesa {index + 1}</p>
                        </div>

                        <div className='col'>
                            <p className='mb-0 font-weight-bold'>Tipo de despesa:</p>
                            {rateio.tipo_custeio && rateio.tipo_custeio.nome ? rateio.tipo_custeio.nome : ''}
                        </div>
                        <div className='col border-left'>
                            <p className='mb-0 font-weight-bold'>Especificação:</p>
                            {rateio.especificacao_material_servico && rateio.especificacao_material_servico.descricao ? rateio.especificacao_material_servico.descricao : ''}
                        </div>
                        <div className='col border-left'>
                            <p className='mb-0 font-weight-bold'>Tipo de aplicação:</p>
                            {rateio.aplicacao_recurso ? tabelasDespesa.tipos_aplicacao_recurso.find(element => element.id === rateio.aplicacao_recurso).nome : ''}
                        </div>
                        <div className='col border-left'>
                            <p className='mb-0 font-weight-bold'>Ação:</p>
                            {rateio.acao_associacao && rateio.acao_associacao.nome ? rateio.acao_associacao.nome : ''}
                        </div>
{/*                        <div className='col border-left'>
                            <p className='mb-0 font-weight-bold'>Valor:</p>
                            {rateio.valor_rateio ? valorTemplate(null, null, rateio.valor_rateio) : 0}
                        </div>
                        <div className='col border-left align-middle text-center'>
                            <p className='mb-0 font-weight-bold'>Demonstrado:</p>
                            {conferidoRateioTemplate(rateio)}
                        </div>*/}
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

    return (
        <DataTable
            value={lancamentosParaConferencia}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            className='p-datatable-responsive-demo'
            paginator={lancamentosParaConferencia.length > rowsPerPage}
            rows={rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            autoLayout={true}
            rowClassName={rowClassName}
            stripedRows
        >
            {/*<Column header={selecionarHeader()} body={selecionarTemplate}/>*/}
            <Column
                field='data'
                header='Data'
                body={dataTemplate}
                className="align-middle text-left borda-coluna"
            />
            <Column field='tipo_transacao' header='Tipo de lançamento' className="align-middle text-left borda-coluna"/>
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
    )
}