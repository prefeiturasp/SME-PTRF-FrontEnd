import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getAtividadesEstatutariasDisponiveis,
  getAtividadesEstatutariasPrevistas,
} from "../../../../../../../../../services/escolas/Paa.service";
import { useGetAtividadesEstatutarias } from "../useGetAtividadesEstatutarias";

jest.mock("../../../../../../../../../services/escolas/Paa.service", () => ({
  getAtividadesEstatutariasDisponiveis: jest.fn(),
  getAtividadesEstatutariasPrevistas: jest.fn(),
}));

const PAA_UUID = "paa-uuid-abc";

const makeDisponivel = (overrides = {}) => ({
  uuid: "disp-1",
  nome: "Atividade Disponível",
  tipo_label: "Reunião",
  tipo: "reuniao",
  ano: 2024,
  mes: 3,
  mes_label: "Março",
  status: "pendente",
  status_label: "Pendente",
  paa: "paa-uuid-abc",
  alteracao: null,
  ...overrides,
});

const makePrevista = (overrides = {}) => ({
  uuid: "vinculo-1",
  atividade_estatutaria: {
    uuid: "disp-1",
    nome: "Atividade Prevista",
    tipo_label: "Reunião",
    tipo: "reuniao",
    mes: 3,
    mes_label: "Março",
    status: "concluida",
    status_label: "Concluída",
    paa: "paa-uuid-abc",
  },
  data: "2024-03-15",
  alteracao: null,
  ...overrides,
});

