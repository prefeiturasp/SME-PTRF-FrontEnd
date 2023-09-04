import React, {useContext, useEffect} from "react";
import {useGetMandatoVigente} from "../hooks/useGetMandatoVigente";
import {MandatoInfo} from "../components/MandatoInfo";
import Loading from "../../../../utils/Loading";
import {CargosDaComposicaoList} from "../components/CargosDaComposicaoList";
import {MembrosDaAssociacaoContext} from "../context/MembrosDaAssociacao";
import {Paginacao} from "../components/Paginacao";
import {ComposicaoInfo} from "../components/ComposicaoInfo";

export const PaginaMandatoVigente = () => {

    const {isLoading, data, isError} = useGetMandatoVigente()
    const {setComposicaoUuid, composicaoUuid, currentPage} = useContext(MembrosDaAssociacaoContext)

    useEffect(() => {
        let indice = currentPage-1
        if (data && data.composicoes && data.composicoes.length > 0) {
            let composicao_uuid = data.composicoes[indice].uuid
            setComposicaoUuid(composicao_uuid)
        }
    }, [data, setComposicaoUuid, currentPage]);

    if (isLoading) {
        return (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        );
    }

    if ((data && !data.uuid) || isError){
        return (
            <p className='mt-3'><strong>Não existe mandato vigente</strong></p>
        )
    }

    return (
        <>
            <div className="d-flex bd-highlight mt-2">
                <MandatoInfo/>
                {composicaoUuid && currentPage !== 1 &&
                    <ComposicaoInfo/>
                }
            </div>
            <Paginacao/>
            {composicaoUuid &&
                <CargosDaComposicaoList/>
            }
        </>
    )
}