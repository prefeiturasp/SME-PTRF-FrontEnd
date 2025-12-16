import { render, screen } from "@testing-library/react";
import { AnalisesDeContaDaPrestacao } from "../AnalisesDeContaDaPrestacao";

describe("AnalisesDeContaDaPrestacao - Materiais de Referência - Acerto de saldo", () => {
  const baseProps = () => {
    const infoAta = {
      conta_associacao: { uuid: "123" },
      totais: { saldo_atual_total: 1000 },
    };

    const analises = [
      {
        saldo_extrato: "1000",
        uuid: null,
        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
        solicitar_correcao_da_data_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "",
      },
    ];

    const formErrosAjusteSaldo = [{ saldo: "Mesmo saldo que UE" }];

    return {
      infoAta,
      analises,
      formErrosAjusteSaldo,
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          {
            conta_uuid: "123",
            saldo_extrato: 1000,
            data_extrato: "2024-01-01",
          },
        ],
        arquivos_referencia: [],
      },
    };
  };

  test("renderiza span 'Mesmo saldo que UE' com classe text-warning e botão Salvar habilitado", async () => {
    const { infoAta, analises, formErrosAjusteSaldo, prestacaoDeContas } =
      baseProps();

    render(
      <AnalisesDeContaDaPrestacao
        infoAta={infoAta}
        analisesDeContaDaPrestacao={analises}
        handleChangeAnalisesDeContaDaPrestacao={jest.fn()}
        getObjetoIndexAnalise={jest.fn(() => ({ analise_index: 0 }))}
        editavel={true}
        prestacaoDeContas={prestacaoDeContas}
        adicaoAjusteSaldo={true}
        setAdicaoAjusteSaldo={() => {}}
        onClickAdicionarAcertoSaldo={() => {}}
        onClickDescartarAcerto={() => {}}
        formErrosAjusteSaldo={formErrosAjusteSaldo}
        validaAjustesSaldo={() => {}}
        handleOnKeyDownAjusteSaldo={() => {}}
        onClickSalvarAcertoSaldo={() => {}}
        ajusteSaldoSalvoComSucesso={[false]}
        onClickDeletarAcertoSaldo={() => {}}
      />
    );

    const inputSaldo = screen.getByLabelText(/saldo corrigido/i);

    expect(inputSaldo).toHaveValue("R$1.000,00");

    const spanErro = screen.getByText((content) =>
      content.replace(/\s+/g, " ").includes("Mesmo saldo que UE")
    );
    expect(spanErro).toBeInTheDocument();
    expect(spanErro).toHaveClass("text-warning");

    const botaoSalvar = screen.getByRole("button", { name: /salvar/i });
    expect(botaoSalvar).toBeEnabled();
  });
});
