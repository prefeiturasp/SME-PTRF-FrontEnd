import React, { useState } from "react";
import { useGetCargosDaComposicaoVacancia } from "../hooks/useGetCargosDaComposicaoVacancia";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { EditIconButton, TimelineIconButton } from "../../../Globais/UI/Button";
import { ModalTimelineCargoVacancia } from "./ModalTimelineCargoVacancia";


export const CargosDaComposicaoListVacancia = ({ composicaoUuid, data }) => {
  const { isLoading, data: cargos } = useGetCargosDaComposicaoVacancia(composicaoUuid, data);
  const navigate = useNavigate();

  const [cargoParaTimeline, setCargoParaTimeline] = useState(null);

  const acoesTemplate = (rowData) => {
    // Composição de mandato na vigência atual
    const ehComposicaoVigente = rowData.eh_composicao_vigente !== false;

    // considera edição com ocupantes no cargo (para casos de edição de dados no formulário)
    const ehCargoVigente = rowData.cargo_vigente;

    // Abre permissão para último Ocupante que já saiu para permitir realizar o cancelamento de uma saída
    const ehUltimoOcupante = rowData.eh_ultimo_ocupante;

    const exibeBotaoEditar = ehComposicaoVigente && (ehCargoVigente || ehUltimoOcupante);
    return (
      <div className="d-flex">
        {exibeBotaoEditar &&
          <EditIconButton
            onClick={() => {
              navigate(`/cadastro-historico-de-membros-vacancia/${composicaoUuid}`, {
                state: { cargo: rowData, marcoSelecionado: data },
              });
            }}
          />
        }
        <TimelineIconButton
          onClick={() => setCargoParaTimeline(rowData)}
        />
      </div>
    );
  };

  const montaColunaNomeOcupante = (rowData) => {

    let etiquetas = [];
    if (rowData.cargo_vago === true) {
      etiquetas.push(<Badge className="badge-cargo-vago">{'Cargo Vago'}</Badge>);
    } else {
      if (rowData.tag_novo_membro) {
        etiquetas.push(<Badge className="badge-novo-membro">{rowData.tag_novo_membro}</Badge>);
      }
      if (rowData.tag_vacancia) {
        etiquetas.push(<Badge className="badge-vacancia">{rowData.tag_vacancia}</Badge>);
      }
    }

    return (
      <div className="d-flex flex-column align-items-start">
        <span>{rowData?.ocupante_do_cargo?.nome}</span>
        {etiquetas.map((etiqueta) => (
          <div key={etiqueta}>{etiqueta}</div>
        ))}
      </div>
    );
  };

  return (
    <span className="CargosDaComposicaoListVacancia">
      {!isLoading && cargos?.diretoria_executiva && (
        <div className="pt-0 pr-2 pl-2 pb-2">
          <p><strong>Diretoria executiva</strong></p>
          <DataTable value={cargos.diretoria_executiva} className="tabela-lista-usuarios">
            <Column field="cargo_associacao_label" header="Cargo" />
            <Column field="ocupante_do_cargo.nome" header="Nome" body={montaColunaNomeOcupante} />
            <Column field="ocupante_do_cargo.representacao_label" header="Representação" />
            <Column field="acao" header="Ação" style={{ width: "100px", textAlign: "center" }} body={acoesTemplate} />
          </DataTable>
        </div>
      )}

      {!isLoading && cargos?.conselho_fiscal && (
        <div className="p-2 mt-3">
          <p><strong>Conselho Fiscal</strong></p>
          <DataTable value={cargos.conselho_fiscal} className="tabela-lista-usuarios">
            <Column field="cargo_associacao_label" header="Cargo" />
            <Column field="ocupante_do_cargo.nome" header="Nome" body={montaColunaNomeOcupante} />
            <Column field="ocupante_do_cargo.representacao_label" header="Representação" />
            <Column field="acao" header="Ação" style={{ width: "100px" }} body={acoesTemplate} />
          </DataTable>
        </div>
      )}

      <ModalTimelineCargoVacancia
        show={!!cargoParaTimeline}
        handleClose={() => setCargoParaTimeline(null)}
        composicaoUuid={composicaoUuid}
        cargoAssociacao={cargoParaTimeline?.cargo_associacao}
        cargoLabel={cargoParaTimeline?.cargo_associacao_label}
      />
    </span>
  );
};