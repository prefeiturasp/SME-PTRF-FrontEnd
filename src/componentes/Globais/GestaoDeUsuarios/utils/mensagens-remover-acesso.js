import {toastCustom} from "../../ToastCustom";

export const showMensagemSucessoAoRemoverAcesso = () => {
        toastCustom.ToastCustomSuccess(
            "Remoção efetuada com sucesso",
            "Usuário removido com sucesso desta unidade.",
            'success',
            'top-right',
            true)
    }

export const showMensagemErroAoRemoverAcesso = () => {
    toastCustom.ToastCustomError(
        "Erro ao tentar remover o acesso",
        "Não foi possível remover o acesso do usuário desta unidade.")
}