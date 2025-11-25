import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getPrioridadesRelatorio } from "../../../../../../services/escolas/Paa.service";
import { parseMoneyCentsBRL } from "../../../../../../utils/money";

const identificarRecursoPrioridade = (prioridade) => {
  if (prioridade?.acao_associacao_objeto?.e_recursos_proprios) {
    return "RECURSO_PROPRIO";
  }
  const recursoRaw = prioridade?.recurso || "";
  const recursoUpper = recursoRaw.toUpperCase();
  if (recursoUpper.includes("RECURSO")) return "RECURSO_PROPRIO";
  if (recursoUpper.includes("PDDE")) return "PDDE";
  if (recursoUpper.includes("PTRF")) return "PTRF";
  return prioridade?.recurso;
};

const mapPrioridade = (item) => {
  const valorTotalNumber =
    item?.valor_total !== null && item?.valor_total !== undefined
      ? (() => {
          const parsed =
            typeof item.valor_total === "number"
              ? item.valor_total
              : parseMoneyCentsBRL(String(item.valor_total));
          return parsed !== null ? parsed : Number(item.valor_total);
        })()
      : null;

  return {
    ...item,
    valor_total: valorTotalNumber,
    recurso_tipo: identificarRecursoPrioridade(item),
  };
};

export const useGetPrioridadesAtaPaa = (uuid_paa) => {
  const query = useQuery(
    ["prioridades-ata-paa", uuid_paa],
    async () => {
      // Salvar temporariamente o PAA no localStorage para o serviço funcionar
      const paaAnterior = localStorage.getItem("PAA");
      try {
        if (uuid_paa) {
          localStorage.setItem("PAA", uuid_paa);
        }
        const resultado = await getPrioridadesRelatorio({});
        return resultado;
      } finally {
        // Restaurar o valor anterior do localStorage
        if (paaAnterior) {
          localStorage.setItem("PAA", paaAnterior);
        } else {
          localStorage.removeItem("PAA");
        }
      }
    },
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: !!uuid_paa,
    }
  );

  const prioridadesAgrupadas = useMemo(() => {
    const lista = Array.isArray(query.data?.results)
      ? query.data.results
      : Array.isArray(query.data)
      ? query.data
      : [];

    const prioridadesMapeadas = lista.map(mapPrioridade);

    const agrupadas = {
      PTRF: [],
      PDDE: [],
      RECURSO_PROPRIO: [],
    };

    prioridadesMapeadas.forEach((prioridade) => {
      const tipoRecurso = prioridade.recurso_tipo;
      if (tipoRecurso === "PTRF") {
        agrupadas.PTRF.push(prioridade);
      } else if (tipoRecurso === "PDDE") {
        agrupadas.PDDE.push(prioridade);
      } else if (tipoRecurso === "RECURSO_PROPRIO") {
        agrupadas.RECURSO_PROPRIO.push(prioridade);
      }
    });

    // Calcular totais
    const calcularTotal = (lista) => {
      return lista.reduce((total, item) => {
        return total + (item.valor_total || 0);
      }, 0);
    };

    return {
      PTRF: {
        prioridades: agrupadas.PTRF,
        total: calcularTotal(agrupadas.PTRF),
      },
      PDDE: {
        prioridades: agrupadas.PDDE,
        total: calcularTotal(agrupadas.PDDE),
      },
      RECURSO_PROPRIO: {
        prioridades: agrupadas.RECURSO_PROPRIO,
        total: calcularTotal(agrupadas.RECURSO_PROPRIO),
      },
    };
  }, [query.data]);

  return {
    ...query,
    prioridadesAgrupadas,
  };
};

