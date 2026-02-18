import React, { useContext } from "react";
import { useGetCargosDaComposicao } from "../hooks/useGetCargosDaComposicao";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { MembrosDaAssociacaoContext } from "../context/MembrosDaAssociacao";
import { EditIconButton } from "../../../Globais/UI/Button";

export const CargosDaComposicaoList = ({ escopo }) => {
  const { isLoading, data } = useGetCargosDaComposicao();
  const { currentPage, composicaoUuid } = useContext(MembrosDaAssociacaoContext);
  const navigate = useNavigate();

  const acoesTemplate = (rowData) => {
    return (
      <div>
        {currentPage === 1 && escopo === "mandato-vigente" ? (
          <EditIconButton
            onClick={() => {
              navigate(`/cadastro-historico-de-membros/${composicaoUuid}`, {
                state: { cargo: rowData },
              });
            }}
          />
        ) : (
          <button
            onClick={() => {
              navigate(`/cadastro-historico-de-membros/${composicaoUuid}`, {
                state: { cargo: rowData },
              });
            }}
            className="btn-editar-membro"
            data-qa="editar-membro"
          >
            <span data-tooltip-content="Visualizar membro" data-html={true}>
              <FontAwesomeIcon style={{ fontSize: "20px", marginRight: "0", color: "#00585E" }} icon={faEye} />
              <ReactTooltip />
            </span>
          </button>
        )}
      </div>
    );
  };

  const montaColunaNomeOcupante = (rowData) => {
    return (
      <div className="d-flex flex-column align-items-start">
        <span>{rowData.ocupante_do_cargo.nome}</span>
        {rowData.substituto === true ? (
          <Badge className="badge-substituto">{rowData.tag_substituto}</Badge>
        ) : rowData.substituido === true ? (
          <Badge className="badge-substituido">{rowData.tag_substituido}</Badge>
        ) : null}
      </div>
    );
  };

  return (
    <>
      {!isLoading && data && data.diretoria_executiva && (
        <div className="pt-0 pr-2 pl-2 pb-2">
          <p>
            <strong>Diretoria executiva</strong>
          </p>
          <DataTable value={data.diretoria_executiva} className="tabela-lista-usuarios">
            <Column field="cargo_associacao_label" header="Cargo" />
            <Column field="ocupante_do_cargo.nome" header="Nome" body={montaColunaNomeOcupante} />
            <Column field="ocupante_do_cargo.representacao_label" header="Representação" />
            <Column field="acao" header="Ação" style={{ width: "100px" }} body={acoesTemplate} />
          </DataTable>
        </div>
      )}

      {!isLoading && data && data.conselho_fiscal && (
        <div className="p-2 mt-3">
          <p>
            <strong>Conselho Fiscal</strong>
          </p>
          <DataTable value={data.conselho_fiscal} className="tabela-lista-usuarios">
            <Column field="cargo_associacao_label" header="Cargo" />
            <Column field="ocupante_do_cargo.nome" header="Nome" body={montaColunaNomeOcupante} />
            <Column field="ocupante_do_cargo.representacao_label" header="Representação" />
            <Column field="acao" header="Ação" style={{ width: "100px" }} body={acoesTemplate} />
          </DataTable>
        </div>
      )}
    </>
  );
};
