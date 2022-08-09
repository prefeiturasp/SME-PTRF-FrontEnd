import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import useTagInformacaoTemplate 
from "../../../../../SME-PTRF-FrontEnd/src/hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useTagInformacaoTemplate";
import Dropdown from "react-bootstrap/Dropdown";

export const TabelaAcertosLancamentos = ({lancamentosAjustes, setExpandedRowsLancamentos, expandedRowsLancamentos, rowExpansionTemplateLancamentos, rowsPerPageAcertosLancamentos, dataTemplate, numeroDocumentoTemplate, valor_template}) => {
    const tagJustificativa = useTagInformacaoTemplate()

    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={rowData.selecionado}
                    type="checkbox"
                    value=""
                    onChange={(e) => {}}
                    name="checkLancamentoAjuste"
                    id="checkLancamentoAjuste"
                    disabled={false}
                />
            </div>
        )
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle">
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" className="p-0">
                            <input
                                checked={false}
                                type="checkbox"
                                value=""
                                onChange={(e) => e}
                                name="checkHeader"
                                id="checkHeader"
                                disabled={false}
                            />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => {}}>Selecionar todos
                                corretos</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => {}}>Selecionar todos não
                                conferidos</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => {}}>Desmarcar todos</Dropdown.Item>
                        </Dropdown.Menu>

                    </Dropdown>
            </div>
        )
    }

    return(
        <>
            {lancamentosAjustes && lancamentosAjustes.length > 0 ? (
                <DataTable
                    value={lancamentosAjustes}
                    expandedRows={expandedRowsLancamentos}
                    onRowToggle={(e) => setExpandedRowsLancamentos(e.data)}
                    rowExpansionTemplate={rowExpansionTemplateLancamentos}
                    paginator={lancamentosAjustes.length > rowsPerPageAcertosLancamentos}
                    rows={rowsPerPageAcertosLancamentos}
                    paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                    stripedRows
                >
                    <Column 
                        header='Ver Acertos'
                        expander 
                        style={{width: '4%', borderLeft: 'none'}}/>
                    <Column
                        field='data'
                        header='Data'
                        body={dataTemplate}
                        className="align-middle text-left borda-coluna"
                    />
                    <Column field='tipo_transacao' header='Tipo de lançamento' className="align-middle text-left borda-coluna"/>
                    <Column
                        field='numero_documento'
                        header='N.º do documento'
                        body={numeroDocumentoTemplate}
                        className="align-middle text-left borda-coluna"
                    />
                    <Column field='descricao' header='Descrição' className="align-middle text-left borda-coluna"/>
                    <Column
                        field='valor_transacao_total'
                        header='Valor (R$)'
                        body={valor_template}
                        className="align-middle text-left borda-coluna"
                    />
                    <Column 
                        field='status_realizacao'
                        header='Status'
                        className="align-middle text-left borda-coluna"
                        body={tagJustificativa}
                        style={{width: '12%'}}/>
                    <Column
                        header={selecionarHeader()}
                        body={selecionarTemplate}
                        style={{width: '3rem', borderLeft: 'none'}}
                    />
                </DataTable>
            ):
                <p className='text-center fonte-18 mt-4'><strong>Não existem ajustes para serem exibidos</strong></p>
            }
        </>
    )
}