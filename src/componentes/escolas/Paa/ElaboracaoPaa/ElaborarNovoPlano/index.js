import { useCallback, useMemo } from "react";
import PaaBase from "../../componentes/PaaBase";

export const ElaborarNovoPlano = () => {
  const paa_uuid_storage = localStorage.getItem('PAA');

  const itemsBreadCrumb = useMemo(() => {
    return [
    { label: 'Plano Anual de Atividades', url: '/paa' },
    { label: 'Elaborar novo plano', active: true },
  ];
  }, []);

  const renderizar = useCallback(() => {
    if (!paa_uuid_storage) return <></>;

    return <PaaBase paaUuid={paa_uuid_storage} itemsBreadCrumb={itemsBreadCrumb} />;
  }, [paa_uuid_storage, itemsBreadCrumb]);

  return renderizar();
};
