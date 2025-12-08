import { IconButton } from "../../Globais/UI";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const TopoComBotoes = ({icone='faPlus', label='Adicionar', onClick=() => {}}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    return(
        <div className="d-flex justify-content-end pb-4 mt-2">
            <IconButton
                icon={icone}
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label={label}
                onClick={onClick}
                variant="success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            />
        </div>
    )
};