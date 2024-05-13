import { getTabelasRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";


export const useGetTabelasRepasse = () => {

    const { isLoading, isError, data, refetch } = useQuery(
        ['tabelas-repasse-list'],
        ()=> getTabelasRepasse(),
        {
            keepPreviousData: true,
        }
    );

    return {isLoading, isError, data, refetch}
}