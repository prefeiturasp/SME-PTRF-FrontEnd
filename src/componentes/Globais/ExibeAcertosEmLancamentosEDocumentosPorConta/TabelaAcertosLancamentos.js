import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {MsgImgCentralizada} from "../Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg";

export const TabelaAcertosLancamentos = ({lancamentosAjustes, setExpandedRowsLancamentos, expandedRowsLancamentos, rowExpansionTemplateLancamentos, rowsPerPageAcertosLancamentos, dataTemplate, numeroDocumentoTemplate, valor_template}) => {
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
                    <Column expander style={{width: '3em', borderLeft: 'none'}}/>
                </DataTable>
            ):
                <MsgImgCentralizada
                    texto="Não existem ajustes para serem exibidos"
                    img={Img404}
                />
            }
        </>
    )
}