import React, {useEffect, useState}from "react";
import {getTabelaDocumento} from "../../../../../services/sme/Parametrizacoes.service";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'


export const TabelaDocumentos = ({todosDocumentos: todosDocumentos, rowsPerPage, editDocumentosTemplate}) => {
    const [categoriaTabela, setCategoriaTabela] = useState([]);

    const ativoTemplate = (rowData) => {
        return rowData.ativo ? "Sim" : "Não";
    }

    useEffect(() => {
        async function carregaTabelaCategoria() {
            let resp = await getTabelaDocumento()
            setCategoriaTabela(resp.categorias)
        }
        carregaTabelaCategoria();
    }, []);

    const categoriaTemplate = (rowData) => {
        if (rowData){
            let categoria = categoriaTabela.find(categoria => categoria.id === rowData.categoria)
            return categoria ? categoria.nome : ''
        }
    }

    const documentoTemplate = (rowData) => {
        let listDocumentos = []
        if (rowData){
            rowData.tipos_documento_prestacao.map(element => {
                listDocumentos.push(element.nome)
            })
            return listDocumentos.map(item => <p style={{'textAlign': 'start'}} key={item}>{item}</p>)
        }
    }

    return(
        <DataTable
            value={todosDocumentos}
            paginator={todosDocumentos.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rows={rowsPerPage}
        >
            <Column field="nome" header="Nome do tipo"/>
            <Column 
                field="categoria"
                header="Categoria de acerto"
                body={categoriaTemplate}
            />
            <Column 
                style={{width: '25%'}}
                field="tipos_documento_prestacao"
                header="Documentos relacionados"
                className="text-center"
                body={documentoTemplate}/>
            <Column 
                style={{width: '15%'}}
                field="ativo"
                header="Ativo"
                className="text-center"
                body={ativoTemplate}/>
            <Column
                style={{width: '10%'}}
                field="acoes"
                header="Ações"
                className="text-center"
                body={editDocumentosTemplate}
            />
        </DataTable>
    )
};