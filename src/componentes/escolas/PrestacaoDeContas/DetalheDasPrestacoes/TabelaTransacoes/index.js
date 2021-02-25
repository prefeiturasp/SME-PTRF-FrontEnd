import React, {memo, useState, useCallback} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

const TabelaTransacoes = ({transacoes, conciliados, checkboxTransacoes, handleChangeCheckboxTransacoes, periodoFechado}) => {

    console.log("TabelaTransacoes ", periodoFechado)

    const [expandedRows, setExpandedRows] = useState(null);

    const conferidoTemplate = useCallback((rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={conciliados}
                    type="checkbox"
                    value={checkboxTransacoes}
                    onChange={(e) => handleChangeCheckboxTransacoes(e, rowData.uuid)}
                    name="checkConferido"
                    id="checkConferido"
                    disabled={periodoFechado}
                />
            </div>
        )
    }, [checkboxTransacoes, conciliados, handleChangeCheckboxTransacoes]);

    const rowExpansionTemplate = (data) => {
        console.log('EXPANDIR expandedRows ', expandedRows)
        console.log('EXPANDIR data ', data)
        if (data.tipo_transacao === 'Crédito') {
            return (
                receitaTemplate(data)
            )
        } else {
            return (
                despesaTemplate(data)
            )
        }
    };

    const despesaTemplate = (data) => {
        return (
            <>
                <div className='row'>
                    <div className='col'>
                        <p className='mb-0 font-weight-bold'>CNPJ:</p>
                        {data.documento_mestre.cpf_cnpj_fornecedor}
                    </div>
                    <div className='col border-left'>
                        <p className='mb-0 font-weight-bold'>Tipo de documento:</p>
                        {data.documento_mestre.tipo_documento.nome}
                    </div>
                    <div className='col border-left'>
                        <p className='mb-0 font-weight-bold'>Tipo de transação:</p>
                        {data.documento_mestre.tipo_transacao.nome}
                    </div>
                    <div className='col border-left'>
                        <p className='mb-0 font-weight-bold'>Data de transação:</p>
                        {data.documento_mestre.data_transacao}
                    </div>
                    {data.documento_mestre.tipo_transacao.nome === 'Cheque' &&
                    <div className='col border-left'>
                        <p className='mb-0 font-weight-bold'>Número do cheque:</p>
                        API NÃO TEM NUMERO CHEQUE
                    </div>
                    }
                </div>

                {data.rateios && data.rateios.length > 0 && data.rateios.map((rateio, index) => (
                    <div className='col-12'>
                        <div className='row mt-2 border-bottom'>
                            <p className='font-weight-bold'>Despesa {index + 1}</p>
                        </div>
                        <div className='row'>
                            <div className='col' key={index}>
                                <p className='mb-0 font-weight-bold'>Tipo de despesa:</p>
                                {rateio.tipo_custeio.nome}
                            </div>
                        </div>
                    </div>

                ))}

            </>

        )
    };

    const receitaTemplate = (data) => {
        return (
            <>
                <div className='row'>
                    <div className='col'>
                        <p className='mb-0 font-weight-bold'>Detalhamento do crédito:</p>
                        {data.documento_mestre.detalhamento}
                    </div>
                    <div className='col border-left'>
                        <p className='mb-0 font-weight-bold'>Classificação do crédito:</p>
                        {data.documento_mestre.categoria_receita}
                    </div>
                </div>
            </>
        )
    };

    return (
        <div className="row mt-4">
            <div className="col-12">
                <p className="detalhe-das-prestacoes-titulo-lancamentos">Lançamentos {conciliados ? "conciliados" : "pendentes de conciliação"}</p>
                <div className="datatable-responsive-demo">
                    <DataTable
                        value={transacoes}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        dataKey="documento_mestre.uuid"
                        className='tabela-transacoes tabela-transacoes tabela-lancamentos-despesas p-datatable-responsive-demo'
                    >
                        <Column expander style={{width: '3em', borderRight: 'none'}}/>
                        <Column field="data" header="Data" style={{borderLeft: 'none'}}/>
                        <Column field="tipo_transacao" header="Tipo de lançamento"/>
                        <Column className='transacoes-numero-documento' field="numero_documento"
                                header="N.º do documento"/>
                        <Column field="descricao" header="Descrição"/>
                        <Column field="valor_transacao_total" header="Valor (R$)"/>
                        <Column
                            field="conferido"
                            header="Demonstrado"
                            body={conferidoTemplate}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    )
};

export default memo(TabelaTransacoes)

