import React, {Component} from "react";
import 'primeicons/primeicons.css';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ColumnGroup} from 'primereact/columngroup';
import {Row} from 'primereact/row';
import {tabelaValoresPendentes} from '../../../../../services/escolas/TabelaValoresPendentesPorAcao.service'

import "./styles.css";

export class TabelaValoresPendentesPorAcao extends Component {
    _isMounted = false

    constructor() {
        super();

        this.state = {
            sales: [],
            rowsPerPage: 7,
            periodo: JSON.parse(localStorage.getItem('periodoConta')).periodo,
            totais: {},
            expandedRows: false,
            chevron: "pi pi-chevron-right"
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getTabelaValoresPendentes();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getValorFormatado = (rowValue, green=false) => {
        const valor = rowValue
            ? new Number(rowValue).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : 0
        const valorFormatado = (valor !== 0 && valor.includes('R$')) ? valor : `R$ ${valor}`
        return (<span style={{color: valor === 0 && green ? 'green' : 'black'}}>{valorFormatado}</span>)
    }

    getTabelaValoresPendentes = async () => {
        tabelaValoresPendentes(localStorage.getItem('uuidPrestacaoConta')).then((result) => {
            const valoresPendentes = result.map(tabelaInfo => (
                {
                    acao: tabelaInfo.acao_associacao_nome, 
                    totalReceitas: tabelaInfo.receitas_no_periodo,
                    conciliadoReceitas: tabelaInfo.receitas_no_periodo - tabelaInfo.receitas_nao_conciliadas, 
                    aconciliarReceitas: tabelaInfo.receitas_nao_conciliadas,
                    totalDespesas: tabelaInfo.despesas_no_periodo,
                    conciliadoDespesas: tabelaInfo.despesas_no_periodo - tabelaInfo.despesas_nao_conciliadas,
                    aconciliarDespesas: tabelaInfo.despesas_nao_conciliadas
                }
            ))
            if(this._isMounted){
                this.setState({sales: valoresPendentes});
                const totais = {
                    totalReceitas: this.state.sales.map(sale => (sale.totalReceitas)).reduce((a,b) => a+b, 0),
                    totalReceitasConciliadas: this.state.sales.map(sale => (sale.conciliadoReceitas)).reduce((a,b) => a+b, 0),
                    totalReceitasNaoConciliadas: this.state.sales.map(sale => (sale.aconciliarReceitas)).reduce((a,b) => a+b, 0),
                    totalDespesas: this.state.sales.map(sale => (sale.totalDespesas)).reduce((a,b) => a+b, 0),
                    totalDespesasConciliadas: this.state.sales.map(sale => (sale.conciliadoDespesas)).reduce((a,b) => a+b, 0),
                    totalDespesasNaoConciliadas: this.state.sales.map(sale => (sale.aconciliarDespesas)).reduce((a,b) => a+b, 0),
                }
                this.setState({totais: totais});
            }
            
        })
    }

    openBody = () => {
        this.setState({
            expandedRows: !this.state.expandedRows,
            chevron: (!this.state.expandedRows ? "pi pi-chevron-down": "pi pi-chevron-right")
        });
    }

    header = () => {
        return (
            <div onClick={this.openBody} className="datatable-header-cursor">
                <i className={this.state.chevron}/>Ação
            </div>)
    }

    headerGroup() {
        return (
        <ColumnGroup>
        <Row className="detalhe-das-prestacoes-tabela-fundo-azul-claro">
            <Column  style={{background: 'red'}} className="detalhe-das-prestacoes-tabela-fundo-azul-claro" header={this.header()} rowSpan={3} > Ação nossa</Column>
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

        </ColumnGroup>)
        }

    footerGroup() { 
        return (
        <ColumnGroup>
        <Row>
            <Column className="detalhe-das-prestacoes-tabela-fundo-azul-claro" footer="Total"/>
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer={this.getValorFormatado(this.state.totais.totalReceitas)} />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer={this.getValorFormatado(this.state.totais.totalReceitasConciliadas)} />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer={this.getValorFormatado(this.state.totais.totalReceitasNaoConciliadas, true)} />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer={this.getValorFormatado(this.state.totais.totalDespesas)} />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer={this.getValorFormatado(this.state.totais.totalDespesasConciliadas)} />
            <Column className='detalhe-das-prestacoes-tabela-th-fundo-branco fonte-normal' footer={this.getValorFormatado(this.state.totais.totalDespesasNaoConciliadas, true)} />
        </Row>
        </ColumnGroup>);
    }
    render() {
        const {sales, rowsPerPage} = this.state;
        return (
            <div className="row mt-4">
                <div className="col-12">
                    <p className="detalhe-das-prestacoes-titulo-lancamentos">Valores pendentes de conciliação por ação</p>

                    <div className="content-section implementation">
                        <DataTable
                            value={ this.state.expandedRows ? sales : []}
                            headerColumnGroup={this.headerGroup()}
                            footerColumnGroup={this.footerGroup()}
                            className="detalhe-das-prestacoes-tabela mt-3 datatable-footer-coad"
                            paginator={sales.length > rowsPerPage}
                            rows={rowsPerPage}
                            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                            autoLayout={true}
                        >
                            <Column className="detalhe-das-prestacoes-tabela-fundo-azul-claro" field="acao" />
                            <Column field="totalReceitas" body={(row, column) => (this.getValorFormatado(row['totalReceitas']))} />
                            <Column field="conciliadoReceitas" body={(row, column) => (this.getValorFormatado(row['conciliadoReceitas']))} />
                            <Column field="aconciliarReceitas" body={(row, column) => (this.getValorFormatado(row['aconciliarReceitas'], true))} />
                            <Column field="totalDespesas" body={(row, column) => (this.getValorFormatado(row['totalDespesas']))} />
                            <Column field="conciliadoDespesas" body={(row, column) => (this.getValorFormatado(row['conciliadoDespesas']))} />
                            <Column field="aconciliarDespesas" body={(row, column) => (this.getValorFormatado(row['aconciliarDespesas'], true))} />
                        </DataTable>
                    </div>

                </div>
            </div>    
        )
    }
}
