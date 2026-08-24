import { render, waitFor } from "@testing-library/react";
import { EdicaoAtaPaa } from "../index";
import {useGetAtaPaaVigente} from "../../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/hooks/useGetAtaPaaVigente";
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import {
  getListaPresentesPadraoPaa,
  getListaPresentesPaa,
} from "../../../../../../services/escolas/PresentesAtaPaa.service";

import {
  getTabelasAtasPaa,
  getAtaPaa,
} from "../../../../../../services/escolas/AtasPaa.service";

import { getMembrosCargos } from "../../../../../../services/escolas/PrestacaoDeContas.service";

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomError: jest.fn(),
    ToastCustomSuccess: jest.fn(),
  },
}));

jest.mock("../../../../../../services/escolas/PresentesAtaPaa.service", () => ({
  getListaPresentesPadraoPaa: jest.fn(),
  getListaPresentesPaa: jest.fn(),
  postEdicaoAtaPaa: jest.fn(),
}));

jest.mock("../../../../../../services/escolas/AtasPaa.service", () => ({
  getTabelasAtasPaa: jest.fn(),
  getAtaPaa: jest.fn(),
}));

jest.mock("../../../../../../services/escolas/PrestacaoDeContas.service", () => ({
  getMembrosCargos: jest.fn(),
}));

jest.mock(
  "../../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/hooks/useGetAtaPaaVigente",
  () => ({
    useGetAtaPaaVigente: jest.fn(),
  }),
);

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(() => false),
  },
}));

jest.mock(
  "../../../../../../hooks/Globais/useCarregaRepassesPendentesPorPeriodoAteAgora",
  () => ({
    useCarregaRepassesPendentesPorPeriodoAteAgora: jest.fn(() => []),
  }),
);

jest.mock("../TopoComBotoes", () => ({
  TopoComBotoes: () => <div data-testid="topo" />,
}));

jest.mock("../FormularioEditaAta", () => ({
  FormularioEditaAta: ({ listaPresentesPadrao }) => (
    <div data-testid="lista-presentes">
      {JSON.stringify(listaPresentesPadrao)}
    </div>
  ),
}));

jest.mock("../NovoFormularioEditaAta", () => ({
  NovoFormularioEditaAta: () => (
    <div data-testid="novo-formulario" />
  ),
}));

