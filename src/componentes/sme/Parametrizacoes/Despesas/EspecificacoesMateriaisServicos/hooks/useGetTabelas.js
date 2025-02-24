/** TODO: Ajustar para tipo de custeio */
import { getTabelasEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";


export const useGetTabelas = () => {

    const { isLoading, isError, data, refetch } = useQuery(
        ['tabelas-especificacoes-materiais-servicos-list'],
        ()=> getTabelasEspecificacoesMateriaisServicos(),
        {
            keepPreviousData: true,
        }
    );

    return {isLoading, isError, data, refetch}
}
