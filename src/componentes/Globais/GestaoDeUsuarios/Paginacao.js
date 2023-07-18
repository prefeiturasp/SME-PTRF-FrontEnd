import React, {useContext, useState} from "react";
import {Paginator} from 'primereact/paginator';
import {GestaoDeUsuariosContext} from "./context/GestaoDeUsuariosProvider";
export const Paginacao = () => {
    const {count, setCurrentPage} = useContext(GestaoDeUsuariosContext);
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