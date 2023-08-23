import { toastCustom } from "../../ToastCustom";

export const showMensagemSucessoAoRemoverAcesso = (visao) => {
    const mensagens = {
        UE: "Usuário removido com sucesso desta unidade.",
        DRE: "Usuário removido com sucesso desta DRE e de suas unidades.",
        SME: "Usuário removido com sucesso de todas as unidades."
    };

    const mensagem = mensagens[visao] || "Mensagem não disponível para a visão selecionada.";

    toastCustom.ToastCustomSuccess(
        "Remoção efetuada com sucesso",
        mensagem,
        'success',
        'top-right',
        true
    );
};

export const showMensagemErroAoRemoverAcesso = () => {
    toastCustom.ToastCustomError(
        "Erro ao tentar remover o acesso",
        "Não foi possível remover o acesso do usuário desta unidade.")
}