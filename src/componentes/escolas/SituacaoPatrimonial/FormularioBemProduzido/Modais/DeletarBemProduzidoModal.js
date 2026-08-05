import { DeletarModal } from "../../../../../utils/Modais"
import { useExcluirBemProduzido } from "../hooks/UseExcluirBemProduzido";
import { useParams } from "react-router-dom";

export const DeletarBemProduzidoModal = ({ showModal, setShowModal }) => {

    const { uuid } = useParams();

    const { handleExcluirBem } = useExcluirBemProduzido();

    return(
        <DeletarModal
            titulo="Deseja excluir este bem produzido?"
            show={ showModal }
            handleClose={ () => setShowModal(false) }
            onDeletarTrue={() =>
                handleExcluirBem({
                    uuid,
                    onSuccess: () => setShowModal(false),
                })
            }
            texto={"Tem certeza que deseja excluir o bem produzido? Esta ação não poderá ser desfeita."}
        />
    )
}