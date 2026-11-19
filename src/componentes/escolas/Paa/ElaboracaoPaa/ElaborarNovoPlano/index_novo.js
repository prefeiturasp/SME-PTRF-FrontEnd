import { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaaBase from "../../componentes/PaaBase";
import { useGetPaa } from "../../componentes/hooks/useGetPaa";
import { PaaContext } from "../../componentes/PaaContext";
import { gravarPaaAtivo } from "../../../../../utils/paaAtivoStorage";

export const ElaborarNovoPlanoNovo = () => {
  const { uuid_paa } = useParams();
  const navigate = useNavigate();

  const { data: paaCarregado, refetch, isFetching, isError } = useGetPaa(uuid_paa);

  const [paaAtivoSincronizado, setPaaAtivoSincronizado] = useState(null);

  // Enquanto carregamos o PAA, ainda mantém o PAA anterior, por isso verificamos o uuid do PAA com o uuid da rota
  const paa = paaCarregado?.uuid === uuid_paa ? paaCarregado : null;
  
  // Telas internas ainda leem o PAA ativo da aba: ele é sincronizado com a rota antes de eleas serem exibidas
  useEffect(() => {
    if (!paa) return;
    gravarPaaAtivo(paa);
    setPaaAtivoSincronizado(paa.uuid);
  }, [paa]);

  // PAA inexistente ou sem acesso: o aviso é do hook do useGetPaa, aqui volta para a escolha do PAA
  useEffect(() => {
    if (isError) navigate('/paa', { replace: true });
  }, [isError, navigate]);

  const itemsBreadCrumb = useMemo(() => {
    return [
    { label: 'Plano Anual de Atividades', url: '/paa' },
    { label: 'Elaborar novo plano', active: true },
  ];
  }, []);
  
  const contexts = useMemo(() => {
    return {
      paa,
      refetch,
      isFetching,
    };
  }, [paa, refetch, isFetching]);

  if (!paa || paaAtivoSincronizado !== uuid_paa) return <></>;

  return (
    // Provider para Paa, adiciona o (paa e refetch) de Paa Original
    <PaaContext.Provider value={contexts}>
      <PaaBase itemsBreadCrumb={itemsBreadCrumb} />
    </PaaContext.Provider>
  )
  
};
