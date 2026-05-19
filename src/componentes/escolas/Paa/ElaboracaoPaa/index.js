import { React, useEffect, useState, useCallback, useMemo } from "react";
import { PaginasContainer } from "../../../../paginas/PaginasContainer";
import Loading from "../../../../utils/Loading";
import { getTextosPaaUe } from "../../../../services/escolas/Paa.service";
import BreadcrumbComponent from "../../../Globais/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { ASSOCIACAO_UUID } from "../../../../services/auth.service";
import { usePostPaa } from "./hooks/usePostPaa";
import {
  getPaaVigente,
  getParametroPaa,
} from "../../../../services/sme/Parametrizacoes.service";
import { EstruturaCompletaModeloPaa } from "./EstruturaCompletaModeloPaa";
import { visoesService } from "../../../../services/visoes.service";

export const ElaboracaoPaa = () => {
  const associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID);
  const navigate = useNavigate();
  const podeIniciarPaa = visoesService.getPermissoes(["custom_change_paa"]);

  const [paaNaoIniciado, setPaaNaoIniciado] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingPaa, setLoadingPaa] = useState(false);
  const [validMonthPaa, setValidMonthPaa] = useState("");
  const [textoPaa, setTextoPaa] = useState("");
  const [paaGerado, setPaaGerado] = useState(false);
  const { mutationPost } = usePostPaa();

  const itemsBreadCrumb = [
    { label: "Plano Anual de Atividades", active: true },
  ];
  const dataAtual = new Date();

  const carregaPaa = useCallback(async () => {
    setLoadingPaa(true);
    try {
      let responsePAA = await getPaaVigente(associacao_uuid);
      localStorage.setItem("PAA", responsePAA.uuid);
      localStorage.setItem("DADOS_PAA", JSON.stringify(responsePAA));

      setPaaNaoIniciado(false);
     
      setPaaGerado(
        responsePAA.status !== "EM_ELABORACAO" ||
        responsePAA.status_andamento === "GERADO_PARCIALMENTE"
      );
    } catch (error) {
      console.error(error);
      setPaaNaoIniciado(true);
      setPaaGerado(false);
    }
    setLoadingPaa(false);
  }, [associacao_uuid]);

  useEffect(() => {
    carregaPaa();
  }, [carregaPaa]);

  const carregaParametroPaa = useCallback(async () => {
    try {
      let response = await getParametroPaa();
      setValidMonthPaa(dataAtual.getMonth() + 1 >= response.detail);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    carregaParametroPaa();
  }, [carregaParametroPaa]);

  useEffect(() => {
    getTextosPaaUe()
      .then((response) => {
        setTextoPaa(response.texto_pagina_paa_ue);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, []);

  const handlePaa = async () => {
    if (paaGerado) {
      return;
    }
    if (paaNaoIniciado) {
      if (!podeIniciarPaa) {
        return;
      }
      const payload = { associacao: associacao_uuid };
      try {
        await mutationPost.mutateAsync({ payload });
      } catch {
        return;
      }
    }

    navigate("/elaborar-novo-paa");
  };

  const paa = useMemo(() => {
    return localStorage.getItem("DADOS_PAA");
  }, []);

  const botaoTexto = () => {
    if (paaGerado) return "Elaborar novo PAA";
    else if (paaNaoIniciado)
      return "Elaborar novo PAA";
    else
      return "Continuar elaboração de PAA";
  };

  return (
    <PaginasContainer>
      <BreadcrumbComponent items={itemsBreadCrumb} />
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>
      {loading || loadingPaa ? (
        <Loading
          corGrafico="black"
          corFonte="dark"
          marginTop="50"
          marginBottom="0"
        />
      ) : (
        <div className="page-content-inner">
          <div className="col-12 mb-4 mt-3">
            <div dangerouslySetInnerHTML={{ __html: textoPaa }} />
          </div>

          <EstruturaCompletaModeloPaa />

          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-success mt-2 mr-5"
              data-testid="elaborar-paa-button"
              onClick={handlePaa}
              disabled={
                !validMonthPaa ||
                paaGerado ||
                (paaNaoIniciado && !podeIniciarPaa)
              }
            >
              {botaoTexto()}
            </button>
          </div>
        </div>
      )}
    </PaginasContainer>
  );
};
