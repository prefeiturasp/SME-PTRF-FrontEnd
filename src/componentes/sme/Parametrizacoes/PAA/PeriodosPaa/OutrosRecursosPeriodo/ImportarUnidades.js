import { useCallback, useState } from "react";
import ModalImportarListaUes from "./ModalImportarListaUes";
import { useQueryClient} from "@tanstack/react-query";

export const ImportarUnidades = ({ outroRecursoPeriodo }) => {
  const queryClient = useQueryClient()

  const [showModal, setShowModal] = useState(false);

  const renderBotaoImportarUE = useCallback(() => {
    return (
      <button
        type="button"
        onClick={() => {
          setShowModal(true);
        }}
        className="btn btn btn-outline-success"
      >
        Importar lista de UEs
      </button>
    );
  }, [setShowModal]);

  const onSuccessImport = () => {
    // atualiza vinculadas e não vinculadas, inclusive a intance OutroRecursoPeriodo
    queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, outroRecursoPeriodo.uuid], exact: false });
    queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, outroRecursoPeriodo.uuid], exact: false });
    queryClient.invalidateQueries({ queryKey: [`outros-recursos-periodos-paa`], exact: false });
  };

  return (
    <>
      {renderBotaoImportarUE()}
      <ModalImportarListaUes 
        onCloseModal={() => setShowModal(false)}
        showModalImportarUEs={showModal}
        onSuccess={onSuccessImport}
        outroRecursoPeriodo={outroRecursoPeriodo} />
    </>
  );
};
