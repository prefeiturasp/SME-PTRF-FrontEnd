import React, {useState} from "react";
import {useHistory} from 'react-router-dom';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import IconeNaoConciliado from "../../../../assets/img/icone-nao-conciliado.svg"
import {RedirectModalTabelaLancamentos} from "../../../../utils/Modais";
import moment from "moment";

export const TabelaDeLancamentosDespesas = ({conciliados, despesas, checkboxDespesas, handleChangeCheckboxDespesas}) => {

    let history = useHistory();
    const rowsPerPage = 7;

    console.log("TabelaDeLancamentosDespesas ", despesas)

    const estado = [
        {uuid:'e9688f81-e75b-40ca-a47d-603dea73af14', cnpjCpf: '53.274.690/0001-33', razaoSocial: 'Papelaria Araçari LTDA', tipoDocumento: 'NFS-e', numDocumento: '883271263', dataDocumento: '24/02/2020', tipoTransacao: 'Boleto bancário', dataTransacao: '26/02/2020', aplicacaoDoRecurso: 'Capital', especMatRecurso: 'Compra de 200 tablets', valor: 'R$12.234,76'},
        {uuid:'e9688f81-e75b-40ca-a47d-603dea73af14', cnpjCpf: '53.274.690/0001-33', razaoSocial: 'Lavatudo lavanderia industrial LTDA', tipoDocumento: 'NFS-e', numDocumento: '883271263', dataDocumento: '24/02/2020', tipoTransacao: 'Boleto bancário', dataTransacao: '26/02/2020', aplicacaoDoRecurso: 'Custeio', especMatRecurso: 'Compra de 200 tablets', valor: 'R$12.234,76'},
        {uuid:'e9688f81-e75b-40ca-a47d-603dea73af14', cnpjCpf: '53.274.690/0001-33', razaoSocial: 'Umapalavralonga SA', tipoDocumento: 'NFS-e', numDocumento: '883271263', dataDocumento: '24/02/2020', tipoTransacao: 'Cheque', dataTransacao: '26/02/2020', aplicacaoDoRecurso: 'Capital', especMatRecurso: 'Compra de 200 tablets', valor: 'R$12.234,76'},
        {uuid:'e9688f81-e75b-40ca-a47d-603dea73af14', cnpjCpf: '53.274.690/0001-33', razaoSocial: 'Papelaria Kalunga LTDA', tipoDocumento: 'NFS-e', numDocumento: '883271263', dataDocumento: '24/02/2020', tipoTransacao: 'Boleto bancário', dataTransacao: '26/02/2020', aplicacaoDoRecurso: 'Custeio', especMatRecurso: 'Compra de 200 tablets', valor: 'R$12.234,76'},
    ];

    const [showModal, setShowModal] = useState(false);
    const [uuid, setUuid] = useState('');

    const onShowModal = () => {
        setShowModal(true);
    }

    const onHandleClose = () => {
        setShowModal(false);
    }

    const onCancelarTrue = () => {
        setShowModal(false);
        const url = '/edicao-de-despesa/' + uuid + '/tabela-de-lancamentos-despesas'
        history.push(url);
    }


    const redirecionaDetalhe = value => {
        console.log("redirecionaDetalhe ", value)
        setUuid(value.uuid)
        onShowModal();
    }

    const conferidoTemplate = (rowData) => {
        console.log("status_despesa ", conciliados)
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

    }

    const dataDocumento = (rowData, column) => {
        return (
            <div>
                {rowData['data_documento']
                    ? moment(rowData['data_documento']).format('DD/MM/YYYY')
                    : ''}
            </div>
        )
    }

    const dataTransacao = (rowData, column) => {
        return (
            <div>
                {rowData['data_transacao']
                    ? moment(rowData['data_transacao']).format('DD/MM/YYYY')
                    : ''}
            </div>
        )
    }

    const valorTemplate = (rowData, column) => {
        const valorFormatado = rowData['valor_total']
            ? new Number(rowData['valor_total']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : ''
        return (<span>{valorFormatado}</span>)
    }

    return (
        <div className="row mt-4">
            <div className="col-12">
                <p className="detalhe-das-prestacoes-titulo-lancamentos">Laçamentos {conciliados ? "conciliados" : "pendentes de conciliação"}</p>
                <div className="content-section implementation">
                    <DataTable
                        value={despesas}
                        className="mt-3 datatable-footer-coad"
                        paginator={despesas.length > rowsPerPage}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        autoLayout={true}
                        selectionMode="single"
                        onRowClick={e => redirecionaDetalhe(e.data)}
                    >
                        <Column field="cpf_cnpj_fornecedor" header="CNPJ ou CPF do fornecedor" />
                        <Column field="nome_fornecedor" header="Razão social do fornecedor"/>
                        <Column field="tipo_documento_nome" header="Tipo de documento"/>
                        <Column field="numero_documento" header="Número do documento"/>
                        <Column
                            field="data_documento"
                            header="Data do documento"
                            body={dataDocumento}
                        />
                        <Column field="tipo_transacao_nome" header="Tipo de transação" />
                        <Column
                            field="data_transacao"
                            header="Data da transação"
                            body={dataTransacao}

                        />
                        <Column field="aplicacao_recurso" header="Aplicação do recurso"/>
                        <Column field="especificacao_material_servico.descricao" header="Especificação do material ou serviço"/>
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
}