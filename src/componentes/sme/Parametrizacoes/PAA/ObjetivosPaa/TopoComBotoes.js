import {useContext} from "react";
import { ObjetivosPaaContext } from "./context/index";
import { IconButton } from "../../../../Globais/UI";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"

export const TopoComBotoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(ObjetivosPaaContext)

    return(
        <div className="d-flex  justify-content-end pb-4 mt-2">
            <IconButton
                icon="faPlus"
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label="Adicionar objetivo"
                onClick={()=>{
                    setStateFormModal(initialStateFormModal);
                    setShowModalForm(true);
                }}
                variant="success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            />
        </div>
    )

}