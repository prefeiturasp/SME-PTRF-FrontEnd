import React, {useContext, useEffect} from "react";
import {useGetMandatoVigente} from "../hooks/useGetMandatoVigente";
import {MandatoInfo} from "../components/MandatoInfo";
import Loading from "../../../../utils/Loading";
import {CargosDaComposicaoList} from "../components/CargosDaComposicaoList";
import {MembrosDaAssociacaoContext} from "../context/MembrosDaAssociacao";
import {Paginacao} from "../components/Paginacao";
import {ComposicaoInfo} from "../components/ComposicaoInfo";

export const PaginaMandatoVigente = () => {

    const {setComposicaoUuid, composicaoUuid, currentPage, reiniciaEstadosControleComposicoes} = useContext(MembrosDaAssociacaoContext)

    // Reinicia os estados de controle
    useEffect(() => {
        reiniciaEstadosControleComposicoes()
    }, [reiniciaEstadosControleComposicoes]);

    const {isLoading, data, isError, count} = useGetMandatoVigente()

    // Controla a exibição das Composições do componente ComposicaoInfo
    useEffect(() => {
        let indice = currentPage-1
        if (data && data.composicoes && data.composicoes.length > 0 && data.composicoes.length >= currentPage) {
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
            <div className="d-flex bd-highlight align-items-end mt-2">
                <MandatoInfo/>
                {composicaoUuid &&
                    <ComposicaoInfo/>
                }
            </div>
            <Paginacao
                count={count}
            />
            {composicaoUuid &&
                <CargosDaComposicaoList
                    escopo='mandato-vigente'
                />
            }
        </>
    )
}