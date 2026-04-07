import {
    showMensagemErroAoRemoverAcesso,
    showMensagemSucessoAoRemoverAcesso
} from "../mensagens-remover-acesso";
import { toastCustom } from "../../../ToastCustom";

jest.mock("../../../ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn()
    }
}));

describe("utils/mensagens-remover-acesso", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("showMensagemSucessoAoRemoverAcesso", () => {
        it("should call success toast with UE message when visao is UE", () => {
            showMensagemSucessoAoRemoverAcesso("UE");

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Remoção efetuada com sucesso",
                "Usuário removido com sucesso desta unidade.",
                "success",
                "top-right",
                true
            );
            expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
        });

        it("should call success toast with DRE message when visao is DRE", () => {
            showMensagemSucessoAoRemoverAcesso("DRE");

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Remoção efetuada com sucesso",
                "Usuário removido com sucesso desta DRE e de suas unidades.",
                "success",
                "top-right",
                true
            );
        });

        it("should call success toast with SME message when visao is SME", () => {
            showMensagemSucessoAoRemoverAcesso("SME");

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Remoção efetuada com sucesso",
                "Usuário removido com sucesso de todas as unidades.",
                "success",
                "top-right",
                true
            );
        });

        it("should fallback to default message when visao is undefined", () => {
            showMensagemSucessoAoRemoverAcesso();

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Remoção efetuada com sucesso",
                "Mensagem não disponível para a visão selecionada.",
                "success",
                "top-right",
                true
            );
        });

        it("should fallback to default message when visao is invalid", () => {
            showMensagemSucessoAoRemoverAcesso("ESCOLA");

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Remoção efetuada com sucesso",
                "Mensagem não disponível para a visão selecionada.",
                "success",
                "top-right",
                true
            );
        });

        it("should fallback to default message when visao is null", () => {
            showMensagemSucessoAoRemoverAcesso(null);

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Remoção efetuada com sucesso",
                "Mensagem não disponível para a visão selecionada.",
                "success",
                "top-right",
                true
            );
        });
    });

    describe("showMensagemErroAoRemoverAcesso", () => {
        it("should call error toast with expected title and message", () => {
            showMensagemErroAoRemoverAcesso();

            expect(toastCustom.ToastCustomError).toHaveBeenCalledTimes(1);
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao tentar remover o acesso",
                "Não foi possível remover o acesso do usuário desta unidade."
            );
            expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        });
    });
});