const renderEdicaoAtaPaa = () => {
  return render(
    <MemoryRouter initialEntries={["/paa/123"]}>
      <Routes>
        <Route
          path="/paa/:uuid_paa"
          element={<EdicaoAtaPaa />}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("EdicaoAtaPaa - carregamento da lista de presentes", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.clear();

    getTabelasAtasPaa.mockResolvedValue([]);
    getMembrosCargos.mockResolvedValue([]);
    getAtaPaa.mockResolvedValue({
      data_reuniao: "",
      comentarios: "",
      parecer_conselho: "",
      tipo_reuniao: "ORDINARIA",
      local_reuniao: "",
      presidente_reuniao: "",
      secretario_reuniao: "",
      convocacao: "PRIMEIRA",
      cargo_presidente_reuniao: "",
      cargo_secretaria_reuniao: "",
      retificacoes: "",
      hora_reuniao: "",
      tipo_ata: "APRESENTACAO",
      justificativa_repasses_pendentes: "",
      justificativa: "",
      justificativa_retificacao: "",
    });

    useGetAtaPaaVigente.mockReturnValue({
      ataPaa: {
        uuid: "ata-123",
      },
    });
  });

  it("não busca participantes quando não existe ataUuid", async () => {
    useGetAtaPaaVigente.mockReturnValue({
      ataPaa: null,
    });

    renderEdicaoAtaPaa();

    await waitFor(() => {
      expect(getListaPresentesPaa).not.toHaveBeenCalled();
      expect(getListaPresentesPadraoPaa).not.toHaveBeenCalled();
    });
  });

  it("deve atualizar o presente do membro existente na lista padrão", async () => {
    const listaPresentesAta = [
      {
        identificacao: "111111",
        nome: "João",
        membro: true,
        presente: false,
      },
    ];

    const listaPresentesPadraoAta = [
      {
        identificacao: "111111",
        nome: "João",
        membro: true,
        presente: true,
      },
    ];

    getListaPresentesPaa.mockResolvedValue(listaPresentesAta);
    getListaPresentesPadraoPaa.mockResolvedValue(listaPresentesPadraoAta);

    const { getByTestId } = renderEdicaoAtaPaa();

    await waitFor(() => {
      const lista = JSON.parse(
        getByTestId("lista-presentes").textContent,
      );

      expect(lista).toEqual([
        {
          identificacao: "111111",
          nome: "João",
          membro: true,
          presente: false,
        },
      ]);
    });
  });

  it("deve adicionar um membro que está na lista da ata mas não está na lista padrão", async () => {
    const listaPresentesAta = [
      {
        identificacao: "111111",
        nome: "João",
        membro: true,
        presente: true,
      },
      {
        identificacao: "222222",
        nome: "Maria",
        membro: true,
        presente: true,
      },
    ];

    const listaPresentesPadraoAta = [
      {
        identificacao: "111111",
        nome: "João",
        membro: true,
        presente: true,
      },
    ];

    getListaPresentesPaa.mockResolvedValue(listaPresentesAta);
    getListaPresentesPadraoPaa.mockResolvedValue(listaPresentesPadraoAta);

    const { getByTestId } = renderEdicaoAtaPaa();

    await waitFor(() => {
      const lista = JSON.parse(
        getByTestId("lista-presentes").textContent,
      );

      expect(lista).toHaveLength(2);

      expect(lista).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            identificacao: "111111",
            nome: "João",
          }),
          expect.objectContaining({
            identificacao: "222222",
            nome: "Maria",
          }),
        ]),
      );
    });
  });

  it("não deve adicionar novamente um membro que já existe na lista padrão", async () => {
    const membro = {
      identificacao: "111111",
      nome: "João",
      membro: true,
      presente: true,
    };

    getListaPresentesPaa.mockResolvedValue([
      membro,
    ]);

    getListaPresentesPadraoPaa.mockResolvedValue([
      membro,
    ]);

    const { getByTestId } = renderEdicaoAtaPaa();

    await waitFor(() => {
      const lista = JSON.parse(
        getByTestId("lista-presentes").textContent,
      );

      expect(lista).toHaveLength(1);

      expect(
        lista.filter(
          (participante) =>
            participante.identificacao === "111111",
        ),
      ).toHaveLength(1);
    });
  });

  it("deve adicionar os participantes não membros ao final da lista", async () => {
    const listaPresentesAta = [
      {
        identificacao: "111111",
        nome: "João",
        membro: true,
        presente: true,
      },
      {
        identificacao: "222222",
        nome: "Maria",
        membro: false,
        presente: true,
      },
      {
        identificacao: "333333",
        nome: "Professor",
        membro: false,
        professor_gremio: true,
        presente: true,
      },
    ];

    const listaPresentesPadraoAta = [
      {
        identificacao: "111111",
        nome: "João",
        membro: true,
        presente: true,
      },
    ];

    getListaPresentesPaa.mockResolvedValue(listaPresentesAta);
    getListaPresentesPadraoPaa.mockResolvedValue(listaPresentesPadraoAta);

    const { getByTestId } = renderEdicaoAtaPaa();

    await waitFor(() => {
      const lista = JSON.parse(
        getByTestId("lista-presentes").textContent,
      );

      expect(lista).toHaveLength(3);

      expect(lista).toEqual([
        expect.objectContaining({
          identificacao: "111111",
          membro: true,
        }),
        expect.objectContaining({
          identificacao: "222222",
          membro: false,
        }),
        expect.objectContaining({
          identificacao: "333333",
          professor_gremio: true,
        }),
      ]);
    });
  });

  it("deve manter o professor do grêmio quando ele for um não membro", async () => {
    const professorGremio = {
      identificacao: "333333",
      nome: "Professor do Grêmio",
      membro: false,
      professor_gremio: true,
      presente: true,
    };

    getListaPresentesPaa.mockResolvedValue([
      professorGremio,
    ]);

    getListaPresentesPadraoPaa.mockResolvedValue([]);

    const { getByTestId } = renderEdicaoAtaPaa();

    await waitFor(() => {
      const lista = JSON.parse(
        getByTestId("lista-presentes").textContent,
      );

      expect(lista).toEqual([
        expect.objectContaining({
          identificacao: "333333",
          nome: "Professor do Grêmio",
          professor_gremio: true,
        }),
      ]);
    });
  });

  it("deve adicionar todos os membros novos e os não membros sem duplicar membros existentes", async () => {
    const listaPresentesAta = [
      {
        identificacao: "111111",
        nome: "Membro existente",
        membro: true,
        presente: false,
      },
      {
        identificacao: "222222",
        nome: "Novo membro",
        membro: true,
        presente: true,
      },
      {
        identificacao: "333333",
        nome: "Outro novo membro",
        membro: true,
        presente: false,
      },
      {
        identificacao: "444444",
        nome: "Não membro",
        membro: false,
        presente: true,
      },
    ];

    const listaPresentesPadraoAta = [
      {
        identificacao: "111111",
        nome: "Membro existente",
        membro: true,
        presente: true,
      },
    ];

    getListaPresentesPaa.mockResolvedValue(listaPresentesAta);
    getListaPresentesPadraoPaa.mockResolvedValue(listaPresentesPadraoAta);

    const { getByTestId } = renderEdicaoAtaPaa();

    await waitFor(() => {
      const lista = JSON.parse(
        getByTestId("lista-presentes").textContent,
      );

      expect(lista).toHaveLength(4);

      expect(
        lista.filter(
          (participante) =>
            participante.identificacao === "111111",
        ),
      ).toHaveLength(1);

      expect(
        lista.filter(
          (participante) =>
            participante.identificacao === "222222",
        ),
      ).toHaveLength(1);

      expect(
        lista.filter(
          (participante) =>
            participante.identificacao === "333333",
        ),
      ).toHaveLength(1);

      expect(
        lista.filter(
          (participante) =>
            participante.identificacao === "444444",
        ),
      ).toHaveLength(1);

      expect(
        lista.find(
          (participante) =>
            participante.identificacao === "111111",
        ).presente,
      ).toBe(false);
    });
  });

  it("deve finalizar o carregamento mesmo quando ocorrer erro", async () => {
    const erro = new Error("Erro ao buscar participantes");

    getListaPresentesPaa.mockRejectedValue(erro);
    getListaPresentesPadraoPaa.mockResolvedValue([]);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderEdicaoAtaPaa();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao obter lista de presentes",
        erro,
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
