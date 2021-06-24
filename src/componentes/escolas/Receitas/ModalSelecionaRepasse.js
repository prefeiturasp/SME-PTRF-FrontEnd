import React, {Fragment} from "react";
import {Button, Modal} from "react-bootstrap";
import "../../Globais/ModalBootstrap/modal-bootstrap.scss"
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';


export const ModalSelecionaRepasse = (propriedades) => {

    const rowsPerPage = 7;

    const valorTemplate = (rowData, column) => {
        const valorFormatado = rowData[column.field]
            ? Number(rowData[column.field]).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '';

        if (rowData[column.field] > 0) {
            return (
                <button className='btn-valores-repasses' onClick={() => propriedades.trataRepasse(rowData, propriedades.setFieldValue, valorFormatado, column.field)}>
                    <span>{valorFormatado}</span>
                </button>
            )
        } else {
            return (
                <span className='sem-selecao'>{valorFormatado}</span>
            )
        }
    };

    return (
        <Fragment>
            <Modal centered show={propriedades.show}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.repasses.length > 0 ? (
                            <DataTable
                                value={propriedades.repasses}
                                className="mt-3 datatable-footer-coad"
                                paginator={propriedades.repasses.length > rowsPerPage}
                                rows={rowsPerPage}
                                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                                autoLayout={true}
                                selectionMode="single"
                            >
                                <Column className='sem-selecao' field='conta_associacao.nome' header='Conta'/>
                                <Column className='sem-selecao' field='acao_associacao.nome' header='Ação'/>

                                <Column
                                    field='valor_capital'
                                    header='Valor Capital'
                                    body={valorTemplate}/>

                                <Column
                                    field='valor_custeio'
                                    header='Valor Custeio'
                                    body={valorTemplate}/>

                                <Column
                                    field='valor_livre'
                                    header='Valor Livre Aplicação'
                                    body={valorTemplate}/>
                            </DataTable>)
                        : <> <p>No momento não existem repasses pendentes para a associação.</p> </>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-success" onClick={propriedades.cancelar}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};