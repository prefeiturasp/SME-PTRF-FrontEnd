import React, {useState} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

const TabelaAcertosEmValoresReprogramados = ({saldosIniciasAjustes}) => {

    const [expandedRows, setExpandedRows] = useState(null);

    const formataValor = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return valor_formatado;
    }

    const rowExpansionTemplate =  (data) => {
        return (
            <div className="row mt-2">
                {data.novo_saldo_reprogramado_capital &&
                    <div className="col-lg-4">
                        <strong><p className="text-saldo-reprogramado">Saldo Reprogramado Capital</p></strong>
                        <p>{formataValor(data.novo_saldo_reprogramado_capital)}</p>  
                    </div>
                }

                {data.novo_saldo_reprogramado_custeio &&
                    <div className="col-lg-4">
                        <strong><p className="text-saldo-reprogramado">Saldo Reprogramado Custeio</p></strong>
                        <p>{formataValor(data.novo_saldo_reprogramado_custeio)}</p>
                    </div>
                }
                
                {data.novo_saldo_reprogramado_livre &&
                    <div className="col-lg-4">
                        <strong><p className="text-saldo-reprogramado">Saldo Reprogramado Livre</p></strong>
                        <p>{formataValor(data.novo_saldo_reprogramado_livre)}</p>
                    </div>
                }
            </div>
        )
    };

    return(
        <>
            {saldosIniciasAjustes && saldosIniciasAjustes.length > 0 ? (
                <DataTable
                    value={saldosIniciasAjustes}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    stripedRows
                    className='mt-3'
                >
                
                    <Column field='acao_associacao.nome' header='Ação' className="align-middle text-left borda-coluna"/>
                    <Column expander style={{width: '3em', borderLeft: 'none'}}/>
                </DataTable>
            ):
                <p className='text-center fonte-18 mt-4'><strong>Não existem ajustes para serem exibidos</strong></p>
            }
        </>
    )
}
export default TabelaAcertosEmValoresReprogramados;