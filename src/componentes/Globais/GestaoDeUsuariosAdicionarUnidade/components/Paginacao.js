import React, {useContext} from "react";
import { GestaoDeUsuariosAdicionarUnidadeContext } from "../context/GestaoUsuariosAdicionarUnidadeProvider";
import {Paginator} from "primereact/paginator";

export const Paginacao = ({count}) => {
    const {setCurrentPage, firstPage, setFirstPage} = useContext(GestaoDeUsuariosAdicionarUnidadeContext)

    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return(
        <div data-qa='paginacao-composicao'>
            <Paginator
                first={firstPage}
                rows={10}
                totalRecords={count}
                template="PrevPageLink PageLinks NextPageLink"
                onPageChange={onPageChange}
            />
        </div>
    )
}