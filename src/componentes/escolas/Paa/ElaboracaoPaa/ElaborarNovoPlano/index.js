import { useCallback, useMemo } from "react";
import { Spin } from "antd";
import PaaBase from "../../componentes/PaaBase";
import { useGetPaa } from "../../componentes/hooks/useGetPaa";
import { PaaContext } from "../../componentes/PaaContext";

export const ElaborarNovoPlano = () => {
  const paa_uuid_storage = localStorage.getItem('PAA');

  const { data: paa, isFetching, refetch } = useGetPaa(paa_uuid_storage);

  const itemsBreadCrumb = useMemo(() => {
    return [
    { label: 'Plano Anual de Atividades', url: '/paa' },
    { label: 'Elaborar novo plano', active: true },
  ];
  }, []);
  const renderizar = useCallback(() => {
    if (!paa) return <></>;

    return (
      // Provider para Paa, adiciona o (paa e refetch) de Paa Original
      <PaaContext.Provider value={{ paa, refetch }}>
        <Spin spinning={isFetching} className="mt-5">
          <PaaBase paa={paa} itemsBreadCrumb={itemsBreadCrumb} />
        </Spin>
      </PaaContext.Provider>
    )
  }, [isFetching, paa, itemsBreadCrumb]);

  return renderizar();
};
