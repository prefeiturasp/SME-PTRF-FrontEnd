import { useCallback, useMemo } from "react";
import PaaBase from "../../componentes/PaaBase";
import { useGetPaa } from "../../componentes/hooks/useGetPaa";
import { PaaContext } from "../../componentes/PaaContext";

export const ElaborarNovoPlano = () => {
  const paa_uuid_storage = localStorage.getItem('PAA');

  const { data: paa, refetch } = useGetPaa(paa_uuid_storage);

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
        <PaaBase itemsBreadCrumb={itemsBreadCrumb} />
      </PaaContext.Provider>
    )
  }, [paa, refetch, itemsBreadCrumb]);

  return renderizar();
};
