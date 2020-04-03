import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Row, Col } from 'reactstrap'
import { getListaRateiosDespesas } from '../../../services/RateiosDespesas.service'
import { redirect } from '../../../utils/redirect.js'
import '../../../paginas/404/pagina-404.scss'
import Img404 from '../../../assets/img/img-404.svg'
import { Route } from 'react-router-dom'
import moment from 'moment'

export class ListaDeDespesas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rateiosDespesas: []
    }
  }

  buscaRateiosDespesas = async () => {
    const rateiosDespesas = await getListaRateiosDespesas()
    this.setState({ rateiosDespesas })
  }

  componentDidMount() {
    this.buscaRateiosDespesas()
  }

  numeroDocumentoStatusTemplate(rowData, column) {
    const statusColor =
      rowData['status_despesa'] === 'COMPLETO'
        ? 'ptrf-despesa-status-ativo'
        : 'ptrf-despesa-status-inativo'
    const statusText =
      rowData['status_despesa'] === 'COMPLETO'
        ? 'Status: Completo'
        : 'Status: Incompleto'
    return (
      <div>
        <span>{rowData['numero_documento']}</span>
        <br></br>
        <span className={statusColor}>{statusText}</span>
      </div>
    )
  }

  especificacaoDataTemplate(rowData, column) {
    return (
      <div>
        <span>
          {rowData['especificacao_material_servico']
            ? rowData['especificacao_material_servico'].descricao
            : ''}
        </span>
        <br></br>
        <span>
          Data:{' '}
          {rowData['data_documento']
            ? moment(rowData['data_documento']).format('DD/MM/YYYY')
            : ''}
        </span>
      </div>
    )
  }

  valorTotalTemplate(rowData, column) {
    const valorFormatado = rowData['valor_total']
      ? rowData['valor_total'].toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      : ''
    return <span>{valorFormatado}</span>
  }

  novaDespesaButton() {
    return (
      <Route
        render={({ history }) => (
          <Button
            icon="pi pi-file"
            label="Cadastrar despesa"
            style={{ marginBottom: '.80em' }}
            className="btn-coad-background-outline"
            onClick={() => {
              history.push('/cadastro-de-despesa')
            }}
          />
        )}
      />
    )
  }

  redirecionaDetalhe = value => {
    console.log(value)
    const url = '/edicao-de-despesa/' + value.despesa
    redirect(url)
  }

  render() {
    const { rateiosDespesas } = this.state
    const rowsPerPage = 10
    return (
      <div>
        <Row>
          <Col lg={8} xl={8}>
            <i
              className="float-left fas fa-file-signature"
              style={{ marginRight: '5px', color: '#42474A' }}
            ></i>
            <h6 style={{ fontWeight: 'bold' }}></h6>
          </Col>
          <Col lg={4} xl={4}>
            <span className="float-right">{this.novaDespesaButton()}</span>
          </Col>
        </Row>
        {rateiosDespesas.length > 0 ? (
          <DataTable
            value={rateiosDespesas}
            className="mt-3 datatable-footer-coad"
            paginator={rateiosDespesas.length > rowsPerPage}
            rows={rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            autoLayout={true}
            selectionMode="single"
            onRowClick={e => this.redirecionaDetalhe(e.data)}
          >
            <Column
              field="numero_documento"
              header="Número do documento"
              body={this.numeroDocumentoStatusTemplate}
            />
            <Column
              field="especificacao_material_servico.descricao"
              header="Especificação do material ou serviço"
              body={this.especificacaoDataTemplate}
            />
            <Column field="aplicacao_recurso" header="Aplicação" />
            <Column field="acao_associacao.nome" header="Tipo de ação" />
            <Column
              field="valor_total"
              header="Valor"
              body={this.valorTotalTemplate}
              style={{ textAlign: 'right' }}
            />
          </DataTable>
        ) : (
          <div className="row container-404">
            <div className="col-lg-6 col-sm-12 mb-lg-0 align-self-center">
              <p className="texto-404">
                A sua escola ainda não possui despesas cadastradas, clique no
                botão "Cadastrar despesa" para começar.
              </p>
            </div>

            <div className="col-lg-6 col-sm-12">
              <img src={Img404} alt="" className="img-fluid" />
            </div>
          </div>
        )}
      </div>
    )
  }
}
