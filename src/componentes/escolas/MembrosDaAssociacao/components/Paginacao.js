import React, {useContext} from "react";
import {useGetMandatoVigente} from "../hooks/useGetMandatoVigente";
import {MembrosDaAssociacaoContext} from "../context/MembrosDaAssociacao";
import {Paginator} from "primereact/paginator";

export const Paginacao = () => {
    const {isLoading, count} = useGetMandatoVigente()
    const {setCurrentPage, firstPage, setFirstPage} = useContext(MembrosDaAssociacaoContext)

    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return(
        <>
            {!isLoading &&
                <div data-qa='paginacao-composicao'>
                    <Paginator
                        first={firstPage}
                        rows={1}
                        totalRecords={count}
                        template="PrevPageLink NextPageLink"
                        onPageChange={onPageChange}
                        className='paginacao-composicoes'
                        style={{padding: "0 0 15px 15px"}}
                    />
                </div>

            }
        </>
    )
}