import React, {memo, useState, useCallback} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment";
import IconeNaoDemonstrado from "../../../../../assets/img/icone-nao-demonstrado.svg";
import ReactTooltip from "react-tooltip";

const TabelaTransacoes = ({transacoes, conciliados, checkboxTransacoes, handleChangeCheckboxTransacoes, periodoFechado}) => {

    const [expandedRows, setExpandedRows] = useState(null);

    const dataTip = (notificar_dias_nao_conferido) => {
        let meses = Math.trunc(notificar_dias_nao_conferido / 30);
        let msg = (notificar_dias_nao_conferido <= 59) ? `1 mês.` : `${meses} meses.`;

        return `Não demonstrado por ${msg}`;
    };

    const notificarNaoConciliado = (notificarDiasNaoConferido) => {
        return notificarDiasNaoConferido > 0 ? {color: 'red', fontWeight: 'bold'} : {color: 'black'}
    };

    const conferidoTemplate = useCallback((rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    //checked={conciliados}
                    type="checkbox"
                    value={checkboxTransacoes}
                    onChange={(e) => handleChangeCheckboxTransacoes(e, rowData.uuid)}
                    name="checkConferido"
                    id="checkConferido"
                    disabled={periodoFechado}
                />
            </div>
        )
    }, [checkboxTransacoes, handleChangeCheckboxTransacoes, periodoFechado]);

    const dataTemplate = (rowData = null, column = null, data = null) => {
        let data_para_verificar;
        if (data) {
            data_para_verificar = data
        } else {
            data_para_verificar = rowData[column.field]
        }
        if (rowData && rowData.notificar_dias_nao_conferido && rowData.notificar_dias_nao_conferido > 0) {
            return (
                <div data-tip={dataTip(rowData.notificar_dias_nao_conferido)}>
                    <img
                        src={IconeNaoDemonstrado}
                        alt=""
                        className="img-fluid mb-1 mr-1"
                    />
                    <span style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>
                        {data_para_verificar ? moment(data_para_verificar).format('DD/MM/YYYY') : '-'}
                    </span>
                    <ReactTooltip/>
                </div>
            )
        } else {
            return (
                <span>
                    {data_para_verificar ? moment(data_para_verificar).format('DD/MM/YYYY') : '-'}
                </span>
            )
        }
    };

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

        if (rowData && rowData.valor_transacao_na_conta !== rowData.valor_transacao_total){
            return (
                <span>
                    {valor_formatado}
                    AQUI 
                </span>

            )
        }else {
            return valor_formatado
        }


    };

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
                        {dataTemplate(null, null, data.documento_mestre.data_transacao)}
                    </div>
                    {data.documento_mestre.tipo_transacao.nome === 'Cheque' &&
                    <div className='col border-left'>
                        <p className='mb-0 font-weight-bold'>Número do cheque:</p>
                        API NÃO TEM NUMERO CHEQUE
                    </div>
                    }
                </div>

                {data.rateios && data.rateios.length > 0 && data.rateios.map((rateio, index) => (
                    <div key={index} className='row mt-2 mb-2'>
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
                            {rateio.aplicacao_recurso ? rateio.aplicacao_recurso : ''}
                        </div>
                        <div className='col border-left'>
                            <p className='mb-0 font-weight-bold'>Valor:</p>
                            {rateio.valor_rateio ? valorTemplate(null, null, rateio.valor_rateio) : 0}
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
                        <Column
                            field="data"
                            header="Data"
                            style={{borderLeft: 'none'}}
                            body={dataTemplate}
                        />
                        <Column field="tipo_transacao" header="Tipo de lançamento"/>
                        <Column className='quebra-palavra' field="numero_documento" header="N.º do documento"/>
                        <Column field="descricao" header="Descrição"/>
                        <Column
                            field="valor_transacao_na_conta"
                            header="Valor (R$)"
                            body={valorTemplate}
                        />
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

