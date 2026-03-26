import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import PaaBase from "../componentes/PaaBase";

export const RetificacaoPaa = () => {
  const { uuid_paa } = useParams();

  const itemsBreadCrumb = useMemo(() => {
    return [
      { label: "Plano Anual de Atividades", url: "/paa-retificacao" },
      { label: "Elaboração e histórico", active: false },
      { label: "PAA Vigente e Anteriores", active: true },
    ];
  }, []);

  const renderizar = useCallback(() => {
    if (!uuid_paa) return <></>;

    return <PaaBase paaUuid={uuid_paa} itemsBreadCrumb={itemsBreadCrumb} />;
  }, [uuid_paa, itemsBreadCrumb]);

  return renderizar();
};
