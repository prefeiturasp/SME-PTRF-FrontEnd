import React, {memo} from "react";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

const AssociacoesNaoRegularizadas = ({listaAssociacoesNaoRegularizadas, nomeTemplate, motivoTemplate, acoesTemplate}) => {
    return (
        <>
            <div className='row'>
                <div className='col-12 mt-3 mb-3 pt-4 border-top'>
                    <h5 className='mb-3'>Associações não regularizadas</h5>

                    <DataTable
                        value={listaAssociacoesNaoRegularizadas}
                        paginator
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        rows={10}
                        rowsPerPageOptions={[10,20,50]}
                        className='tabela-associacoes-nao-regularizadas'
                    >
                        <Column
                            field="nome"
                            header="Associações não regularizadas"
                            body={nomeTemplate}
                            style={{width:'45%'}}
                        />
                        <Column
                            field="motivo_nao_regularidade"
                            header="Motivo"
                            body={motivoTemplate}
                            style={{width:'45%'}}
                        />
                        <Column
                            field="acoes"
                            header="Ações"
                            body={acoesTemplate}
                            style={{width:'10%'}}
                        />
                    </DataTable>

                </div>
            </div>


        </>
    )
};

export default memo(AssociacoesNaoRegularizadas)

