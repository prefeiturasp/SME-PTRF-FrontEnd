import React from "react";
import { DatePicker, Select, Space } from "antd";
import moment from "moment/moment";
import { Botoes } from "./Botoes";

export const FiltroExpandido = ({
  stateFiltros,
  tabelasDespesa,
  handleClearDate,
  handleChangeFiltros,
  handleSubmitFiltros,
  limpaFiltros,
  handleChangeFiltroInformacoes,
  handleChangeFiltroConferencia,
  btnMaisFiltros,
  setBtnMaisFiltros,
  formatDate,
  listaTagInformacao,
  listaTagsConferencia,
}) => {
  const { Option } = Select;

  return (
    <>
      <div className="form-row align-items-center">
        <div className="form-group col">
          <label htmlFor="filtrar_por_lancamento">Tipo de lançamento</label>
          <select
            value={stateFiltros.filtrar_por_lancamento}
            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
            name={`filtrar_por_lancamento`}
            id={`filtrar_por_lancamento`}
            className="form-control"
          >
            <option value="">Selecione</option>
            <option value="CREDITOS">Créditos</option>
            <option value="GASTOS">Gastos</option>
          </select>
        </div>
        <div className="form-group col">
          <label htmlFor="filtrar_por_acao">Ação</label>
          <select
            value={stateFiltros.filtrar_por_acao}
            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
            name={`filtrar_por_acao`}
            id={`filtrar_por_acao`}
            className="form-control"
          >
            <option value="">Selecione</option>
            {tabelasDespesa &&
              tabelasDespesa.acoes_associacao &&
              tabelasDespesa.acoes_associacao.length > 0 &&
              tabelasDespesa.acoes_associacao.map((item) => (
                <option key={item.uuid} value={item.uuid}>
                  {item.nome}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="form-row align-items-center">
        <div className="form-group col">
          <label htmlFor="filtrar_por_nome_fornecedor">Fornecedor</label>
          <input
            value={stateFiltros.filtrar_por_nome_fornecedor}
            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
            name={`filtrar_por_nome_fornecedor`}
            id={`filtrar_por_nome_fornecedor`}
            type="text"
            className="form-control"
            placeholder="Escreva a razão social do fornecedor"
          />
        </div>
        <div className="form-group col">
          <label htmlFor="filtrar_por_numero_de_documento">
            Número de documento
          </label>
          <input
            value={stateFiltros.filtrar_por_numero_de_documento}
            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
            name="filtrar_por_numero_de_documento"
            id="filtrar_por_numero_de_documento"
            type="text"
            className="form-control"
            placeholder="Digite o número"
          />
        </div>
        <div className="form-group col">
          <label htmlFor="filtrar_por_tipo_de_documento">
            Tipo de documento
          </label>
          <select
            value={stateFiltros.filtrar_por_tipo_de_documento}
            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
            name={`filtrar_por_tipo_de_documento`}
            id={`filtrar_por_tipo_de_documento`}
            className="form-control"
          >
            <option value="">Selecione</option>
            {tabelasDespesa &&
              tabelasDespesa.tipos_documento &&
              tabelasDespesa.tipos_documento.length > 0 &&
              tabelasDespesa.tipos_documento.map((item) => (
                <option className="form-control" key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="form-row align-items-center">
        <div className="form-group col">
          <label htmlFor="filtrar_por_tipo_de_pagamento">
            Forma de pagamento
          </label>
          <select
            value={stateFiltros.filtrar_por_tipo_de_pagamento}
            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
            name={`filtrar_por_tipo_de_pagamento`}
            id={`filtrar_por_tipo_de_pagamento`}
            className="form-control"
          >
            <option key="" value="">
              Selecione
            </option>
            {tabelasDespesa.tipos_transacao &&
              tabelasDespesa.tipos_transacao.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group col">
          <Space className="extracao-space" direction="vertical">
            <span>Período de pagamento</span>
            <DatePicker.RangePicker
              format={"DD/MM/YYYY"}
              disabledDate={(date) =>
                date.startOf("day").toDate().valueOf() >
                moment().startOf("day").toDate().valueOf()
              }
              allowEmpty={[true, true]}
              className="form-control pr-3"
              style={{ display: "inline-flex" }}
              placeholder={["Data início", "Data final"]}
              id="data_range"
              onCalendarChange={(date) => {
                if (!date) {
                  handleClearDate();
                } else {
                  date[0] &&
                    handleChangeFiltros(
                      "filtrar_por_data_inicio",
                      date[0].format("YYYY-MM-DD")
                    );
                  date[1] &&
                    handleChangeFiltros(
                      "filtrar_por_data_fim",
                      date[1].format("YYYY-MM-DD")
                    );
                }
              }}
              defaultValue={[
                stateFiltros.filtrar_por_data_inicio
                  ? formatDate(stateFiltros.filtrar_por_data_inicio)
                  : "",
                stateFiltros.filtrar_por_data_fim
                  ? formatDate(stateFiltros.filtrar_por_data_fim)
                  : "",
              ]}
            />
          </Space>
        </div>
      </div>

      <div className="form-row align-items-center">
        <div className="form-group col">
          <label
            htmlFor="select_filtrar_por_informacoes"
            id="lbl_filtrar_por_informacoes"
          >
            Informações
          </label>
          <Select
            id="select_filtrar_por_informacoes"
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Selecione"
            value={stateFiltros.filtrar_por_informacoes}
            onChange={handleChangeFiltroInformacoes}
            className="multiselect-filtrar-por-status"
          >
            {listaTagInformacao &&
              listaTagInformacao.length > 0 &&
              listaTagInformacao.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.nome}
                </Option>
              ))}
          </Select>
        </div>

        <div className="form-group col">
          <label
            htmlFor="select_filtrar_por_conferencia"
            id="lbl_select_filtrar_por_conferencia"
          >
            Conferência
          </label>
          <Select
            id="select_filtrar_por_conferencia"
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Selecione"
            value={stateFiltros.filtrar_por_conferencia}
            onChange={handleChangeFiltroConferencia}
            className="multiselect-filtrar-por-status"
          >
            {listaTagsConferencia &&
              listaTagsConferencia.length > 0 &&
              listaTagsConferencia.map((item) => (
                <Option key={item.id} value={item.nome}>
                  {item.descricao}
                </Option>
              ))}
          </Select>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <Botoes
          btnMaisFiltros={btnMaisFiltros}
          setBtnMaisFiltros={setBtnMaisFiltros}
          limpaFiltros={limpaFiltros}
          handleSubmitFiltros={handleSubmitFiltros}
        />
      </div>
    </>
  );
};
