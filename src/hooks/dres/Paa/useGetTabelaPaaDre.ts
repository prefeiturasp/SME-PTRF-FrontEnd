import { useQuery } from '@tanstack/react-query';
import { getTabelaPaaDre } from '../../../services/dres/Paa.service';
import { ITabelaPaaResponse } from '../../../interface/dre/Paa/paa.interface';

export const useGetTabelaPaaDre = (uuidRecurso?: string) => {
    return useQuery<ITabelaPaaResponse>({
        queryKey: ['tabela-paa', uuidRecurso],
        queryFn: () => getTabelaPaaDre(uuidRecurso!),
        enabled: !!uuidRecurso,
        staleTime: Infinity,
    });
};
