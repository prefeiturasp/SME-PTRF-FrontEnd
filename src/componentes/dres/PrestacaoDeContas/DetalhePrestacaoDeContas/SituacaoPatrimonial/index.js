import React, { useState } from "react";
import { Spin } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ModalLegendaConferenciaLancamentos } from "../ConferenciaDeLancamentos/Modais/ModalLegendaConferenciaLancamentos";
import { useGetBemProduzidosComAdquiridos } from "../../../../escolas/SituacaoPatrimonial/ListaBemProduzido/hooks/useGetBemProduzidosComAdquiridos";
import {
  formatarNumeroDocumento,
  formatarNumeroProcesso,
  formatarValorMonetario,
  formatarData,
} from "../../../../escolas/SituacaoPatrimonial/ListaBemProduzido/formatadores";
import { Tag } from "../../../../Globais/Tag";
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import useConferidoTemplate from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate";

const REGISTROS_POR_PAGINA = 10;
const SEM_QUEBRA = { whiteSpace: "nowrap" };

const tipoDeBemTemplate = (rowData) => {
  if (rowData.tipo === "Produzido") {
    return <Tag label="Produzido" color="bem-produzido" />;
  }
  if (rowData.tipo === "Adquirido") {
    return <Tag label="Adquirido" color="bem-adquirido" />;
  }
  return null;
};


const acaoTemplate = (rowData) => (
  <button
    type="button"
    className="btn-editar-bem"
    disabled
    aria-label={`Editar bem ${rowData.especificacao_do_bem || ""}`.trim()}
    style={{ background: "none", border: "none", padding: 0, cursor: "not-allowed", opacity: 0.5 }}
  >
    <FontAwesomeIcon icon={faEdit} style={{ fontSize: "1.2em", color: "var(--color-primary-darker)" }} />
  </button>
);

export const SituacaoPatrimonialPrestacaoConta = ({ prestacaoDeContas }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const [showModalLegenda, setShowModalLegenda] = useState(false);
  // Mesmo padrão da coluna "Conferido" de Conferência de Documentos.
  // A conferência de bens será implementada no futuro (campo analise_bem); sem análise, exibe "-".
  const conferidoTemplate = useConferidoTemplate();

  const { data, isLoading } = useGetBemProduzidosComAdquiridos(
    { periodos_uuid: prestacaoDeContas?.periodo_uuid },
    currentPage,
    true,
    prestacaoDeContas?.associacao?.uuid
  );

  const onPageChange = (event) => {
    setFirstPage(event.first);
    setCurrentPage(event.page + 1);
  };

  return (
    <>
      <hr id="situacao_patrimonial" className="mt-4 mb-3" />
      <h4 className="mb-4">Situação patrimonial</h4>

      <div className="d-flex justify-content-end mb-3">
        <button type="button" className="btn btn-success" disabled>
          Solicitar a inclusão de bem produzido
        </button>
      </div>

      <Spin spinning={isLoading}>
        {data && data.count > 0 ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div data-testid="situacao-patrimonial-total">
                Exibindo{" "}
                <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>{data.count}</span>{" "}
                {data.count === 1 ? "bem" : "bens"}
              </div>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  style={{ fontSize: "18px", marginRight: "8px", color: "var(--color-primary-darker)" }}
                  icon={faInfoCircle}
                />
                <button
                  type="button"
                  className="legendas-table text-md-start"
                  onClick={() => setShowModalLegenda(true)}
                  style={{
                    color: "var(--color-primary-darker)",
                    outline: "none",
                    border: 0,
                    background: "inherit",
                    padding: "4px",
                  }}
                >
                  Legenda conferência
                </button>
              </div>
            </div>

            <div className="table-responsive" data-testid="situacao-patrimonial-tabela">
              <DataTable value={data.results} autoLayout={true} dataKey="uuid" className="no-stripe no-hover">
                <Column
                  field="numero_documento"
                  header="Nº do documento"
                  body={(rowData) => formatarNumeroDocumento(rowData.numero_documento)}
                />
                <Column
                  field="especificacao_do_bem"
                  header="Especificação do bem"
                  bodyStyle={{ minWidth: "140px" }}
                />
                <Column
                  field="num_processo_incorporacao"
                  header="Nº do processo de incorporação"
                  body={(rowData) => formatarNumeroProcesso(rowData.num_processo_incorporacao)}
                  bodyStyle={SEM_QUEBRA}
                />
                <Column
                  field="data_aquisicao_producao"
                  header="Data de aquisição/ produção"
                  body={(rowData) => formatarData(rowData.data_aquisicao_producao)}
                  bodyStyle={SEM_QUEBRA}
                />
                <Column field="quantidade" header="Quantidade" bodyStyle={{ textAlign: "center" }} />
                <Column
                  field="valor_total"
                  header="Valor total"
                  body={(rowData) => formatarValorMonetario(rowData.valor_total)}
                  bodyStyle={SEM_QUEBRA}
                />
                <Column field="tipo" header="Tipo de bem" body={tipoDeBemTemplate} bodyStyle={SEM_QUEBRA} />
                <Column
                  field="analise_bem"
                  header="Conferido"
                  body={conferidoTemplate}
                  className="align-middle text-left borda-coluna"
                  style={{ width: "100px" }}
                />
                <Column header="Ação" body={acaoTemplate} bodyStyle={{ textAlign: "center" }} />
              </DataTable>
            </div>

            {data.count > REGISTROS_POR_PAGINA && (
              <Paginator
                first={firstPage}
                rows={REGISTROS_POR_PAGINA}
                totalRecords={data.count}
                template="PrevPageLink PageLinks NextPageLink"
                onPageChange={onPageChange}
                alwaysShow={false}
              />
            )}
          </>
        ) : (
          !isLoading && (
            <MsgImgCentralizada
              texto="Não existem bens cadastrados para esta prestação de contas."
              img={Img404}
            />
          )
        )}
      </Spin>

      {/* Montado só quando aberto, para não buscar as tags da legenda a cada carregamento da tela */}
      {showModalLegenda && (
        <ModalLegendaConferenciaLancamentos
          show={showModalLegenda}
          onHide={() => setShowModalLegenda(false)}
          primeiroBotaoOnclick={() => setShowModalLegenda(false)}
          titulo="Legenda da Conferência de Lançamentos"
          primeiroBotaoTexto="Fechar"
          primeiroBotaoCss="outline-success"
        />
      )}
    </>
  );
};

export default SituacaoPatrimonialPrestacaoConta;
