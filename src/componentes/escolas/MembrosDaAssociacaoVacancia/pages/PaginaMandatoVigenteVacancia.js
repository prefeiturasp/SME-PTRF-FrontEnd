import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetMandatoVigente } from "../hooks/useGetMandatoVigente";
import { MandatoInfo } from "../components/MandatoInfo";
import Loading from "../../../../utils/Loading";
import { useGetComposicaoVigenteVacancia } from "../hooks/useGetComposicaoVigenteVacancia";
import { useGetDatasDeAlteracaoDaComposicaoVacancia } from "../hooks/useGetDatasDeAlteracaoDaComposicaoVacancia";
import { CargosDaComposicaoListVacancia } from "../components/CargosDaComposicaoListVacancia";
import { PaginacaoVacancia } from "../components/PaginacaoVacancia";
import { MarcoInfoVacancia } from "../components/MarcoInfoVacancia";


export const PaginaMandatoVigenteVacancia = () => {
    const {state} = useLocation();
    const marcoParaRestaurar = state?.marcoSelecionado;

    const {isLoading: isLoadingMandato, data: mandato, isError: isErrorMandato} = useGetMandatoVigente()
    const {isLoading: isLoadingComposicao, data: composicao} = useGetComposicaoVigenteVacancia(mandato?.uuid)
    const {data: marcos} = useGetDatasDeAlteracaoDaComposicaoVacancia(composicao?.uuid)

    const [currentPage, setCurrentPage] = useState(1)
    const [firstPage, setFirstPage] = useState(0)

    // Ao voltar de uma edição, tenta restaurar o marco que estava sendo visualizado;
    // se ele não existir mais na composição atualizada, mantém o mais recente (padrão).
    useEffect(() => {
        if (!marcoParaRestaurar || !marcos?.length) return;
        const indice = [...marcos].reverse().indexOf(marcoParaRestaurar)
        if (indice !== -1) {
            setCurrentPage(indice + 1)
            setFirstPage(indice)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marcos?.length]);

    if (isLoadingMandato || (mandato?.uuid && isLoadingComposicao)) {
        return (
            <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />
        );
    }

    if (!mandato?.uuid || isErrorMandato) {
        return (<p className='mt-3'><strong>Não existe mandato vigente</strong></p>)
    }
    // mais recente primeiro - avançar na paginação mostra marcos mais antigos
    const marcosDoMaisRecenteAoMaisAntigo = marcos?.length ? [...marcos].reverse() : []
    const dataMarcoSelecionado = marcosDoMaisRecenteAoMaisAntigo[currentPage - 1]

    const onPageChange = (page, first) => {
        setCurrentPage(page)
        setFirstPage(first)
    }

    return (
        <span className="PaginaMandatoVigenteVacancia">
            <div className="d-flex bd-highlight align-items-end mt-2">
                <MandatoInfo/>
                {dataMarcoSelecionado &&
                    <MarcoInfoVacancia
                        dataInicio={dataMarcoSelecionado}
                        dataFim={mandato.data_final}/>
                }
            </div>
            {marcosDoMaisRecenteAoMaisAntigo.length > 0 &&
                <PaginacaoVacancia
                    count={marcosDoMaisRecenteAoMaisAntigo.length}
                    firstPage={firstPage}
                    onPageChange={onPageChange}
                />
            }
            {composicao?.uuid &&
                <CargosDaComposicaoListVacancia
                    composicaoUuid={composicao.uuid}
                    data={dataMarcoSelecionado}/>
            }
        </span>
    )
}