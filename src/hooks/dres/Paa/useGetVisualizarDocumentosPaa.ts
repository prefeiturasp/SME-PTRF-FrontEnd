import { useQuery } from '@tanstack/react-query';

import { getVisualizarDocumentosPaa } from '../../../services/dres/Paa.service';

import { IVisualizarDocumentosPaaResponse } from '../../../interface/dre/Paa/paa.interface';

export const useGetVisualizarDocumentosPaa = (
    uuidPaa?: string,
    periodoUuid?: string,
    uuidRecurso?: string,
) => {
    return useQuery<IVisualizarDocumentosPaaResponse>({
        queryKey: ['visualizar-documentos-paa', uuidPaa, uuidRecurso],
        queryFn: () => getVisualizarDocumentosPaa(uuidPaa!, uuidRecurso),
        enabled: !!uuidPaa && !!periodoUuid,
        staleTime: Infinity,
    });
};
