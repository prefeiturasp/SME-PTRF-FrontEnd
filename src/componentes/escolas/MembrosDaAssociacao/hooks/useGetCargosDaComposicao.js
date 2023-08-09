import {getCargosDaComposicao} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";
import {useContext} from "react";
import {MembrosDaAssociacaoContext} from "../context/MembrosDaAssociacao";

export const useGetCargosDaComposicao = () => {

    const {composicaoUuid} = useContext(MembrosDaAssociacaoContext)

    const { isLoading, isError, data, error, refetch } = useQuery(
        ['cargos-da-composicao', composicaoUuid],
        ()=> getCargosDaComposicao(composicaoUuid),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    return {isLoading, isError, data, error, refetch}


}