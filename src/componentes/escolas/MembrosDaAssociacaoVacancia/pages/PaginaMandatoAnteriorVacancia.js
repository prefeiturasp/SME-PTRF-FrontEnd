import React, { useEffect, useState } from "react";
import { useGetMandatosAnterioresVacancia } from "../hooks/useGetMandatosAnterioresVacancia";
import { useGetComposicaoVigenteVacancia } from "../hooks/useGetComposicaoVigenteVacancia";
import { useGetDatasDeAlteracaoDaComposicaoVacancia } from "../hooks/useGetDatasDeAlteracaoDaComposicaoVacancia";
import { MarcoInfoVacancia } from "../components/MarcoInfoVacancia";
import { SelectMandatoAnteriorVacancia } from "../components/SelectMandatoAnteriorVacancia";
import { CargosDaComposicaoListVacancia } from "../components/CargosDaComposicaoListVacancia";
import { PaginacaoVacancia } from "../components/PaginacaoVacancia";
import Loading from "../../../../utils/Loading";


export const PaginaMandatoAnteriorVacancia = () => {
    const { isLoading: isLoadingMandatos, data: mandatos } = useGetMandatosAnterioresVacancia();
    const [mandatoUuidSelecionado, setMandatoUuidSelecionado] = useState(null);

    // seleciona o mandato anterior mais recente assim que a lista chega
    useEffect(() => {
        if (mandatos?.length && !mandatoUuidSelecionado) {
            setMandatoUuidSelecionado(mandatos[0].uuid);
        }
    }, [mandatos, mandatoUuidSelecionado]);

    const mandatoSelecionado = mandatos?.find((mandato) => mandato.uuid === mandatoUuidSelecionado);

    const { isLoading: isLoadingComposicao, data: composicao } = useGetComposicaoVigenteVacancia(mandatoSelecionado?.uuid);
    const { data: marcos } = useGetDatasDeAlteracaoDaComposicaoVacancia(composicao?.uuid);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(0);

    const onChangeMandato = (uuid) => {
        setMandatoUuidSelecionado(uuid);
        setCurrentPage(1);
        setFirstPage(0);
    };

    if (isLoadingMandatos) {
        return <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />;
    }

    if (!mandatos?.length) {
        return (<p className='mt-3'><strong>Não existem mandatos anteriores</strong></p>);
    }

    // mais recente primeiro - avançar na paginação mostra marcos mais antigos (mesmo padrão do vigente)
    const marcosDoMaisRecenteAoMaisAntigo = marcos?.length ? [...marcos].reverse() : [];
    const dataMarcoSelecionado = marcosDoMaisRecenteAoMaisAntigo[currentPage - 1];

    const onPageChange = (page, first) => {
        setCurrentPage(page);
        setFirstPage(first);
    };

    return (
        <span className="PaginaMandatoAnteriorVacancia">
            <div className="d-flex bd-highlight align-items-end mt-2">
                <SelectMandatoAnteriorVacancia
                    mandatos={mandatos}
                    mandatoUuid={mandatoUuidSelecionado}
                    onChangeMandato={onChangeMandato}
                />
                {dataMarcoSelecionado && mandatoSelecionado &&
                    <MarcoInfoVacancia
                        dataInicio={dataMarcoSelecionado}
                        dataFim={mandatoSelecionado.data_final} />
                }
            </div>
            {!isLoadingComposicao && marcosDoMaisRecenteAoMaisAntigo.length > 0 &&
                <PaginacaoVacancia
                    count={marcosDoMaisRecenteAoMaisAntigo.length}
                    firstPage={firstPage}
                    onPageChange={onPageChange}
                />
            }
            {composicao?.uuid &&
                <CargosDaComposicaoListVacancia
                    composicaoUuid={composicao.uuid}
                    data={dataMarcoSelecionado}
                />
            }
        </span>
    );
};