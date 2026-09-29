import { render, screen, fireEvent } from "@testing-library/react";
import { AnalisesDeContaDaPrestacao } from "../AnalisesDeContaDaPrestacao";
import {
  getDownloadArquivoDeReferencia,
} from "../../../../../services/dres/PrestacaoDeContas.service";

jest.mock("../../../../../services/dres/PrestacaoDeContas.service", () => ({
  getDownloadArquivoDeReferencia: jest.fn(),
}));

jest.mock("../ModalVisualizarArquivoDeReferencia", () => {
  return function MockModal({ show, handleClose, nomeArquivoReferencia }: any) {
    if (!show) return null;
    return (
      <div data-testid="modal-visualizar">
        <span>Modal Aberto: {nomeArquivoReferencia}</span>
        <button onClick={handleClose}>Fechar Modal</button>
      </div>
    );
  };
});

jest.mock("react-tooltip", () => ({
  Tooltip: () => <div data-testid="react-tooltip" />,
}));

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

  const renderComponent = (props = {}) => {
    const defaults = {
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: [],
      handleChangeAnalisesDeContaDaPrestacao: jest.fn(),
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: -1 })),
      editavel: true,
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [],
        arquivos_referencia: [],
      },
      adicaoAjusteSaldo: false,
      setAdicaoAjusteSaldo: jest.fn(),
      onClickAdicionarAcertoSaldo: jest.fn(),
      onClickDescartarAcerto: jest.fn(),
      formErrosAjusteSaldo: [],
      validaAjustesSaldo: jest.fn(),
      handleOnKeyDownAjusteSaldo: jest.fn(),
      onClickSalvarAcertoSaldo: jest.fn(),
      ajusteSaldoSalvoComSucesso: [],
      onClickDeletarAcertoSaldo: jest.fn(),
    };

    const merged = { ...defaults, ...props };
    return render(<AnalisesDeContaDaPrestacao {...merged} />);
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

  test("sem conta de associação correspondente: saldo extrato UE fica '-', diferença usa saldo total e permite Adicionar acerto", () => {
    const onClickAdicionarAcertoSaldo = jest.fn();
    const infoAta = {
      conta_associacao: { uuid: "conta-sem-match" },
      totais: { saldo_atual_total: 500 },
    };

    renderComponent({
      infoAta,
      analisesDeContaDaPrestacao: [],
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: -1 })),
      adicaoAjusteSaldo: false,
      onClickAdicionarAcertoSaldo,
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "outra-conta", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
    expect(screen.getByText(/R\$\s*500,00/)).toBeInTheDocument();

    const botaoAdicionar = screen.getByRole("button", { name: /adicionar acerto/i });
    expect(botaoAdicionar).toBeEnabled();
    fireEvent.click(botaoAdicionar);
    expect(onClickAdicionarAcertoSaldo).toHaveBeenCalledWith(infoAta.conta_associacao);
  });

  test("infoAta sem conta_associacao: informações de conciliação permanecem com valores padrão", () => {
    renderComponent({
      infoAta: { totais: { saldo_atual_total: 300 } },
      analisesDeContaDaPrestacao: [],
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: -1 })),
      adicaoAjusteSaldo: false,
    });

    expect(screen.getByText(/R\$\s*300,00/)).toBeInTheDocument();
  });

  test("arquivo de referência EB: visualizar e baixar, sucesso e erro no download", async () => {
    const arquivos_referencia = [
      { uuid: "eb-1", nome: "Extrato.pdf", tipo: "EB", conta_uuid: "123" },
      { uuid: "other-1", nome: "Outro.pdf", tipo: "AP", conta_uuid: "999" },
    ];

    renderComponent({
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: [],
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: -1 })),
      adicaoAjusteSaldo: false,
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia,
      },
    });

    expect(screen.getByText("Extrato.pdf")).toBeInTheDocument();

    // primeiro botão é o de visualizar (olho), segundo é o de download
    const [botaoOlho, botaoDownload] = screen
      .getAllByRole("button")
      .filter((b) => b.className.includes("btn-editar-membro"));

    fireEvent.click(botaoOlho);
    expect(screen.getByTestId("modal-visualizar")).toBeInTheDocument();
    expect(screen.getByText(/Modal Aberto: Extrato.pdf/)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Fechar Modal"));
    expect(screen.queryByTestId("modal-visualizar")).not.toBeInTheDocument();

    (getDownloadArquivoDeReferencia as jest.Mock).mockResolvedValueOnce({ status: 200 });
    fireEvent.click(botaoDownload);
    await screen.findByText("Extrato.pdf");
    expect(getDownloadArquivoDeReferencia).toHaveBeenCalledWith(
      "Extrato.pdf",
      "eb-1",
      "EB"
    );

    (getDownloadArquivoDeReferencia as jest.Mock).mockRejectedValueOnce({
      response: { status: 500 },
    });
    fireEvent.click(botaoDownload);
  });

  test("acerto de saldo em edição: alterações no input de saldo e no atalho de teclado", () => {
    const handleChangeAnalisesDeContaDaPrestacao = jest.fn();
    const validaAjustesSaldo = jest.fn();
    const handleOnKeyDownAjusteSaldo = jest.fn();

    const analises = [
      {
        saldo_extrato: "500",
        data_extrato: "",
        uuid: null,
        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
        solicitar_correcao_da_data_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "",
      },
    ];

    renderComponent({
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: analises,
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: 0 })),
      adicaoAjusteSaldo: true,
      handleChangeAnalisesDeContaDaPrestacao,
      validaAjustesSaldo,
      handleOnKeyDownAjusteSaldo,
      formErrosAjusteSaldo: [],
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    const inputSaldo = screen.getByLabelText(/saldo corrigido/i);

    fireEvent.change(inputSaldo, { target: { value: "700", name: "saldo_extrato" } });
    expect(handleChangeAnalisesDeContaDaPrestacao).toHaveBeenCalled();
    expect(validaAjustesSaldo).toHaveBeenCalled();

    fireEvent.keyDown(inputSaldo, { key: "Enter", code: "Enter" });
    expect(handleOnKeyDownAjusteSaldo).toHaveBeenCalled();
  });

  test("checkboxes de solicitação disparam handleChangeAnalisesDeContaDaPrestacao", () => {
    const handleChangeAnalisesDeContaDaPrestacao = jest.fn();

    const analises = [
      {
        saldo_extrato: "500",
        data_extrato: "",
        uuid: null,
        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
        solicitar_correcao_da_data_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "",
      },
    ];

    renderComponent({
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: analises,
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: 0 })),
      adicaoAjusteSaldo: true,
      handleChangeAnalisesDeContaDaPrestacao,
      formErrosAjusteSaldo: [],
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);

    expect(handleChangeAnalisesDeContaDaPrestacao).toHaveBeenCalledTimes(3);
  });

  test("textarea de observação aparece quando solicitação de comprovante está marcada e permite edição", () => {
    const handleChangeAnalisesDeContaDaPrestacao = jest.fn();

    const analises = [
      {
        saldo_extrato: "500",
        data_extrato: "",
        uuid: null,
        solicitar_envio_do_comprovante_do_saldo_da_conta: true,
        solicitar_correcao_da_data_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "Obs inicial",
      },
    ];

    renderComponent({
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: analises,
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: 0 })),
      adicaoAjusteSaldo: true,
      handleChangeAnalisesDeContaDaPrestacao,
      formErrosAjusteSaldo: [],
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    const textarea = screen.getByPlaceholderText(/descrição da observação/i);
    expect(textarea).toHaveValue("Obs inicial");

    fireEvent.change(textarea, {
      target: {
        value: "Nova observação",
        name: "observacao_solicitar_envio_do_comprovante_do_saldo_da_conta",
      },
    });
    expect(handleChangeAnalisesDeContaDaPrestacao).toHaveBeenCalledWith(
      "observacao_solicitar_envio_do_comprovante_do_saldo_da_conta",
      "Nova observação"
    );
  });

  test("Descartar acerto dispara onClickDescartarAcerto", () => {
    const onClickDescartarAcerto = jest.fn();

    const analises = [
      {
        saldo_extrato: "500",
        data_extrato: "",
        uuid: null,
        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
        solicitar_correcao_da_data_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "",
      },
    ];

    renderComponent({
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: analises,
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: 0 })),
      adicaoAjusteSaldo: true,
      onClickDescartarAcerto,
      formErrosAjusteSaldo: [],
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /descartar acerto/i }));
    expect(onClickDescartarAcerto).toHaveBeenCalled();
  });

  test("acerto em branco mantém botão Salvar desabilitado (permiteSalvar = false)", () => {
    const analises = [
      {
        saldo_extrato: null,
        data_extrato: "",
        uuid: null,
        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
        solicitar_correcao_da_data_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "",
      },
    ];

    renderComponent({
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: analises,
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: 0 })),
      adicaoAjusteSaldo: true,
      formErrosAjusteSaldo: [],
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    // saldo_extrato null/nulo: calculaDiferencaDre retorna "-" e não há diferença de ajuste
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);

    const botaoSalvar = screen.getByRole("button", { name: /^salvar$/i });
    expect(botaoSalvar).toBeDisabled();
  });

  test("erro de data em formErrosAjusteSaldo bloqueia o Salvar mesmo com saldo preenchido", () => {
    const analises = [
      {
        saldo_extrato: "700",
        data_extrato: "",
        uuid: null,
        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
        solicitar_correcao_da_data_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "",
      },
    ];

    renderComponent({
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: analises,
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: 0 })),
      adicaoAjusteSaldo: true,
      formErrosAjusteSaldo: [{ data: "Data inválida" }],
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    const botaoSalvar = screen.getByRole("button", { name: /^salvar$/i });
    expect(botaoSalvar).toBeDisabled();
  });

  test("acerto válido habilita Salvar e dispara onClickSalvarAcertoSaldo ao clicar", () => {
    const onClickSalvarAcertoSaldo = jest.fn();
    const infoAta = {
      conta_associacao: { uuid: "123" },
      totais: { saldo_atual_total: 1000 },
    };

    const analises = [
      {
        saldo_extrato: "700",
        data_extrato: "",
        uuid: null,
        solicitar_correcao_da_data_do_saldo_da_conta: true,
        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "",
      },
    ];

    renderComponent({
      infoAta,
      analisesDeContaDaPrestacao: analises,
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: 0 })),
      adicaoAjusteSaldo: true,
      onClickSalvarAcertoSaldo,
      formErrosAjusteSaldo: [{}],
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    const botaoSalvar = screen.getByRole("button", { name: /^salvar$/i });
    expect(botaoSalvar).toBeEnabled();

    fireEvent.click(botaoSalvar);
    expect(onClickSalvarAcertoSaldo).toHaveBeenCalledWith(
      infoAta.conta_associacao,
      analises[0],
      0
    );
  });

  test("acerto já salvo (uuid presente) com adicaoAjusteSaldo=false exibe Excluir acerto(s) e aciona onClickDeletarAcertoSaldo", () => {
    const onClickDeletarAcertoSaldo = jest.fn();

    const analises = [
      {
        saldo_extrato: "1000",
        data_extrato: "",
        uuid: "acerto-uuid-1",
        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
        solicitar_correcao_da_data_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "",
      },
    ];

    renderComponent({
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: analises,
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: 0 })),
      adicaoAjusteSaldo: false,
      onClickDeletarAcertoSaldo,
      ajusteSaldoSalvoComSucesso: [true],
      formErrosAjusteSaldo: [],
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    expect(screen.getByText(/salvo com sucesso/i)).toBeInTheDocument();

    const botaoExcluir = screen.getByRole("button", { name: /excluir acerto/i });
    expect(botaoExcluir).toBeEnabled();
    fireEvent.click(botaoExcluir);
    expect(onClickDeletarAcertoSaldo).toHaveBeenCalled();
  });

  test("diferença de ajuste DRE: saldo corrigido nulo retorna '-' e sem indicador de diferença", () => {
    const analises = [
      {
        saldo_extrato: null,
        data_extrato: "",
        uuid: "acerto-uuid-2",
        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
        solicitar_correcao_da_data_do_saldo_da_conta: false,
        solicitar_correcao_de_justificativa_de_conciliacao: false,
        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: "",
      },
    ];

    renderComponent({
      infoAta: { conta_associacao: { uuid: "123" }, totais: { saldo_atual_total: 1000 } },
      analisesDeContaDaPrestacao: analises,
      getObjetoIndexAnalise: jest.fn(() => ({ analise_index: 0 })),
      adicaoAjusteSaldo: false,
      formErrosAjusteSaldo: [],
      prestacaoDeContas: {
        informacoes_conciliacao_ue: [
          { conta_uuid: "123", saldo_extrato: 1000, data_extrato: "2024-01-01" },
        ],
        arquivos_referencia: [],
      },
    });

    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });
});
