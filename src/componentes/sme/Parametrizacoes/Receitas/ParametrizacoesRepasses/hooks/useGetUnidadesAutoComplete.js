import { getAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";
import { useContext } from "react";
import { RepassesContext } from "../context/Repasse";


export const useGetUnidadesAutoComplete = () => {
    const {showModalForm} = useContext(RepassesContext)

    const { isLoading, isError, data, refetch } = useQuery(
        ['unidades-autocomplete-list'],
        ()=> getAssociacoes(),
        {
            keepPreviousData: true,
            enabled: !!showModalForm
        }
    );

    return {isLoading, isError, data, refetch}
}