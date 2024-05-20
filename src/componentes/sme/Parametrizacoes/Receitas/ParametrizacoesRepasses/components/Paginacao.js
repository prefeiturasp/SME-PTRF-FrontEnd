import React, {useContext} from "react";
import {Paginator} from 'primereact/paginator';
import { useGetRepasses } from "../hooks/useGetRepasses";
import { RepassesContext } from "../context/Repasse";


export const Paginacao = () => {
    const {isLoading, data} = useGetRepasses()
    const {count} = data
    const {setCurrentPage, firstPage,setFirstPage} = useContext(RepassesContext)


    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {!isLoading && data.results && data.results.length > 0 ? (
                    <Paginator
                        first={firstPage}
                        rows={20}
                        totalRecords={count}
                        template="PrevPageLink PageLinks NextPageLink"
                        onPageChange={onPageChange}
                    />
                ) :
                null
            }
        </>
    )

}