import React, {useContext, useState} from "react";
import {Paginator} from 'primereact/paginator';
import {GestaoDeUsuariosListContext} from "../context/GestaoDeUsuariosListProvider";
export const Paginacao = () => {
    const {count, setCurrentPage} = useContext(GestaoDeUsuariosListContext);
    const [first, setFirst] = useState(0);
    const onPageChange = (event) => {
        setCurrentPage(event.page+1)
        setFirst(event.first)
    };
    return (
        <Paginator
            first={first}
            rows={10}
            totalRecords={count}
            template="PrevPageLink PageLinks NextPageLink"
            onPageChange={onPageChange}
        />
    )
}