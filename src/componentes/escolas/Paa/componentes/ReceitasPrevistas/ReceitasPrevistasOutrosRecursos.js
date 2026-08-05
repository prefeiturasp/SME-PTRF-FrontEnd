import { useState, useCallback } from "react";
import "./style.css";
import OutrosRecursosModalForm from "./OutrosRecursosModalForm";
import TabelaOutrosRecursos from "./TabelaOutrosRecursos";
const TAB_OUTROS_RECURSOS = "outros-recursos";

const ReceitasPrevistasOutrosRecursos = ({ setActiveTab }) => {

  const [modalFormOutrosRecursos, setModalFormOutrosRecursos] = useState({
    open: false,
    data: null,
  });

  const handleOpenEditarOutrosRecursos = useCallback((rowData) => {
    setModalFormOutrosRecursos({ open: true, data: rowData });
  }, []);

  const handleCloseOutrosRecursosModalForm = useCallback((rowData) => {
    setModalFormOutrosRecursos({ open: false, data: null });
  }, []);

  return (
    <div>
      <h4>Outros Recursos</h4>
      {modalFormOutrosRecursos.open && (
        <OutrosRecursosModalForm
          open={modalFormOutrosRecursos.open}
          data={modalFormOutrosRecursos.data}
          onClose={handleCloseOutrosRecursosModalForm}
        />
      )}

      <TabelaOutrosRecursos
        setActiveTab={() => setActiveTab?.(TAB_OUTROS_RECURSOS)}
        handleOpenEditar={handleOpenEditarOutrosRecursos}
      />
    </div>
  );
};

export default ReceitasPrevistasOutrosRecursos;
