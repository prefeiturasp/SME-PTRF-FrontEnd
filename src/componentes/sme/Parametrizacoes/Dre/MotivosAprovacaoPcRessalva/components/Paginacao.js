import React from "react";
import {Paginator} from 'primereact/paginator';
import { useGetMotivosAprovacaoPcRessalva } from "../hooks/useGetMotivosAprovacaoPcRessalva";
import { useMotivosAprovacaoPcRessalvaContext } from "../hooks/useMotivoAprovacaoComRessalvaContext";


export const Paginacao = () => {
    const {isLoading, data, totalMotivosAprovacaoPcRessalva} = useGetMotivosAprovacaoPcRessalva()
    const {count} = data
    const { filter, setFilter } = useMotivosAprovacaoPcRessalvaContext();

    const firstPage = (filter.page - 1) * filter.page_size;

    const onPageChange = (event) => {
        const currentPage = event.page + 1;
        
        setFilter({
            ...filter,
            page: currentPage,
        })
    };

    return (
        <>
            {!isLoading && totalMotivosAprovacaoPcRessalva ? (
                    <Paginator
                        first={firstPage}
                        rows={filter.page_size}
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