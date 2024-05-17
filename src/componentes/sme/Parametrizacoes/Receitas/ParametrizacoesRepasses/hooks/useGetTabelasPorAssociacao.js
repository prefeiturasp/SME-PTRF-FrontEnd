import { getTabelasRepassePorAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";
import { useContext } from "react";
import { RepassesContext } from "../context/Repasse";


export const useGetTabelasPorAssociacao = () => {
    const {stateFormModal} = useContext(RepassesContext)

    const { isLoading, isError, data, refetch } = useQuery(
        ['tabelas-repasse-associacao-list'],
        ()=> getTabelasRepassePorAssociacao(stateFormModal.associacao),
        {
            keepPreviousData: true,
            enabled: !!stateFormModal.associacao
        }
    );

    return {isLoading, isError, data, refetch}
}