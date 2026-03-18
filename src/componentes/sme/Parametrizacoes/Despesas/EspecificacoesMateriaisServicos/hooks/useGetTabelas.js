/** TODO: Ajustar para tipo de custeio */
import { getTabelasEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";


export const useGetTabelas = () => {

    const { isFetching, isError, data, refetch } = useQuery({
        queryKey: ['tabelas-especificacoes-materiais-servicos-list'],
        queryFn: ()=> getTabelasEspecificacoesMateriaisServicos(),
        keepPreviousData: true,
    });

    return {isLoading: isFetching, isError, data, refetch}
}
