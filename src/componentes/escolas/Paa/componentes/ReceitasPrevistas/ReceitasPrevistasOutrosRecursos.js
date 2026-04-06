import { useState, useCallback, useEffect } from "react";
import "./style.css";
import OutrosRecursosModalForm from "./OutrosRecursosModalForm";
import TabelaRecursosProprios from "./TabelaRecursosProprios";
import { useGetTotalizadorRecursoProprio } from "../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";

const TAB_DETALHAMENTO_RECURSOS_PROPRIOS = "detalhamento-de-recursos-proprios";

const ReceitasPrevistasOutrosRecursos = ({ paa, setActiveTab }) => {
  const [modalFormOutrosRecursos, setModalFormOutrosRecursos] = useState({
    open: false,
    data: null,
  });

  const { data: totalRecursosProprios } = useGetTotalizadorRecursoProprio(
    paa.associacao,
    paa.uuid,
  );

  const handleOpenEditarOutrosRecursos = useCallback((rowData) => {
    setModalFormOutrosRecursos({ open: true, data: rowData });
  }, []);

  const handleCloseOutrosRecursosModalForm = useCallback((rowData) => {
    setModalFormOutrosRecursos({ open: false, data: null });
  }, []);

  return (
    <div>
      {modalFormOutrosRecursos.open && (
        <OutrosRecursosModalForm
          open={modalFormOutrosRecursos.open}
          data={modalFormOutrosRecursos.data}
          onClose={handleCloseOutrosRecursosModalForm}
        />
      )}

      <TabelaRecursosProprios
        setActiveTab={() => setActiveTab?.(TAB_DETALHAMENTO_RECURSOS_PROPRIOS)}
        totalRecursosProprios={totalRecursosProprios}
        handleOpenEditar={handleOpenEditarOutrosRecursos}
      />
    </div>
  );
};

export default ReceitasPrevistasOutrosRecursos;
