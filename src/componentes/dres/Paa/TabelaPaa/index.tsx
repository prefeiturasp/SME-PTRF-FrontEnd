import { Column } from 'primereact/column';
import { DataTable, DataTablePFSEvent } from 'primereact/datatable';
import type { ReactNode } from 'react';
import './scss/TabelaPaa.scss';
import type { IPaaItem, IPaaResponse } from '../../../../interface/dre/Paa/paa.interface';

interface TabelaPaaProps {
    listaPaa?: IPaaResponse;
    linhasPorPagina: number;
    unidadeEscolarTemplate: (row: IPaaItem) => ReactNode;
    acaoTemplatePdf: (row: IPaaItem) => ReactNode;
    aoMudarPagina: (event: DataTablePFSEvent) => void;
    paginaAtual: number;
}

export const TabelaPaa = ({
    listaPaa,
    linhasPorPagina,
    unidadeEscolarTemplate,
    acaoTemplatePdf,
    aoMudarPagina,
    paginaAtual,
}: TabelaPaaProps) => {
    return (
        <div className='tabela-paa-scroll'>
            <DataTable
                value={listaPaa?.results || []}
                lazy
                paginator
                scrollable
                rows={linhasPorPagina}
                totalRecords={listaPaa?.count || 0}
                first={(paginaAtual - 1) * linhasPorPagina}
                onPage={aoMudarPagina}
                paginatorTemplate='PrevPageLink PageLinks NextPageLink'
            >
                <Column
                    field='codigo_eol'
                    header='Código EOL'
                    body={(rowData: IPaaItem) => rowData?.unidade?.codigo_eol || '-'}
                    style={{ minWidth: '150px', maxWidth: '150px' }}
                />

                <Column
                    header='Unidade educacional'
                    body={unidadeEscolarTemplate}
                    style={{ minWidth: '400px' }}
                />

                <Column
                    header='Vigência do PAA'
                    body={(rowData: IPaaItem) => rowData?.periodo_paa?.referencia || '-'}
                    style={{ minWidth: '180px', maxWidth: '180px' }}
                />

                <Column
                    header='Status'
                    body={(rowData: IPaaItem) => rowData?.status_display || '-'}
                    style={{ minWidth: '180px', maxWidth: '180px' }}
                />

                <Column
                    header='Ações'
                    body={acaoTemplatePdf}
                    bodyClassName='d-flex justify-content-center'
                    style={{ minWidth: '100px', maxWidth: '100px' }}
                />
            </DataTable>
        </div>
    );
};
