import { IconButton } from "../../../../../Globais/UI";

export const BarraAcaoEmLote = ({
  setPrioridadesSelecionadas,
  prioridadesSelecionadas,
  handleExcluirPrioridades,
}) => {
  return (
    <div className="row">
      <div
        className="col-12"
        style={{
          background: "#00585E",
          color: "white",
          padding: "15px",
          margin: "0px 15px",
          flex: "100%",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span>
              <strong>{prioridadesSelecionadas.length}</strong>{" "}
              {prioridadesSelecionadas.length === 1
                ? "prioridade selecionada"
                : "prioridades selecionadas"}
            </span>
          </div>

          <div className="d-flex align-items-center">
            <IconButton
              icon="faTrash"
              label={prioridadesSelecionadas.length === 1
                ? "Excluir prioridade"
                : "Excluir prioridades"}
              variant=""
              iconProps={{
                style: {
                  fontSize: "20px",
                  marginRight: "0",
                  color: "white",
                },
              }}
              style={{
                color: "white",
                textDecoration: "underline",
                fontWeight: 700,
              }}
              aria-label="Excluir prioridade"
              onClick={handleExcluirPrioridades}
            />
            <div className="float-right" style={{ padding: "0px 10px" }}>
              |
            </div>
            <IconButton
              className="botao-cancelar-selecao-lote"
              icon="faTimesCircle"
              label="Cancelar"
              variant=""
              iconProps={{
                style: {
                  fontSize: "20px",
                  marginRight: "0",
                  color: "white",
                },
              }}
              style={{
                color: "white",
                textDecoration: "underline",
                fontWeight: 700,
              }}
              aria-label="Cancelar"
              onClick={() => setPrioridadesSelecionadas([])}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 