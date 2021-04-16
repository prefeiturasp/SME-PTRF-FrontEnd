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
        return (
            <button onClick={()=>onClickColumn(rowData, column)}><span>{valorFormatado}</span></button>
        )
    };

    const onClickColumn=(rowData, column) =>{
        console.log("onClickColumn rowData: ", rowData)
        console.log("onClickColumn rowData[column.field] ", rowData[column.field])
        console.log("onClickColumn column.field: ", column.field)
    }

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
                            //onRowClick={e => propriedades.trataRepasse(e.data, propriedades.setFieldValue)}

                        >
                            <Column field='conta_associacao.nome' header='Conta'/>
                            <Column field='acao_associacao.nome' header='Ação'/>
                        
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
                                header='Valor Livre'
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