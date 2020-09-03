import React, {useState} from "react";
import {useHistory} from 'react-router-dom';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import IconeNaoConciliado from "../../../../../assets/img/icone-nao-conciliado.svg"
import {RedirectModalTabelaLancamentos} from "../../../../../utils/Modais";
import moment from "moment";
import IconeNaoDemonstrado from "../../../../../assets/img/icone-nao-demonstrado.svg";
import ReactTooltip from "react-tooltip";

export const TabelaDeLancamentosDespesas = ({conciliados, despesas, checkboxDespesas, handleChangeCheckboxDespesas}) => {

    let history = useHistory();
    const rowsPerPage = 7;

    const [showModal, setShowModal] = useState(false);
    const [uuid, setUuid] = useState('');

    const onShowModal = () => {
        setShowModal(true);
    };

    const onHandleClose = () => {
        setShowModal(false);
    };

    const onCancelarTrue = () => {
        setShowModal(false);
        const url = '/edicao-de-despesa/' + uuid + '/tabela-de-lancamentos-despesas';
        history.push(url);
    };

    const redirecionaDetalhe = value => {
        setUuid(value.despesa);
        onShowModal();
    };

    const notificarNaoConciliado = (notificarDiasNaoConferido) => {
        return notificarDiasNaoConferido > 0 ? {color: 'red', fontWeight: 'bold'} : {color: 'black'}
    };

    const conferidoTemplate = (rowData) => {
        if (rowData.status_despesa === "COMPLETO"){
            return (
                <div className="align-middle text-center">
                    <input
                        checked={conciliados}
                        type="checkbox"
                        value={checkboxDespesas}
                        onChange={(e)=>handleChangeCheckboxDespesas(e, rowData.uuid)}
                        name="checkConferido"
                        id="checkConferido"
                    />
                </div>
            )
        }else {
            return (
                <div className="text-center">
                    <img
                        src={IconeNaoConciliado}
                        alt=""
                        className="img-fluid"
                    />
                </div>
            )
        }

    };

    const dataDocumentoTemplate = (rowData) => {
        return (
            <div style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>
                {rowData['data_documento']
                    ? moment(rowData['data_documento']).format('DD/MM/YYYY')
                    : ''}
            </div>
        )
    };

    const dataTransacaoTemplate = (rowData) => {
        return (
            <div style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>
                {rowData['data_transacao']
                    ? moment(rowData['data_transacao']).format('DD/MM/YYYY')
                    : ''}
            </div>
        )
    };

    const valorTemplate = (rowData) => {
        const valorFormatado = rowData['valor_total']
            ? Number(rowData['valor_total']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '';
        return (<span style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>{valorFormatado}</span>)
    };

    const cnpjTemplate = (rowData) => {
        return (
            rowData['notificar_dias_nao_conferido'] > 0 ?
                <div data-tip={`Não demonstrado por ${rowData['notificar_dias_nao_conferido']} dias.`}>
                    <img
                        src={IconeNaoDemonstrado}
                        alt=""
                        className="img-fluid"
                    />
                    <span style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>
                        {"  " + rowData['cpf_cnpj_fornecedor']}
                    </span>
                    <ReactTooltip />
                </div>
                :
                <span style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>
                    {rowData['cpf_cnpj_fornecedor']}
                </span>

        )
    };

    const genericTemplate = (rowData, column) => {
        return (<span
            style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>{rowData[column.field]}</span>)
    };

    const especificacaoTemplate = (rowData) => {
        return (<span
            style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>{rowData['especificacao_material_servico'].descricao}</span>)
    };

    return (
        <div className="row mt-4">
            <div className="col-12">
                <p className="detalhe-das-prestacoes-titulo-lancamentos">Lançamentos {conciliados ? "conciliados" : "pendentes de conciliação"}</p>
                <div className="datatable-responsive-demo">
                    <DataTable
                        value={despesas}
                        className="mt-3 tabela-lancamentos-despesas p-datatable-responsive-demo"
                        paginator={despesas.length > rowsPerPage}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        autoLayout={true}
                        selectionMode="single"
                        onRowClick={e => redirecionaDetalhe(e.data)}
                    >
                        <Column field="cpf_cnpj_fornecedor" header="CNPJ ou CPF do fornecedor" body={cnpjTemplate}/>
                        <Column field="nome_fornecedor" header="Razão social do fornecedor" body={genericTemplate}/>
                        <Column field="tipo_documento_nome" header="Tipo de documento" body={genericTemplate}/>
                        <Column field="numero_documento" header="Número do documento" body={genericTemplate}/>
                        <Column
                            field="data_documento"
                            header="Data do documento"
                            body={dataDocumentoTemplate}
                        />
                        <Column field="tipo_transacao_nome" header="Tipo de transação" body={genericTemplate} />
                        <Column
                            field="data_transacao"
                            header="Data da transação"
                            body={dataTransacaoTemplate}

                        />
                        <Column field="aplicacao_recurso" header="Aplicação do recurso" body={genericTemplate}/>
                        <Column field="especificacao_material_servico.descricao" header="Especificação do material ou serviço" body={especificacaoTemplate}/>
                        <Column
                            field="valor_total"
                            header="Valor"
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
            <section>
                <RedirectModalTabelaLancamentos show={showModal} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
        </div>
    )
};