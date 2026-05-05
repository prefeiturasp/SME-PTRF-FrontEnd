import SelectMultiFiltro from "../../../Globais/SelectMultiFiltro";
import SelectFiltro from "../../../Globais/SelectFiltro";
import "./scss/FiltrosPaa.scss";

export const FiltrosPaa = ({
  tabelaPaa = {},
  filtros = {},
  aoAlterarFiltro,
  aoSubmeterFiltros,
  limpaFiltros,
  tipoUnidadeManual
}) => {

  const unidadesFiltradas = (tabelaPaa.unidades || [])
    .filter(u => {
      if (!tipoUnidadeManual || !filtros.tipo_unidade) return true;
      return u.tipo_unidade === filtros.tipo_unidade;
    })
    .map(u => ({ ...u, id: u.uuid }));

  const periodosFormatados = (tabelaPaa.periodos || []).map(p => ({
    ...p,
    nome: p.referencia,
    id: p.uuid
  }));

  return (
    <form data-testid="filtros-form" onSubmit={aoSubmeterFiltros}>
      <div className="row">
        <SelectMultiFiltro
          label="Filtrar Vigência do PAA"
          name="periodo"
          value={filtros.periodo}
          data={periodosFormatados}
          onChange={aoAlterarFiltro}
          className="col-12 col-sm-6 col-md-4 mb-3"
        />

        <SelectFiltro
          showSearch
          label="Filtrar por unidade"
          name="unidade"
          value={filtros.unidade}
          onChange={aoAlterarFiltro}
          placeholder="Escreva o nome da unidade"
          data={unidadesFiltradas} 
          className="col-12 col-sm-6 col-md-4 mb-3"
        />

        <SelectFiltro
          showSearch
          label="Filtrar por tipo de unidade"
          name="tipo_unidade"
          value={filtros.tipo_unidade}
          onChange={aoAlterarFiltro}
          data={tabelaPaa.tipos_unidade || []}
          disabled={!!filtros.unidade}
          className={`col-12 col-sm-6 col-md-4 mb-3 ${filtros.unidade ? "disabled-field" : ""}`}
        />

        <SelectMultiFiltro
          label="Filtrar por status"
          name="status"
          value={filtros.status}
          data={tabelaPaa.status || []}
          placeholder="Selecione os status"
          onChange={aoAlterarFiltro}
          className="col-12 col-sm-6 col-md-4 mb-3"
        />
      </div>

      <div className="d-flex flex-column justify-content-end pb-3 flex-sm-row">
        <button
          onClick={limpaFiltros}
          type="button"
          className="btn btn-outline-success mt-2 mr-sm-2"
        >
          Limpar
        </button>

        <button type="submit" className="btn btn-success mt-2">
          Filtrar
        </button>
      </div>
    </form>
  );
};