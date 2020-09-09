import React, {Component} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {getAcoes, previa, documentoFinal, getDemonstrativoInfo} from "../../../../services/escolas/DemonstrativoFinanceiro.service";


export class DemonstrativoFinanceiro extends Component {
    _isMounted = false;

    state = {
        rowsPerPage: 30,
        estado: [],
    }

    componentDidMount() {
        this._isMounted = true;
        this.buscaAcoes()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.periodoPrestacaoDeConta !== this.props.periodoPrestacaoDeConta || prevProps.contaPrestacaoDeContas !== this.props.contaPrestacaoDeContas) {
            this.buscaAcoes()
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    buscaAcoes = async () => {
        const periodo_uuid = this.props.periodoPrestacaoDeConta.periodo_uuid;
        const conta_uuid = this.props.contaPrestacaoDeContas.conta_uuid;
        const associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID);

        if (periodo_uuid && conta_uuid && associacao_uuid){
            const result = await getAcoes(associacao_uuid, periodo_uuid);
            Promise.all(result.info_acoes.map(async (info) => {
                const msg = await getDemonstrativoInfo(info.acao_associacao_uuid, conta_uuid, periodo_uuid);
                return {
                    nomeAcao: info.acao_associacao_nome,
                    acaoUuid: info.acao_associacao_uuid,
                    receitaDeclarada: info.receitas_no_periodo,
                    despesaDeclarada: info.despesas_no_periodo,
                    mensagem: msg}
            })).then((result) => {
                if(this._isMounted) {
                    this.setState({estado: result});
                }
            });
        }
    };

    gerarPrevia = async (acaoUuid) => {
        this.props.setLoading(true);
        const periodo_uuid = JSON.parse(localStorage.getItem('periodoPrestacaoDeConta')).periodo_uuid
        const conta_uuid = JSON.parse(localStorage.getItem('contaPrestacaoDeConta')).conta_uuid
        await previa(acaoUuid, conta_uuid, periodo_uuid);
        this.props.setLoading(false);
    }

    gerarDocumentoFinal = async (acaoUuid) => {
        this.props.setLoading(true);
        const periodo_uuid = JSON.parse(localStorage.getItem('periodoPrestacaoDeConta')).periodo_uuid
        const conta_uuid = JSON.parse(localStorage.getItem('contaPrestacaoDeConta')).conta_uuid
        await documentoFinal(acaoUuid, conta_uuid, periodo_uuid);
        await this.buscaAcoes();
        this.props.setLoading(false);
    }

    getNomeAcao = (rowData) => {
        return (
            <div>
                <p className="demonstrativo-financeiro-nome-acao"><strong>{rowData['nomeAcao']}</strong></p>
                <p className={rowData['mensagem'].includes('pendente') ? "demonstrativo-financeiro-documento-pendente" :"demonstrativo-financeiro-documento-gerado"}  >{rowData['mensagem']}</p>
            </div>
        )
    }

    getBotoes = (rowData) => {
        return (
            <div className="text-right">
                {this.props.statusPrestacaoDeConta && this.props.statusPrestacaoDeConta.prestacao_contas_status && !this.props.statusPrestacaoDeConta.prestacao_contas_status.periodo_encerrado &&
                    <button type="button" disabled={this.props.statusPrestacaoDeConta && this.props.statusPrestacaoDeConta.prestacao_contas_status && this.props.statusPrestacaoDeConta.prestacao_contas_status.periodo_encerrado} className="btn btn-outline-success mr-2">prévia </button>
                }
                {/*<button type="button" onClick={(e) => this.gerarPrevia(rowData['acaoUuid'])} className="btn btn-outline-success mr-2">prévia </button>*/}
                <button disabled={this.props.statusPrestacaoDeConta && this.props.statusPrestacaoDeConta.prestacao_contas_status && !this.props.statusPrestacaoDeConta.prestacao_contas_status.periodo_encerrado} onClick={(e) => this.gerarDocumentoFinal(rowData['acaoUuid'])} type="button" className="btn btn-success">documento final</button>
            </div>
        )
    }

    valorReceita = (rowData, column) => {
        const valor = rowData['receitaDeclarada']
            ? Number(rowData['receitaDeclarada']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : 'R$ 0';
        const valorFormatado = `${valor}`
        return (<span>{valorFormatado}</span>)
    }

    valorDespesa = (rowData, column) => {
        const valor = rowData['despesaDeclarada']
            ? Number(rowData['despesaDeclarada']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : 'R$ 0';
        const valorFormatado = `${valor}`;
        return (<span>{valorFormatado}</span>)
    }

    render() {
        const {estado, rowsPerPage} = this.state;
        return (
            <div className="demonstrativo-financeiro-container mt-5">
                <p className="demonstrativo-financeiro-titulo">Demonstrativo Financeiro</p>

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
                            body={this.getNomeAcao}
                        />
                        <Column
                            field="receitaDeclarada"
                            header="Receita declarada"
                            body={this.valorReceita}/>
                        <Column
                            field="despesaDeclarada"
                            header="Despesa declarada"
                            body={this.valorDespesa}/>
                        <Column
                            field='botoes'
                            header=''
                            body={this.getBotoes}
                        />
                    </DataTable>
                </div>
            </div>);
    }
}