import { IconButton } from "../../../../Globais/UI";

export const BarraAcaoEmLote = ({
  setDespesasSelecionadas,
  despesasSelecionadas,
  handleExcluirDespesa,
}) => {
  return (
    <div className="row">
      <div
        className="col-12"
        style={{
          background: "var(--color-primary)",
          color: "white",
          padding: "15px",
          margin: "0px 15px",
          flex: "100%",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span>
              <strong>{despesasSelecionadas.length}</strong>{" "}
              {despesasSelecionadas.length === 1
                ? "despesa selecionada"
                : "despesas selecionadas"}
            </span>
          </div>

          <div className="d-flex align-items-center">
            <IconButton
              icon="faTrash"
              label="Excluir despesa"
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
              aria-label="Excluir despesa"
              onClick={handleExcluirDespesa}
            />
            <div className="float-right" style={{ padding: "0px 10px" }}>
              |
            </div>
            <IconButton
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
              onClick={() => setDespesasSelecionadas([])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
