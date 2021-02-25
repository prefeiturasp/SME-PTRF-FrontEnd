import React, {memo, useState, useCallback, useRef, useEffect} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

const TabelaTransacoes = ({transacoes, conciliados, checkboxTransacoes, handleChangeCheckboxTransacoes, periodoFechado})=>{

    const [expandedRows, setExpandedRows] = useState(null);

    const conferidoTemplate = useCallback((rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={conciliados}
                    type="checkbox"
                    value={checkboxTransacoes}
                    onChange={(e)=>handleChangeCheckboxTransacoes(e, rowData.uuid)}
                    name="checkConferido"
                    id="checkConferido"
                    //disabled={periodoFechado}
                />
            </div>
        )
    }, [checkboxTransacoes, conciliados, handleChangeCheckboxTransacoes]);

    const rowExpansionTemplate = (data) => {
        console.log('EXPANDIR expandedRows ', expandedRows)
        console.log('EXPANDIR data ', data)
        return(
            <div>
                <p>Aquisokjfdaolsndvasldlçzsndklcv</p>
            </div>
        )
    };

    return(
        <div className="row mt-4">
            <div className="col-12">
                <p className="detalhe-das-prestacoes-titulo-lancamentos">Lançamentos {conciliados ? "conciliados" : "pendentes de conciliação"}</p>
                <div className="datatable-responsive-demo">
                    <DataTable
                        value={transacoes}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        dataKey="documento_mestre.uuid"
                        className='tabela-transacoes tabela-lancamentos-despesas p-datatable-responsive-demo'
                    >
                        <Column expander style={{ width: '3em', borderRight:'none' }} />
                        <Column field="data" header="Data" style={{borderLeft:'none' }}/>
                        <Column field="tipo_transacao" header="Tipo de lançamento"/>
                        <Column className='transacoes-numero-documento' field="numero_documento" header="N.º do documento"/>
                        <Column field="descricao" header="Descrição"/>
                        <Column field="valor_transacao_total" header="Valor (R$)"/>
                        <Column
                            field="conferido"
                            header="Demonstrado"
                            body={conferidoTemplate}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    )
};

export default memo(TabelaTransacoes)

