import React from "react";
import {TextoExplicativo} from "./TextoExplicativoDaPagina"
import {EscolheUnidade} from "../EscolheUnidade";
import {visoesService} from "../../../services/visoes.service";
import {getUsuarioLogado} from "../../../services/auth.service"
import {barraMensagemCustom} from "../BarraMensagem";
import { useDispatch } from "react-redux";
import { ModalConfirm } from "../Modal/ModalConfirm";
import { UnidadesEmSuporte } from "./components/UnidadesEmSuporte/ListaUnidadesEmSuporte";
import { useAdicionarSuporte } from "./useAdicionarSuporte";

export const SuporteAsUnidadesV2 = (props) =>{
    const {mutationAdicionarSuporte} = useAdicionarSuporte();
    const dispatch = useDispatch();
    const {visao} = props

    let dreUuid = ''
    if (visao === "DRE") {
        dreUuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')
    }

    const handleConfirmaSuporte = (unidadeSuporteSelecionada) => {
        mutationAdicionarSuporte.mutate({usuario: getUsuarioLogado().login, payload: {codigo_eol: unidadeSuporteSelecionada.codigo_eol}})
    }

    const handleSelecaoUnidadeSuporte = (unidadeSelecionada) => {
        ModalConfirm({
            dispatch,
            title: 'Confirmação de acesso de suporte',
            message: `<p>Deseja acrescentar suporte para a unidade ${unidadeSelecionada.nome}, PROFA.?</p> <p>Ao confirmar, essa unidade será adicionada a lista de unidades para suporte e para ter acesso clique no botão "Login para as unidades de suporte". </p>`,
            cancelText: 'Não',
            confirmText: 'Sim',
            confirmButtonClass: "btn-danger",
            dataQa: 'modal-confirmar-acesso-suporte',
            onConfirm: () => handleConfirmaSuporte(unidadeSelecionada)
        });
    };

    return(
        <div>
            <TextoExplicativo visao={visao}/>
            <div className="page-content-inner">
                {visoesService.featureFlagAtiva('teste-flag') && barraMensagemCustom.BarraMensagemAcertoExterno("Feature flag teste-flag ativa.")}
                <UnidadesEmSuporte/>
                <h5 className="titulo-itens-painel mt-2">Vincular unidades de suporte</h5>
                <EscolheUnidade 
                    dre_uuid={dreUuid} 
                    onSelecionaUnidade={handleSelecaoUnidadeSuporte} 
                    visao={visao}
                    textoAcaoEscolher={null}
                />
            </div>

        </div>

    )
}
