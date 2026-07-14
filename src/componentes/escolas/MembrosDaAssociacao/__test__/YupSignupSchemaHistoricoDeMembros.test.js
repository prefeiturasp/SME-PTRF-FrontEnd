import { YupSignupSchemaHistoricoDeMembros } from "../YupSignupSchemaHistoricoDeMembros";
import { valida_cpf_cnpj } from "../../../../utils/ValidacoesAdicionaisFormularios";

jest.mock("../../../../utils/ValidacoesAdicionaisFormularios", () => ({
    valida_cpf_cnpj: jest.fn(),
}));

describe("YupSignupSchemaHistoricoDeMembros", () => {
    const dadosValidos = {
        nome: "João da Silva",
        cargo_associacao: "MEMBRO",
        representacao: "COMUNIDADE",
        email: "teste@email.com",
        codigo_identificacao: null,
        cpf_responsavel: null,
        data_inicio_no_cargo: "2024-01-01",
        responsavel_pelas_atribuicoes: null,
        switch_status_presidente: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        valida_cpf_cnpj.mockReturnValue(true);
    });

    describe("campos obrigatórios", () => {
        it("deve validar um objeto válido", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate(dadosValidos)
            ).resolves.toEqual(dadosValidos);
        });

        it("deve exigir nome", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    nome: "",
                })
            ).rejects.toThrow("Nome Completo é obrigatório");
        });

        it("deve exigir cargo_associacao", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    cargo_associacao: "",
                })
            ).rejects.toThrow("Cargo na Associação é obrigatório");
        });

        it("deve exigir representacao", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    representacao: "",
                })
            ).rejects.toThrow("Representação é obrigatório");
        });

        it("deve exigir data_inicio_no_cargo", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    data_inicio_no_cargo: "",
                })
            ).rejects.toThrow("Período inicial de ocupação é obrigatório");
        });
    });

    describe("email", () => {
        it("aceita email válido", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    email: "teste@email.com",
                })
            ).resolves.toBeTruthy();
        });

        it("rejeita email inválido", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    email: "abc",
                })
            ).rejects.toThrow("Digite um email válido");
        });
    });

    describe("codigo_identificacao", () => {
        it("exige código para SERVIDOR", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    representacao: "SERVIDOR",
                    codigo_identificacao: "",
                })
            ).rejects.toThrow(
                "É obrigatório e não pode ultrapassar 10 caracteres"
            );
        });

        it("exige código para ESTUDANTE", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    representacao: "ESTUDANTE",
                    codigo_identificacao: "",
                })
            ).rejects.toThrow();
        });

        it("rejeita código com mais de 10 caracteres", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    representacao: "SERVIDOR",
                    codigo_identificacao: "12345678901",
                })
            ).rejects.toThrow();
        });

        it("aceita código válido", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    representacao: "SERVIDOR",
                    codigo_identificacao: "123456",
                })
            ).resolves.toBeTruthy();
        });

        it("não exige código para outras representações", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    representacao: "COMUNIDADE",
                    codigo_identificacao: null,
                })
            ).resolves.toBeTruthy();
        });
    });

    describe("cpf_responsavel", () => {
        it("deve chamar valida_cpf_cnpj para PAI_RESPONSAVEL", async () => {
            valida_cpf_cnpj.mockReturnValue(true);

            await YupSignupSchemaHistoricoDeMembros.validate({
                ...dadosValidos,
                representacao: "PAI_RESPONSAVEL",
                cpf_responsavel: "12345678909",
            });

            expect(valida_cpf_cnpj).toHaveBeenCalledWith("12345678909");
        });

        it("deve rejeitar CPF inválido", async () => {
            valida_cpf_cnpj.mockReturnValue(false);

            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    representacao: "PAI_RESPONSAVEL",
                    cpf_responsavel: "111",
                })
            ).rejects.toThrow("Digite um CPF válido");
        });

        it("não deve validar CPF para outras representações", async () => {
            await YupSignupSchemaHistoricoDeMembros.validate({
                ...dadosValidos,
                representacao: "COMUNIDADE",
            });

            expect(valida_cpf_cnpj).not.toHaveBeenCalled();
        });
    });

    describe("responsavel_pelas_atribuicoes", () => {
        it("deve exigir responsável para presidente sem switch", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                    switch_status_presidente: false,
                    responsavel_pelas_atribuicoes: "",
                })
            ).rejects.toThrow(
                "Responsável pelas atribuições é obrigatório"
            );
        });

        it("não deve exigir responsável quando switch estiver ligado", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                    switch_status_presidente: true,
                    responsavel_pelas_atribuicoes: "",
                })
            ).resolves.toBeTruthy();
        });

        it("não deve exigir responsável para outros cargos", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    cargo_associacao: "SECRETARIO",
                    responsavel_pelas_atribuicoes: "",
                })
            ).resolves.toBeTruthy();
        });

        it("aceita responsável informado", async () => {
            await expect(
                YupSignupSchemaHistoricoDeMembros.validate({
                    ...dadosValidos,
                    cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                    switch_status_presidente: false,
                    responsavel_pelas_atribuicoes: "Maria",
                })
            ).resolves.toBeTruthy();
        });
    });
});