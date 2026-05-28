import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import PaaBase from "../componentes/PaaBase";
import { useGetPaaRetificacao } from "../componentes/hooks/useGetPaaRetificacao";
import { PaaContext } from "../componentes/PaaContext";

export const RetificacaoPaa = () => {
  const { uuid_paa } = useParams();

  const { data: paa, refetch } = useGetPaaRetificacao(uuid_paa);

  const itemsBreadCrumb = useMemo(() => {
    return [
      { label: "Plano Anual de Atividades", url: "/retificacao-paa" },
      { label: "PAA Vigente e Anteriores", active: true },
    ];
  }, []);

  const renderizar = useCallback(() => {
    if (!uuid_paa) return <></>;

    return (
      // Provider para Retificação Paa, adiciona o (paa e refetch) de Paa Retificado
      <PaaContext.Provider value={{ paa, refetch }}>
        <PaaBase itemsBreadCrumb={itemsBreadCrumb} />
      </PaaContext.Provider>
    );
  }, [paa, refetch, uuid_paa, itemsBreadCrumb]);

  return renderizar();
};
