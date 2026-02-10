import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { getTodosTiposDeCusteio, getFiltrosTiposDeCusteio } from "../../../../../services/sme/Parametrizacoes.service";
import Loading from "../../../../../utils/Loading";

import Tabela from "./Tabela";
import { Filtros } from "./Filtros";
import { EditIconButton } from "../../../../Globais/UI/Button";

export const TiposDeCusteio = () => {
  const navigate = useNavigate();
  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
  const [listaDeTipos, setListaDeTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregaTodos = useCallback(async () => {
    setLoading(true);
    let todos = await getTodosTiposDeCusteio();
    setListaDeTipos(todos);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregaTodos();
  }, [carregaTodos]);

  const totalDeTipos = useMemo(() => listaDeTipos.length, [listaDeTipos]);

  const initialStateFiltros = {
    filtrar_por_nome: "",
  };
  const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

  const handleChangeFiltros = useCallback(
    (name, value) => {
      setStateFiltros({
        ...stateFiltros,
        [name]: value,
      });
    },
    [stateFiltros]
  );

  const handleSubmitFiltros = async () => {
    setLoading(true);
    let filtrados = await getFiltrosTiposDeCusteio(stateFiltros.filtrar_por_nome);
    setListaDeTipos(filtrados);
    setLoading(false);
  };

  const limpaFiltros = async () => {
    setLoading(true);
    setStateFiltros(initialStateFiltros);
    await carregaTodos();
    setLoading(false);
  };

  // Tabela
  const rowsPerPage = 20;
  const statusTemplate = (rowData) => {
    return rowData.status && rowData.status === "ATIVO" ? "Ativo" : "Inativo";
  };

  const acoesTemplate = useCallback((rowData) => {
    return (
      <EditIconButton        
        onClick={() => navigate("/edicao-tipo-de-despesa-custeio/" + rowData.uuid)}
      />      
    );
  }, []);

  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Tipo de despesa de custeio</h1>
      {loading ? (
        <div className="mt-5">
          <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />
        </div>
      ) : (
        <>
          <div className="page-content-inner">
            <div className="d-flex bd-highlight justify-content-end pb-4 mt-2">
              <button
                onClick={() => {
                  navigate(`/cadastro-tipo-de-despesa-custeio`);
                }}
                type="button"
                className="btn btn-success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
              >
                + Adicionar tipo de despesa de custeio
              </button>
            </div>

            <Filtros
              stateFiltros={stateFiltros}
              handleChangeFiltros={handleChangeFiltros}
              handleSubmitFiltros={handleSubmitFiltros}
              limpaFiltros={limpaFiltros}
            />
            <p>
              Exibindo <span className="total-acoes">{totalDeTipos}</span> tipo(s) de despesa de custeio
            </p>
            <Tabela
              rowsPerPage={rowsPerPage}
              lista={listaDeTipos}
              statusTemplate={statusTemplate}
              acoesTemplate={acoesTemplate}
            />
          </div>
        </>
      )}
    </PaginasContainer>
  );
};
