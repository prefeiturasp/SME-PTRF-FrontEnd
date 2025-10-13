import {useContext} from "react";
import { AtividadesEstatutariasContext } from "./context/index";
import { IconButton } from "../../../../Globais/UI";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"

export const TopoComBotoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(AtividadesEstatutariasContext)

    return(
        <div className="d-flex  justify-content-end pb-4 mt-2">
            <IconButton
                icon="faPlus"
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label="Adicionar Atividade Estatutária"
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