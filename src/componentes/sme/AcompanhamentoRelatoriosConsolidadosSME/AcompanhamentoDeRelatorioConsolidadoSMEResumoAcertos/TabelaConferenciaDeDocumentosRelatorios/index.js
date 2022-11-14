import React from 'react';
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";

import './styles.scss'
import { getArquivosDeCargaFiltros } from '../../../../../services/sme/Parametrizacoes.service';

export const TabelaConferenciaDeDocumentosRelatorios = ({}) => {
    const rowsPerPage = 5

    return (
        // #LINIKER Precisamos trazer as informações do documentos para passar na tabela e trazer até aqui.
        <>
            <h5 className="mb-4 mt-4"><strong>Acertos nos documentos</strong></h5>
            <DataTable value={''}
                        paginator={
                            0 > rowsPerPage
                        }
                        rows={rowsPerPage}
                        rowClassName={''}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        stripedRows
                        className=""
                        autoLayout={true}>
                        <Column
                            header={''}
                            className="align-middle text-left borda-coluna"
                            body={''}
                            style={
                                {
                                    borderRight: 'none',
                                    width: '1%'
                                }
                            }/>
                        <Column header={'Nome do Documento'}
                            field='nome'
                            className="align-middle text-left borda-coluna"
                            body={''}
                            style={
                                {
                                    borderLeft: 'none',
                                    width: '200px'
                                }
                            }/>
                    </DataTable>
        </>
                    // #LINIKER precisa do row expasion
        )
}