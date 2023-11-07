import React, {useContext, useEffect} from "react";
import {SelectMandatosAnteriores} from "../components/SelectMandatosAnteriores";
import {useGetMandatoAnterior} from "../hooks/useGetMandatoAnterior";
import {MembrosDaAssociacaoContext} from "../context/MembrosDaAssociacao";
import {CargosDaComposicaoList} from "../components/CargosDaComposicaoList";
import Loading from "../../../../utils/Loading";
import {ComposicaoInfo} from "../components/ComposicaoInfo";
import {Paginacao} from "../components/Paginacao";
import {useGetMandatosAnteriores} from "../hooks/useGetMandatosAnteriores";

export const PaginaMandatosAnteriores = () => {

    const {setComposicaoUuid, composicaoUuid, currentPage, setMandatoUuid, reiniciaEstadosControleComposicoes} = useContext(MembrosDaAssociacaoContext)
    const {data_mandatos_anteriores, isLoading_mandatos_anteriores} = useGetMandatosAnteriores()
    const {isLoading, data, count, isError} = useGetMandatoAnterior()

    // Reinicia os estados de controle
    useEffect(() => {
        reiniciaEstadosControleComposicoes()
    }, [reiniciaEstadosControleComposicoes]);

    // Seta o uuid do primeiro mandato anterior
    useEffect(()=>{
        if (data_mandatos_anteriores && data_mandatos_anteriores.length > 0){
            setMandatoUuid(data_mandatos_anteriores[0].uuid)
        }
    }, [data_mandatos_anteriores, setMandatoUuid])

    // Controla a exibição das Composições do componente ComposicaoInfo
    useEffect(() => {
        let indice = currentPage - 1
        if (data && data.composicoes && data.composicoes.length > 0 && data.composicoes.length >= currentPage) {
            let composicao_uuid = data.composicoes[indice].uuid
            setComposicaoUuid(composicao_uuid)
        }
    }, [data, setComposicaoUuid, currentPage]);

    if ((data && !data.uuid) || isError){
        return (
            <p className='mt-3'><strong>Não existem mandatos anteriores</strong></p>
        )
    }

    return (
        <>
            {isLoading || isLoading_mandatos_anteriores ? (
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            ):
                <>
                    <p className='mb-0 mt-4 pl-2 fonte-16'><strong>Composição</strong></p>
                    <div className="d-flex align-items-end mt-0">
                        <SelectMandatosAnteriores/>
                        {composicaoUuid && data && data.composicoes.length > 0 &&
                            <ComposicaoInfo/>
                        }
                    </div>
                    {composicaoUuid && data && data.composicoes.length > 0 ? (
                            <>
                                <Paginacao
                                    count={count}
                                />
                                <CargosDaComposicaoList
                                    escopo='mandatos-anteriores'
                                />
                            </>
                        ) :
                        <div className='p-2 pt-3'>
                            <p><strong>Não foram encontradas composições. Selecione outro período</strong></p>
                        </div>
                    }
                </>
            }
        </>
    )
}