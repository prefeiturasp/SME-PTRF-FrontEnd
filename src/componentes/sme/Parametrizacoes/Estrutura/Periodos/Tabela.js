import {memo, useCallback, useContext} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import moment from "moment";
import { EditIconButton, IconButton, VisualizarIconButton} from "../../../../Globais/UI/Button";
import { RecursosContext } from "../../componentes/AbasPorRecurso/context/Recursos";

const Tabela = ({
    rowsPerPage, 
    data,
    handleOpenModalForm,
    handleOpenCreateModal,
    tem_permissao_edicao_painel_parametrizacoes
}) =>{
    const dataTemplate = useCallback((rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : ''}
            </div>
        )
    }, []);

    const { selectedRecurso, setSelectedRecurso } = useContext(RecursosContext);

    const acoesTemplate = (rowData) => {
        return (
            rowData.editavel ? (
                <EditIconButton
                    onClick={() => handleOpenModalForm(rowData)}
                />
            ) : (
                <VisualizarIconButton
                    onClick={() => handleOpenModalForm(rowData)}
                />
            )
        )
    }

    return(
        <>
        <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">Confira abaixo os prazos de repasse e execução do {selectedRecurso?.nome_exibicao}.</p>
            </div>

            <IconButton
                icon="faPlus"
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label="Adicionar período"
                onClick={() => handleOpenCreateModal(selectedRecurso)}
                variant="success"
                disabled={!tem_permissao_edicao_painel_parametrizacoes}
            />
        </div>
        <DataTable  
            value={data}
            rows={rowsPerPage}
            paginator={data.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            id={'tabela-periodos'}
        >
            <Column field="referencia" header="Referência"/>
            <Column
                field="data_prevista_repasse"
                header="Data prevista do repasse"
                body={dataTemplate}
            />
            <Column
                field="data_inicio_realizacao_despesas"
                header="Início realização de despesas"
                body={dataTemplate}
            />
            <Column
                field="data_fim_realizacao_despesas"
                header="Fim realização de despesas"
                body={dataTemplate}
            />
            <Column
                field="data_inicio_prestacao_contas"
                header="Início prestação de contas"
                body={dataTemplate}
            />
            <Column
                field="data_fim_prestacao_contas"
                header="Fim prestação de contas"
                body={dataTemplate}
            />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
        </>

    );
};

export default memo(Tabela)