import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ColumnGroup} from 'primereact/columngroup';
import {Row} from 'primereact/row';

export const TabelaValoresPendentesPorAcao = () => {
    const rowsPerPage = 7;

    const sales = [

        {acao: 'PTRF Básico', totalReceitas: 'R$ 2.353,30', conciliadoReceitas: 'R$ 1954,54', aconciliarReceitas: 'R$ 54,406.00', totalDespesas: 'R$ 43,34', conciliadoDespesas: '$43,342', aconciliarDespesas: 'R$ 54,406.00'},
        {acao: 'Volta às aulas', totalReceitas: 'R$ 8,00', conciliadoReceitas: 'R$ 0,00', aconciliarReceitas: 'R$ 423,132', totalDespesas: 'R$ 312,12', conciliadoDespesas: '$43,342', aconciliarDespesas: 'R$ 54,406.00'},
        {acao: 'Fazendo Futuro', totalReceitas: 'R$ 234,74', conciliadoReceitas: 'R$ 234,74', aconciliarReceitas: 'R$ 12,321', totalDespesas: 'R$ 8,50', conciliadoDespesas: '$43,342', aconciliarDespesas: '$R$ 4,406.00'},
        {acao: 'Rolê Cultural', totalReceitas: 'R$ 234,74', conciliadoReceitas: 'R$ 234,74', aconciliarReceitas: 'R$ 745,232', totalDespesas: 'R$ 650,32,', conciliadoDespesas: '$43,342', aconciliarDespesas: 'R$ 54,406.00'},
        {acao: 'Orçamento Grêmio Estudantil', totalReceitas: 'R$ 40,45', conciliadoReceitas: 'R$ 40,45', aconciliarReceitas: 'R$ 643,242', totalDespesas: 'R$ 500,32', conciliadoDespesas: '$43,342', aconciliarDespesas: 'R$ 54,406.00'},
        {acao: 'Educom - Imprensa Jovem', totalReceitas: 'R$ 765,43', conciliadoReceitas: 'R$ 765,43', aconciliarReceitas: 'R$ 421,13', totalDespesas: 'R$ 150,05', conciliadoDespesas: '$43,342', aconciliarDespesas: 'R$ 54,406.00'},
        {acao: 'Mais Escola', totalReceitas: 'R$ 10,54', conciliadoReceitas: 'R$ 10,54', aconciliarReceitas: 'R$ 10,54', totalDespesas: 'R$ 100,21', conciliadoDespesas: 'R$ 43,34', aconciliarDespesas: 'R$ 54,406.00'},
        {acao: 'Formação', totalReceitas: 'R$ 4,54', conciliadoReceitas: 'R$ 0,00', aconciliarReceitas: 'R$ 4,54', totalDespesas: 'R$ 296,23', conciliadoDespesas: 'R$ 43,32', aconciliarDespesas: 'R$ 54,406.00'},
    ];

    let headerGroup = <ColumnGroup>
        <Row className="detalhe-das-prestacoes-tabela-fundo-azul-claro">
            <Column style={{background: 'red'}} className="detalhe-das-prestacoes-tabela-fundo-azul-claro" header="Ação" rowSpan={3} />
        </Row>
        <Row>
            <Column className="detalhe-das-prestacoes-align-center detalhe-das-prestacoes-tabela-th-fundo-branco" header="Receitas" colSpan={3} />
            <Column className="detalhe-das-prestacoes-align-center detalhe-das-prestacoes-tabela-th-fundo-branco" header="Despesas" colSpan={3} />
        </Row>
        <Row>
            <Column className="detalhe-das-prestacoes-tabela-th-fundo-branco" header="Total" />
            <Column className="detalhe-das-prestacoes-tabela-th-fundo-branco" header="Conciliado" />
            <Column className="detalhe-das-prestacoes-tabela-th-fundo-branco" header="À conciliar" />
            <Column className="detalhe-das-prestacoes-tabela-th-fundo-branco" header="Total" />
            <Column className="detalhe-das-prestacoes-tabela-th-fundo-branco" header="Conciliado" />
            <Column className="detalhe-das-prestacoes-tabela-th-fundo-branco" header="À conciliar" />
        </Row>
    </ColumnGroup>;

    let footerGroup = <ColumnGroup>
        <Row>
            <Column className="detalhe-das-prestacoes-tabela-fundo-azul-claro" footer="Total"/>
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer="R$ 3.651,74" />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer="R$ 2.718,51" />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer="R$ 810,10" />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer="R$ 70.454,86" />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer="R$ 61.165,93" />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer="R$ 9.388,93" />
        </Row>
    </ColumnGroup>;


    return(
        <div className="row mt-4">
            <div className="col-12">
                <p className="detalhe-das-prestacoes-titulo-lancamentos">Valores pendentes de conciliação por ação</p>

                <div className="content-section implementation">
                    <DataTable
                        value={sales}
                        headerColumnGroup={headerGroup}
                        footerColumnGroup={footerGroup}
                        className="detalhe-das-prestacoes-tabela"
                    >
                        <Column className="detalhe-das-prestacoes-tabela-fundo-azul-claro" field="acao" />
                        <Column field="totalReceitas" />
                        <Column field="conciliadoReceitas" />
                        <Column field="aconciliarReceitas" />
                        <Column field="totalDespesas" />
                        <Column field="conciliadoDespesas" />
                        <Column field="aconciliarDespesas" />
                    </DataTable>
                </div>

            </div>
        </div>
    );
}