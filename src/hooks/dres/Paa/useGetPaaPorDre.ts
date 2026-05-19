import { useQuery } from '@tanstack/react-query';
import { getPaaPorDre } from '../../../services/dres/Paa.service';
import { IParamsUseListaPaa, IPaaQueryParams } from '../../../interface/dre/Paa/paa.interface';

const LINHAS_POR_PAGINA = 10;

const carregarListaPaa = async ({ uuidRecurso, filtros, pagina }: IParamsUseListaPaa) => {
    const params: IPaaQueryParams = {
        periodo: filtros.periodo?.join(',') || '',
        unidade: filtros.unidade || '',
        tipo_unidade: filtros.tipo_unidade || '',
        status: filtros.status?.join(',') || '',
        page: pagina,
        page_size: LINHAS_POR_PAGINA,
    };

    return getPaaPorDre(params, uuidRecurso);
};

export const useGetPaaPorDre = ({ uuidRecurso, filtros, pagina }: IParamsUseListaPaa) => {
    return useQuery({
        queryKey: ['lista-paa', uuidRecurso, filtros, pagina],

        queryFn: () =>
            carregarListaPaa({
                uuidRecurso,
                filtros,
                pagina,
            }),

        enabled: !!uuidRecurso,

        placeholderData: (previousData) => previousData,
    });
};
