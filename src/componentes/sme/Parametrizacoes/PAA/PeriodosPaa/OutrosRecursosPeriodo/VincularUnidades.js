import { useCallback, useContext } from "react";
import { Typography } from "antd";
import ModalImportarListaUes from "./ModalImportarListaUes";

import { OutrosRecursosPeriodosPaaContext } from "./context/index";

export const VincularUnidades = ({ outroRecursoPeriodo }) => {
  const { setShowModalImportarUEs } = useContext(
    OutrosRecursosPeriodosPaaContext
  );

  const renderBotaoImportarUE = useCallback(() => {
    return (
      <button
        type="button"
        onClick={() => {
          setShowModalImportarUEs(true);
        }}
        className="btn btn btn-outline-success mt-2 mr-2"
      >
        Importar lista de UEs
      </button>
    );
  }, [setShowModalImportarUEs]);

  return (
    <>
      <Typography.Text level={5} strong>
        Vincular unidades ao {outroRecursoPeriodo?.outro_recurso_nome}
      </Typography.Text>

      <br />

      {renderBotaoImportarUE()}

      <ModalImportarListaUes outroRecursoPeriodo={outroRecursoPeriodo} />
    </>
  );
};
