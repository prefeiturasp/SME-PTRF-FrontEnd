import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { RelatorioVisualizacao } from "../components/RelatorioVisualizacao";
import { useGetPaa } from "../../../../componentes/hooks/useGetPaa";
import { PaaContext, usePaaContext } from "../../../../componentes/PaaContext";
import { AtividadesPrevistas } from "./AtividadesPrevistas";
import { RecursosProprios } from "./RecursosProprios";
import "./styles.scss";

export const VisualizarAtividadesPrevistasContent = () => {
  const navigate = useNavigate();

  const { paa, isFetching: isLoadingPaa } = usePaaContext();


  const handleVoltar = useCallback(() => {
    let voltarRota = "/elaborar-novo-paa";

    if (paa?.status === "EM_RETIFICACAO") {
      voltarRota =`/retificacao-paa/${paa?.uuid}`;
    }
    navigate(voltarRota, {
      state: {
        activeTab: "relatorios",
        expandedSections: {
          planoAnual: true,
          componentes: true,
        },
      },
    });
  }, [navigate, paa]);

  return (
      <RelatorioVisualizacao
        title="Atividades previstas"
        onBack={handleVoltar}
        showWatermark={true}
      >
        <Spin spinning={isLoadingPaa} size="large">

          <AtividadesPrevistas/>
          <RecursosProprios paa={paa}/>

        </Spin>

      </RelatorioVisualizacao>
  );
};

export const VisualizarAtividadesPrevistas = () => {
  const paa_uuid_storage = localStorage.getItem('PAA');

  const { data: paa, refetch, isFetching } = useGetPaa(paa_uuid_storage);

  const renderizar = useCallback(() => {
    if (!paa) return <></>;

    return (
      // Provider para Paa, adiciona o (paa e refetch) de Paa Original
      <PaaContext.Provider value={{ paa, refetch, isFetching }}>
        <VisualizarAtividadesPrevistasContent />
      </PaaContext.Provider>
    )
  }, [paa, refetch, isFetching]);

  return renderizar();
};