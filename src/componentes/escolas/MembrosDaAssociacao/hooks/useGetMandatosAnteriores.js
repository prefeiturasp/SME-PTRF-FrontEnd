import {getMandatosAnteriores} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";

export const useGetMandatosAnteriores = () => {
    const { isLoading, isError, data = {uuid: null, composicoes: [] }, error } = useQuery(
        ['mandatos-anteriores'],
        ()=> getMandatosAnteriores(),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    return {isLoading_mandatos_anteriores: isLoading, isError, data_mandatos_anteriores: data, error}
}