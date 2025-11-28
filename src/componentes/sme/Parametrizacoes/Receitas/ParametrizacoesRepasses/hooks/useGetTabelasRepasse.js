import { getTabelasRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";


export const useGetTabelasRepasse = () => {

    const { status, isError, data, refetch } = useQuery({
        queryKey: ['tabelas-repasse-list'],
        queryFn: ()=> getTabelasRepasse(),
        keepPreviousData: true,
    });

    return {isLoading: status === 'loading', isError, data, refetch}
}