describe("useGetAtividadesEstatutarias", () => {
  let queryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("comportamento geral da query", () => {
    it("não executa a query quando PAA não está no localStorage", () => {
      renderHook(() => useGetAtividadesEstatutarias(), { wrapper });

      expect(getAtividadesEstatutariasDisponiveis).not.toHaveBeenCalled();
      expect(getAtividadesEstatutariasPrevistas).not.toHaveBeenCalled();
    });

    it("não executa a query quando PAA está vazio no localStorage", () => {
      localStorage.setItem("PAA", "");

      renderHook(() => useGetAtividadesEstatutarias(), { wrapper });

      expect(getAtividadesEstatutariasDisponiveis).not.toHaveBeenCalled();
    });

    it("chama ambos os serviços com o paaUuid do localStorage", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      renderHook(() => useGetAtividadesEstatutarias(), { wrapper });

      await waitFor(() =>
        expect(getAtividadesEstatutariasDisponiveis).toHaveBeenCalledWith(PAA_UUID)
      );
      expect(getAtividadesEstatutariasPrevistas).toHaveBeenCalledWith(PAA_UUID);
    });

    it("retorna isLoading true enquanto a requisição está em andamento", () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockReturnValue(new Promise(() => {}));
      getAtividadesEstatutariasPrevistas.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(true);
    });

    it("retorna isError true quando a API falha", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockRejectedValueOnce(
        new Error("Erro ao buscar disponíveis")
      );
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it("retorna atividades vazia e quantidade 0 quando não há dados", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.atividades).toEqual([]);
      expect(result.current.quantidade).toBe(0);
    });

    it("expõe a função refetch", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(typeof result.current.refetch).toBe("function");
    });
  });

  describe("toArray — formatos de payload aceitos", () => {
    it("aceita payload com `results` (formato paginado)", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel();
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce({
        results: [disp],
      });
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));
    });

    it("aceita payload como array direto", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel();
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));
    });

    it("retorna array vazio para payload null", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce(null);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.atividades).toEqual([]);
    });

    it("retorna array vazio para payload que não é array nem tem results", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce({
        data: "formato-desconhecido",
      });
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce({ count: 0 });

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.atividades).toEqual([]);
    });
  });

  describe("normalizaDisponivel", () => {
    it("mapeia campos corretamente para atividade disponível com paa", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel({ paa: "paa-uuid-abc" });
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      const atividade = result.current.atividades[0];
      expect(atividade.uuid).toBe("disp-1");
      expect(atividade.atividadeEstatutariaUuid).toBe("disp-1");
      expect(atividade.descricao).toBe("Atividade Disponível");
      expect(atividade.tipoAtividade).toBe("Reunião");
      expect(atividade.tipoAtividadeKey).toBe("reuniao");
      expect(atividade.mes).toBe(3);
      expect(atividade.mesLabel).toBe("Março");
      expect(atividade.status).toBe("pendente");
      expect(atividade.statusLabel).toBe("Pendente");
      expect(atividade.isGlobal).toBe(false);
      expect(atividade.origem).toBe("local");
      expect(atividade.isNovo).toBe(false);
      expect(atividade.emEdicao).toBe(false);
      expect(atividade.vinculoUuid).toBeNull();
      expect(atividade.data).toBe("");
    });

    it("marca isGlobal=true e origem=global quando paa é falsy", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel({ paa: null });
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      const atividade = result.current.atividades[0];
      expect(atividade.isGlobal).toBe(true);
      expect(atividade.origem).toBe("global");
    });

    it("usa string vazia para campos ausentes (nome, tipo_label, mes_label, status_label)", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = { uuid: "disp-sem-campos", paa: null };
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      const atividade = result.current.atividades[0];
      expect(atividade.descricao).toBe("");
      expect(atividade.tipoAtividade).toBe("");
      expect(atividade.mesLabel).toBe("");
      expect(atividade.statusLabel).toBe("");
      expect(atividade.ano).toBe("");
      expect(atividade.mes).toBe("");
      expect(atividade.status).toBeNull();
    });
  });

  describe("normalizaPrevista", () => {
    it("mapeia campos de atividade_estatutaria corretamente", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = makePrevista();
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      const atividade = result.current.atividades[0];
      expect(atividade.atividadeEstatutariaUuid).toBe("disp-1");
      expect(atividade.vinculoUuid).toBe("vinculo-1");
      expect(atividade.data).toBe("2024-03-15");
      expect(atividade.isGlobal).toBe(false);
      expect(atividade.origem).toBe("local");
      expect(atividade.isNovo).toBe(false);
      expect(atividade.emEdicao).toBe(false);
    });

    it("marca isGlobal=true quando atividade_estatutaria.paa é falsy", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = makePrevista({
        atividade_estatutaria: {
          uuid: "ativ-global",
          paa: null,
          nome: "Global",
          tipo_label: "",
          tipo: "",
          mes: 1,
          mes_label: "Janeiro",
          status: null,
          status_label: "",
        },
      });
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].isGlobal).toBe(true);
      expect(result.current.atividades[0].origem).toBe("global");
    });

    it("usa uuid da prevista quando não há atividade_estatutaria (isGlobal=false)", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = {
        uuid: "prev-direto",
        descricao: "Prevista Direta",
        tipo_label: "Workshop",
        tipo: "workshop",
        mes: 5,
        mes_label: "Maio",
        status: null,
        status_label: "",
        data: "2024-05-10",
        alteracao: null,
      };
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      const atividade = result.current.atividades[0];
      expect(atividade.uuid).toBe("prev-direto");
      expect(atividade.atividadeEstatutariaUuid).toBe("prev-direto");
      expect(atividade.vinculoUuid).toBe("prev-direto");
      expect(atividade.isGlobal).toBe(false);
    });

    it("usa data_prevista quando data está ausente", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = {
        uuid: "prev-data-prevista",
        data_prevista: "2024-07-20",
        mes_label: "Julho",
        alteracao: null,
      };
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].data).toBe("2024-07-20");
    });

    it("usa dataPrevista quando data e data_prevista estão ausentes", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = {
        uuid: "prev-dataPrevista",
        dataPrevista: "2024-08-10",
        mes_label: "Agosto",
        alteracao: null,
      };
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].data).toBe("2024-08-10");
    });

    it("usa nome quando descricao está ausente", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = {
        uuid: "prev-nome",
        nome: "Atividade pelo Nome",
        mes_label: "Setembro",
        alteracao: null,
      };
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].descricao).toBe("Atividade pelo Nome");
    });

    it("usa descricao_atividade quando descricao e nome estão ausentes", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = {
        uuid: "prev-descricao-atividade",
        descricao_atividade: "Atividade por descricao_atividade",
        mes_label: "Outubro",
        alteracao: null,
      };
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].descricao).toBe("Atividade por descricao_atividade");
    });

    it("usa tipoAtividade quando tipo_label está ausente", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = {
        uuid: "prev-tipo-atividade",
        tipoAtividade: "Palestra",
        mes_label: "Novembro",
        alteracao: null,
      };
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].tipoAtividade).toBe("Palestra");
    });

    it("usa tipoAtividadeKey quando tipo está ausente", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = {
        uuid: "prev-tipo-key",
        tipoAtividadeKey: "palestra",
        mes_label: "Dezembro",
        alteracao: null,
      };
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].tipoAtividadeKey).toBe("palestra");
    });
  });

  describe("mergeAtividades — lógica de mesclagem", () => {
    it("mescla disponível com prevista correspondente pelo uuid", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel({ uuid: "disp-1" });
      const prev = makePrevista();
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      const atividade = result.current.atividades[0];
      expect(atividade.uuid).toBe("disp-1");
      expect(atividade.vinculoUuid).toBe("vinculo-1");
      expect(atividade.data).toBe("2024-03-15");
    });

    it("mantém disponível sem prevista correspondente", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel({ uuid: "disp-sem-prevista" });
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].uuid).toBe("disp-sem-prevista");
      expect(result.current.atividades[0].vinculoUuid).toBeNull();
    });

    it("adiciona prevista órfã que não tem disponível correspondente", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([]);
      const prev = makePrevista();
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].vinculoUuid).toBe("vinculo-1");
    });

    it("resultado contém disponíveis + previstas órfãs sem duplicatas", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp1 = makeDisponivel({ uuid: "disp-1" });
      const disp2 = makeDisponivel({ uuid: "disp-2", nome: "Atividade 2" });
      const prev1 = makePrevista();
      const prev2 = makePrevista({
        uuid: "vinculo-orfao",
        atividade_estatutaria: {
          uuid: "orfao-1",
          paa: "paa-uuid-abc",
          nome: "Órfã",
          tipo_label: "",
          tipo: "",
          mes: 6,
          mes_label: "Junho",
          status: null,
          status_label: "",
        },
        data: "2024-06-01",
      });
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp1, disp2]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev1, prev2]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(3));

      const uuids = result.current.atividades.map((a) => a.uuid);
      expect(uuids).toContain("disp-1");
      expect(uuids).toContain("disp-2");
      expect(uuids).toContain("orfao-1");
    });

    it("usa campos do disponível como fallback quando campos da prevista são vazios", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel({
        uuid: "disp-fallback",
        nome: "Descrição do Disp",
        tipo_label: "Tipo Disp",
        tipo: "tipo_disp_key",
        mes_label: "Fevereiro",
        status_label: "Status Disp",
      });
      const prev = makePrevista({
        atividade_estatutaria: {
          uuid: "disp-fallback",
          paa: "paa-uuid-abc",
          nome: "",
          tipo_label: "",
          tipo: "",
          mes: 2,
          mes_label: "",
          status: null,
          status_label: "",
        },
        data: "",
      });
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      const atividade = result.current.atividades[0];
      expect(atividade.descricao).toBe("Descrição do Disp");
      expect(atividade.tipoAtividade).toBe("Tipo Disp");
      expect(atividade.tipoAtividadeKey).toBe("tipo_disp_key");
      expect(atividade.mesLabel).toBe("Fevereiro");
      expect(atividade.statusLabel).toBe("Status Disp");
    });

    it("retorna quantidade igual ao número de atividades mescladas", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disponiveis = [
        makeDisponivel({ uuid: "d1" }),
        makeDisponivel({ uuid: "d2", nome: "D2" }),
        makeDisponivel({ uuid: "d3", nome: "D3" }),
      ];
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce(disponiveis);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(3));

      expect(result.current.atividades).toHaveLength(3);
    });
  });

  describe("montarMesAno", () => {
    it("constrói mesAno no formato 'MesLabel/Ano' quando há data válida", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel({ uuid: "disp-1", mes_label: "Março" });
      const prev = makePrevista({ data: "2024-03-15" });
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].mesAno).toBe("Março/2024");
    });

    it("usa só o mesLabel quando não há data", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel({
        uuid: "disp-sem-prevista",
        mes_label: "Abril",
      });
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].mesAno).toBe("Abril");
    });

    it("retorna string vazia quando não há mesLabel nem data", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = { uuid: "disp-vazio", paa: null };
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].mesAno).toBe("");
    });

    it("usa só o mesLabel quando a data é inválida (NaN no getFullYear)", async () => {
      localStorage.setItem("PAA", PAA_UUID);
      const disp = makeDisponivel({ uuid: "disp-1", mes_label: "Maio" });
      const prev = makePrevista({
        data: "data-invalida",
        atividade_estatutaria: {
          uuid: "disp-1",
          paa: "paa-uuid-abc",
          nome: "Atividade Prevista",
          tipo_label: "Reunião",
          tipo: "reuniao",
          mes: 5,
          mes_label: "",
          status: "concluida",
          status_label: "Concluída",
        },
      });
      getAtividadesEstatutariasDisponiveis.mockResolvedValueOnce([disp]);
      getAtividadesEstatutariasPrevistas.mockResolvedValueOnce([prev]);

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.quantidade).toBe(1));

      expect(result.current.atividades[0].mesAno).toBe("Maio");
    });
  });

  describe("atividades no estado inicial (sem dado ainda)", () => {
    it("retorna atividades=[] e quantidade=0 antes da query completar", () => {
      localStorage.setItem("PAA", PAA_UUID);
      getAtividadesEstatutariasDisponiveis.mockReturnValue(new Promise(() => {}));
      getAtividadesEstatutariasPrevistas.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useGetAtividadesEstatutarias(), {
        wrapper,
      });

      expect(result.current.atividades).toEqual([]);
      expect(result.current.quantidade).toBe(0);
    });
  });
});
