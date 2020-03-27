import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Row, Col } from 'reactstrap'
//import { getModeloAtesteLookup } from "../../../service/ModeloAteste.service";
import { redirect } from '../../../utils/redirect.js'

export class ListaDeDespesas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rateiosDespesas: []
    }
  }

  getListaRateiosDespesas() {
    const despesas = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          uuid: 'ed678d57-0fb1-40bc-b854-812ee929f94f',
          despesa: 'cc204c00-c9dd-4f22-8ce6-f7377d289c38',
          numero_documento: '634767',
          status_despesa: 'COMPLETO',
          especificacao_material_servico: {
            id: 1,
            descricao: 'Material Elétrico',
            aplicacao_recurso: 'CUSTEIO',
            tipo_custeio: 1
          },
          data_documento: '2020-03-10',
          aplicacao_recurso: 'CUSTEIO',
          acao_associacao: {
            uuid: '721dcff8-293e-4d7d-bb44-6203a62080de',
            nome: 'PTRF'
          },
          valor_total: 11000.5
        }
      ]
    }
    return despesas
  }
  buscaRateiosDespesas = async () => {
    const rateiosDespesas = await this.getListaRateiosDespesas()
    this.setState({ rateiosDespesas })
  }

  componentDidMount() {
    this.buscaRateiosDespesas()
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
            <span className="float-right">
              <Button
                icon="pi pi-file"
                label="Cadastrar despesa"
                style={{ marginBottom: '.80em' }}
                className="btn-coad-background-outline"
                onClick={event => {
                  redirect(`#/modelo-ateste/`)
                }}
              />
            </span>
          </Col>
        </Row>
        <DataTable
          value={rateiosDespesas}
          className="datatable-strapd-coad"
          paginator={rateiosDespesas.length > rowsPerPage}
          rows={rowsPerPage}
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
          <Column field="numero_documento" header="Número do documento" />
          <Column
            field="especificacao_material_servico"
            header="Especificação do material ou serviço"
            style={{ width: '10em' }}
          />
        </DataTable>
      </div>
    )
  }
}
