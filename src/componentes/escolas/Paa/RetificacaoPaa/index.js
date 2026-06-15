import { useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PaaBase from "../componentes/PaaBase";
import { useGetPaaRetificacao } from "../componentes/hooks/useGetPaaRetificacao";
import { PaaContext } from "../componentes/PaaContext";
import { toastCustom } from "../../../Globais/ToastCustom";

export const RetificacaoPaa = () => {
  const { uuid_paa } = useParams();
  const navigate = useNavigate();

  const { data: paa, refetch } = useGetPaaRetificacao(uuid_paa);

  const itemsBreadCrumb = useMemo(() => {
    return [
      { label: "Plano Anual de Atividades", url: "/retificacao-paa" },
      { label: "PAA Vigente e Anteriores", active: true },
    ];
  }, []);

  useEffect(() => {
    if(paa?.tem_documento_final_concluido && paa.status === "EM_RETIFICACAO"){
      toastCustom.ToastCustomError(
        "Documento PAA de retificação já foi gerado!",
        "Não é permitido realizar alterações neste momento.");
      navigate("/paa-vigente-e-anteriores");
    }
  }, [paa?.tem_documento_final_concluido, paa?.status]);

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
