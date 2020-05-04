import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import IconeNaoConciliado from "../../../../assets/img/icone-nao-conciliado.svg"
import Img404 from "../../../../assets/img/img-404.svg";

export const TabelaDeLancamentos = ({conciliados}) => {

    const rowsPerPage = 7;

    const estado = [

        {cnpjCpf: '53.274.690/0001-33', razaoSocial: 'Papelaria Araçari LTDA', tipoDocumento: 'NFS-e', numDocumento: '883271263', dataDocumento: '24/02/2020', tipoTransacao: 'Boleto bancário', dataTransacao: '26/02/2020', aplicacaoDoRecurso: 'Capital', especMatRecurso: 'Compra de 200 tablets', valor: 'R$12.234,76'},
        {cnpjCpf: '53.274.690/0001-33', razaoSocial: 'Lavatudo lavanderia industrial LTDA', tipoDocumento: 'NFS-e', numDocumento: '883271263', dataDocumento: '24/02/2020', tipoTransacao: 'Boleto bancário', dataTransacao: '26/02/2020', aplicacaoDoRecurso: 'Custeio', especMatRecurso: 'Compra de 200 tablets', valor: 'R$12.234,76'},
        {cnpjCpf: '53.274.690/0001-33', razaoSocial: 'Umapalavralonga SA', tipoDocumento: 'NFS-e', numDocumento: '883271263', dataDocumento: '24/02/2020', tipoTransacao: 'Cheque', dataTransacao: '26/02/2020', aplicacaoDoRecurso: 'Capital', especMatRecurso: 'Compra de 200 tablets', valor: 'R$12.234,76'},
        {cnpjCpf: '53.274.690/0001-33', razaoSocial: 'Papelaria Kalunga LTDA', tipoDocumento: 'NFS-e', numDocumento: '883271263', dataDocumento: '24/02/2020', tipoTransacao: 'Boleto bancário', dataTransacao: '26/02/2020', aplicacaoDoRecurso: 'Custeio', especMatRecurso: 'Compra de 200 tablets', valor: 'R$12.234,76'},
    ];

    const getConferido = (rowData) => {
        return (
            <div>
                {conciliados ? (
                    <div className="align-middle text-center">
                        <input type="checkbox" value="" id="checkConferido"/>
                    </div>
                ): (
                    <div className="text-center">
                        <img
                            src={IconeNaoConciliado}
                            alt=""
                            className="img-fluid"
                        />
                    </div>
                )}

            </div>
        )
    }

    return (
        <div className="row mt-4">
            <div className="col-12">
                <p className="detalhe-das-prestacoes-titulo-lancamentos">Laçamentos {conciliados ? "conciliados" : "pendentes de conciliação"}</p>
                <div className="content-section implementation">
                    <DataTable
                        value={estado}
                        className="mt-3 datatable-footer-coad"
                        paginator={estado.length > rowsPerPage}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        autoLayout={true}
                        selectionMode="single"
                        //onRowClick={e => redirecionaDetalhe(e.data)}
                    >
                        <Column field="cnpjCpf" header="CNPJ ou CPF do fornecedor" />
                        <Column field="razaoSocial" header="Razão social do fornecedor"/>
                        <Column field="tipoDocumento" header="Tipo de documento"/>
                        <Column field="numDocumento" header="Número do documento"/>
                        <Column field="dataDocumento" header="Data do documento"/>
                        <Column field="tipoTransacao" header="Tipo de transação"/>
                        <Column field="dataTransacao" header="Data da transação"/>
                        <Column field="aplicacaoDoRecurso" header="Aplicação do recurso"/>
                        <Column field="especMatRecurso" header="Especificação do material ou serviço"/>
                        <Column field="valor" header="Valor"/>
                        <Column
                            field="conferido"
                            header="Conferido"
                            body={getConferido}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    )
}