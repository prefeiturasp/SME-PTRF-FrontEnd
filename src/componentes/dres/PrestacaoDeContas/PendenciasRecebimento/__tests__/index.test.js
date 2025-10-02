import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PendenciasRecebimento } from "../index";
import {
  postNotificarPendenciaGeracaoAtaApresentacao,
  postNotificarPendenciaGeracaoAtaRetificacao,
} from "../../../../../services/dres/PrestacaoDeContas.service";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { STATUS_PRESTACAO_CONTA } from "../../../../../constantes/prestacaoConta";

jest.mock("../../../../../services/dres/PrestacaoDeContas.service", () => ({
  postNotificarPendenciaGeracaoAtaApresentacao: jest.fn(),
  postNotificarPendenciaGeracaoAtaRetificacao: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("PendenciasRecebimento", () => {
  const basePrestacao = {
    uuid: "UUID-FAKE",
    ata_aprensentacao_gerada: false,
    ata_retificacao_gerada: false,
    status: "QUALQUER",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  test("não deve renderizar nada se não houver pendências apresentação", () => {
    const prestacao = {
      ...basePrestacao,
      ata_aprensentacao_gerada: true,
      ata_retificacao_gerada: false,
      status: STATUS_PRESTACAO_CONTA.NAO_RECEBIDA,
    };
    const { container } = render(<PendenciasRecebimento prestacaoDeContas={prestacao} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("não deve renderizar nada se não houver pendências retificação", () => {
    const prestacao = {
      ...basePrestacao,
      ata_aprensentacao_gerada: true,
      ata_retificacao_gerada: true,
      status: STATUS_PRESTACAO_CONTA.DEVOLVIDA_RETORNADA,
    };
    const { container } = render(<PendenciasRecebimento prestacaoDeContas={prestacao} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("deve mostrar pendência de ata de apresentação quando não gerada", () => {
    const prestacao = { ...basePrestacao, status: STATUS_PRESTACAO_CONTA.NAO_RECEBIDA };

    render(<PendenciasRecebimento prestacaoDeContas={prestacao} />);
    expect(screen.getByText("Associação - Geração da ata de apresentação (PDF)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /notificar associação/i })).toBeInTheDocument();
  });

  // test("deve mostrar pendência de ata de retificação se status = DEVOLVIDA_RETORNADA", () => {
  //   const prestacao = { ...basePrestacao, status: STATUS_PRESTACAO_CONTA.DEVOLVIDA_RETORNADA };
  //   render(<PendenciasRecebimento prestacaoDeContas={prestacao} />);
  //   expect(screen.getByText("Associação - Geração da ata de retificação (PDF)")).toBeInTheDocument();
  // });

  test("ao clicar em notificar apresentação → chama service e mostra sucesso", async () => {
    const prestacao = { ...basePrestacao, status: STATUS_PRESTACAO_CONTA.NAO_RECEBIDA };

    postNotificarPendenciaGeracaoAtaApresentacao.mockResolvedValueOnce({});
    render(<PendenciasRecebimento prestacaoDeContas={prestacao} />);

    const btn = screen.getByRole("button", { name: /notificar associação/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(postNotificarPendenciaGeracaoAtaApresentacao).toHaveBeenCalledWith("UUID-FAKE");
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Notificação enviada com sucesso!");
    });
  });

  // test("ao clicar em notificar retificação → chama service e mostra sucesso", async () => {
  //   const prestacao = { ...basePrestacao, status: STATUS_PRESTACAO_CONTA.DEVOLVIDA_RETORNADA };

  //   postNotificarPendenciaGeracaoAtaRetificacao.mockResolvedValueOnce({});
  //   render(<PendenciasRecebimento prestacaoDeContas={prestacao} />);

  //   const btn = screen.getByRole("button", { name: /notificar associação/i });
  //   fireEvent.click(btn);

  //   await waitFor(() => {
  //     expect(postNotificarPendenciaGeracaoAtaRetificacao).toHaveBeenCalledWith("UUID-FAKE");
  //     expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Notificação enviada com sucesso!");
  //   });
  // });

  test("ao clicar em notificar apresentação → chama service e mostra erro se falhar", async () => {
    postNotificarPendenciaGeracaoAtaApresentacao.mockRejectedValueOnce(new Error("fail"));
    const prestacao = { ...basePrestacao, status: STATUS_PRESTACAO_CONTA.NAO_RECEBIDA };

    render(<PendenciasRecebimento prestacaoDeContas={prestacao} />);

    const btn = screen.getByRole("button", { name: /notificar associação/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(postNotificarPendenciaGeracaoAtaApresentacao).toHaveBeenCalledWith("UUID-FAKE");
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops! Houve um erro ao tentar enviar notificação.");
    });
  });

  // test("ao clicar em notificar retificação → chama service e mostra erro se falhar", async () => {
  //   postNotificarPendenciaGeracaoAtaRetificacao.mockRejectedValueOnce(new Error("fail"));
  //   const prestacao = { ...basePrestacao, status: STATUS_PRESTACAO_CONTA.DEVOLVIDA_RETORNADA };

  //   render(<PendenciasRecebimento prestacaoDeContas={prestacao} />);

  //   const btn = screen.getByRole("button", { name: /notificar associação/i });
  //   fireEvent.click(btn);

  //   await waitFor(() => {
  //     expect(postNotificarPendenciaGeracaoAtaRetificacao).toHaveBeenCalledWith("UUID-FAKE");
  //     expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops! Houve um erro ao tentar enviar notificação.");
  //   });
  // });
});
