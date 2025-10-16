import {useContext} from "react";
import {Paginator} from 'primereact/paginator';
import { useGet } from "./hooks/useGet";
import { ObjetivosPaaContext } from "./context/index";


export const Paginacao = () => {
    const {isLoading, data, total} = useGet()
    const {count} = data
    const {setCurrentPage, firstPage,setFirstPage, rowsPerPage} = useContext(ObjetivosPaaContext)


    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {!isLoading && total ? (
                <Paginator
                    first={firstPage}
                    rows={rowsPerPage}
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