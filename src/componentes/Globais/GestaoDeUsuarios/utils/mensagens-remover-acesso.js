import {toastCustom} from "../../ToastCustom";

export const showMensagemSucessoAoRemoverAcesso = (visao) => {
    let mensagem = ""

    if (visao === "UE") {
        mensagem = "Usuário removido com sucesso desta unidade."
    } else if (visao === "DRE") {
        mensagem = "Usuário removido com sucesso desta DRE e de suas unidades."
    } else if (visao === "SME") {
        mensagem = "Usuário removido com sucesso de todas as unidades."
    }

    toastCustom.ToastCustomSuccess(
            "Remoção efetuada com sucesso",
            mensagem,
            'success',
            'top-right',
            true)
    }

export const showMensagemErroAoRemoverAcesso = () => {
    toastCustom.ToastCustomError(
        "Erro ao tentar remover o acesso",
        "Não foi possível remover o acesso do usuário desta unidade.")
}