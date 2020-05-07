import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export const DemonstrativoFinanceiro = () => {

    const rowsPerPage = 7;

    const estado = [

        {nomeAcao: 'Fazendo Futuro', receitaDeclarada: 'R$ 230,00', despesaDeclarada: 'R$ 2.432,54'},
        {nomeAcao: 'Orçamento do Grêmio Estudantil', receitaDeclarada: 'R$0,0', despesaDeclarada: 'R$ 356,90'},
        {nomeAcao: 'PTRF', receitaDeclarada: 'R$ 2,00', despesaDeclarada: 'R$ 50.342,54'},
        {nomeAcao: 'Rolê Cultural', receitaDeclarada: 'R$ 0,50', despesaDeclarada: 'R$ 875, 23'},
    ];

    const getNomeAcao = (rowData) => {
        return (
            <div>
                <p className="demonstrativo-financeiro-nome-acao"><strong>{rowData['nomeAcao']}</strong></p>
                <p className="demonstrativo-financeiro-documento-pendente">Documento pendente de geração</p>
            </div>
        )
    }

    const getBotoes = () => {
        return (
            <div className="text-right">
                <button type="button" className="btn btn-outline-success mr-2">prévia </button>
                <button disabled={true} type="button" className="btn btn-success btn-readonly">documento final </button>
            </div>
        )
    }

    return (
        <div className="demonstrativo-financeiro-container mt-5">
            <p className="demonstrativo-financeiro-titulo">Demontrativo Financeiro</p>

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
                    <Column
                        field="nomeAcao"
                        header="Nome da ação"
                        body={getNomeAcao}
                    />
                    <Column field="receitaDeclarada" header="Receita declarada"/>
                    <Column field="despesaDeclarada" header="Despesa declarada"/>
                    <Column
                        field='botoes'
                        header=''
                        body={getBotoes}
                    />
                </DataTable>
            </div>
        </div>
    );
}