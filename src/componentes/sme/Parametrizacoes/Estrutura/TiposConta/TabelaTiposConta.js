import React, { memo } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAbasPorRecursoContext } from "../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { IconButton } from "../../../../Globais/UI/Button";

const TabelaTiposContas = ({rowsPerPage, listaDeTiposContas, acoesTemplate, handleOpenCreateModal, tem_permissao_edicao_painel_parametrizacoes })=>{
    const { selectedRecurso } = useAbasPorRecursoContext();

    return(
        <>
            <div className="d-flex justify-content-between align-items-end mb-3">
                <div>
                    <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                    <p className="m-0">Confira abaixo os tipos de conta do {selectedRecurso?.nome_exibicao}.</p>
                </div>
    
                <IconButton
                    icon="faPlus"
                    iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                    label="Adicionar tipo de conta"
                    onClick={() => handleOpenCreateModal(selectedRecurso)}
                    variant="success"
                    disabled={!tem_permissao_edicao_painel_parametrizacoes}
                />
            </div>
            <DataTable
                value={listaDeTiposContas}
                rows={rowsPerPage}
                paginator={listaDeTiposContas.length > rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            >
                <Column field="nome" header="Tipo de conta" />
                <Column
                    field="acoes"
                    header="Ações"
                    body={acoesTemplate}
                    style={{width:'100px'}}
                />
            </DataTable>
        </>
    );
};
export default memo(TabelaTiposContas)

