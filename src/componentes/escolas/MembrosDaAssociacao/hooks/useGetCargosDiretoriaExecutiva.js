import {getCargosDaDiretoriaExecutiva} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";

export const useGetCargosDiretoriaExecutiva = () => {

    const {isError, data: data_cargos_diretoria_executiva, error } = useQuery(
        ['retrieve-cargos-diretoria-executiva'],
        ()=> getCargosDaDiretoriaExecutiva(),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    return {isError, data_cargos_diretoria_executiva, error}


}