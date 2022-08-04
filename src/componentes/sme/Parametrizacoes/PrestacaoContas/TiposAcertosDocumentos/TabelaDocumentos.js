import React, {useEffect, useState}from "react";
import {getTabelaCategoria} from "../../../../../services/sme/Parametrizacoes.service";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'


export const TabelaDocumentos = ({todosDocumentos: todosDocumentos, rowsPerPage, lancamentosTemplate}) => {
    const [categoriaTabela, setCategoriaTabela] = useState([]);

    const ativoTemplate = (rowData) => {
        return rowData.ativo ? "Sim" : "Não";
    }

    useEffect(() => {
        async function carregaTabelaCategoria() {
            let resp = await getTabelaCategoria()
            setCategoriaTabela(resp.categorias)
        }
        carregaTabelaCategoria();
    }, []);

    const categoriaTemplate = (rowData) => {
        if (categoriaTabela.length > 0){
            let categoria = categoriaTabela.find(categoria => categoria.id === rowData.categoria)
            return categoria ? categoria.nome : ''
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
                style={{width: '15%'}}
                field="documentos"
                header="Documentos relacionados"
                className="text-center"
                body={ativoTemplate}/>
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
                body={lancamentosTemplate}
            />
        </DataTable>
    )
};