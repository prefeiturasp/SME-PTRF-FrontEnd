import { metodosAuxiliares, apenasNumero } from "../metodosAuxiliares";
import { deleteDespesa, getNomeRazaoSocial } from "../../../../services/escolas/Despesas.service";
import { getVerificarSaldo } from "../../../../services/escolas/RateiosDespesas.service";

jest.mock("../../../../services/escolas/Despesas.service", () => ({
  deleteDespesa: jest.fn(),
  getNomeRazaoSocial: jest.fn(),
}));

jest.mock("../../../../services/escolas/RateiosDespesas.service", () => ({
  getVerificarSaldo: jest.fn(),
}));

describe("metodosAuxiliares", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore?.();
  });

  describe("modais e handlers simples", () => {
    it("onShowModal define show como true", () => {
      const setShow = jest.fn();
      metodosAuxiliares.onShowModal(setShow);
      expect(setShow).toHaveBeenCalledWith(true);
    });

    it("onShowAvisoCapitalModal e handleAvisoCapital", () => {
      const setShowAvisoCapital = jest.fn();
      metodosAuxiliares.onShowAvisoCapitalModal(setShowAvisoCapital);
      expect(setShowAvisoCapital).toHaveBeenCalledWith(true);

      setShowAvisoCapital.mockClear();
      metodosAuxiliares.handleAvisoCapital("CAPITAL", setShowAvisoCapital);
      expect(setShowAvisoCapital).toHaveBeenCalledWith(true);

      setShowAvisoCapital.mockClear();
      metodosAuxiliares.handleAvisoCapital("CUSTEIO", setShowAvisoCapital);
      expect(setShowAvisoCapital).not.toHaveBeenCalled();
    });

    it("onHandleClose fecha todos os modais", () => {
      const setters = Array.from({ length: 7 }, () => jest.fn());
      metodosAuxiliares.onHandleClose(...setters);
      setters.forEach((fn) => expect(fn).toHaveBeenCalledWith(false));
    });

    it("onShowErroGeral define showErroGeral como true", () => {
      const setShowErroGeral = jest.fn();
      metodosAuxiliares.onShowErroGeral(setShowErroGeral);
      expect(setShowErroGeral).toHaveBeenCalledWith(true);
    });
  });

  describe("onShowDeleteModal", () => {
    const setShowDelete = jest.fn();
    const setShowTextoModalDelete = jest.fn();

    beforeEach(() => {
      setShowDelete.mockClear();
      setShowTextoModalDelete.mockClear();
    });

    it("mensagem padrão sem estorno nem imposto", () => {
      metodosAuxiliares.onShowDeleteModal(setShowDelete, setShowTextoModalDelete, {
        retem_imposto: false,
        rateios: [{}],
      });
      expect(setShowTextoModalDelete).toHaveBeenCalledWith(
        expect.stringContaining("Tem certeza que deseja excluir esta despesa")
      );
      expect(setShowDelete).toHaveBeenCalledWith(true);
    });

    it("mensagem com estorno", () => {
      metodosAuxiliares.onShowDeleteModal(setShowDelete, setShowTextoModalDelete, {
        retem_imposto: false,
        rateios: [{ estorno: { uuid: "e1" } }],
      });
      expect(setShowTextoModalDelete).toHaveBeenCalledWith(
        expect.stringContaining("crédito de estorno vinculado")
      );
    });

    it("mensagem com imposto", () => {
      metodosAuxiliares.onShowDeleteModal(setShowDelete, setShowTextoModalDelete, {
        retem_imposto: true,
        rateios: [{}],
      });
      expect(setShowTextoModalDelete).toHaveBeenCalledWith(
        expect.stringContaining("imposto retido")
      );
    });

    it("mensagem com estorno e imposto", () => {
      metodosAuxiliares.onShowDeleteModal(setShowDelete, setShowTextoModalDelete, {
        retem_imposto: true,
        rateios: [{ estorno: { uuid: "e1" } }],
      });
      expect(setShowTextoModalDelete).toHaveBeenCalledWith(
        expect.stringContaining("estorno vinculado e do imposto vinculado")
      );
    });
  });

  describe("onDeletarTrue", () => {
    const originalAssign = window.location.assign;
    const originalAlert = window.alert;

    beforeEach(() => {
      delete window.location;
      window.location = { assign: jest.fn(), pathname: "/cadastro-de-despesa" };
      window.alert = jest.fn();
    });

    afterEach(() => {
      window.location.assign = originalAssign;
      window.alert = originalAlert;
    });

    it("deleta despesa e redireciona", async () => {
      deleteDespesa.mockResolvedValue({});
      const setShowDelete = jest.fn();
      const setLoading = jest.fn();

      metodosAuxiliares.onDeletarTrue(setShowDelete, setLoading, { idDespesa: "d1" }, undefined);

      expect(setShowDelete).toHaveBeenCalledWith(false);
      expect(setLoading).toHaveBeenCalledWith(true);

      await Promise.resolve();
      expect(deleteDespesa).toHaveBeenCalledWith("d1");
      expect(window.location.assign).toHaveBeenCalledWith("/lista-de-despesas");
    });

    it("trata erro na exclusão", async () => {
      deleteDespesa.mockRejectedValue(new Error("falha"));
      const setShowDelete = jest.fn();
      const setLoading = jest.fn();

      metodosAuxiliares.onDeletarTrue(setShowDelete, setLoading, { idDespesa: "d1" }, undefined);

      await new Promise((r) => setTimeout(r, 0));
      expect(setLoading).toHaveBeenCalledWith(false);
      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe("getPath e onCancelarTrue", () => {
    beforeEach(() => {
      delete window.location;
      window.location = { assign: jest.fn(), pathname: "/atual" };
    });

    it("redireciona para lista quando origem é undefined", () => {
      metodosAuxiliares.getPath(undefined);
      expect(window.location.assign).toHaveBeenCalledWith("/lista-de-despesas");
      expect(sessionStorage.getItem("previousPath")).toBe("/atual");
    });

    it("redireciona para detalhe das prestações quando há origem", () => {
      metodosAuxiliares.getPath("/outra");
      expect(window.location.assign).toHaveBeenCalledWith("/detalhe-das-prestacoes");
    });

    it("monta path com âncora para análise de lançamento UE", () => {
      const parametroLocation = {
        state: {
          origem_visao: "UE",
          origem: "/consulta-detalhamento-analise-da-dre",
          uuid_pc: "pc-1",
          operacao: "requer_inclusao_documento_gasto",
        },
      };
      metodosAuxiliares.getPath("/consulta-detalhamento-analise-da-dre", parametroLocation);
      expect(window.location.assign).toHaveBeenCalledWith(
        "/consulta-detalhamento-analise-da-dre/pc-1#tabela-acertos-documentos"
      );
    });

    it("monta path com âncora de lançamentos para atualização", () => {
      const parametroLocation = {
        state: {
          origem_visao: "UE",
          origem: "/consulta-detalhamento-analise-da-dre",
          uuid_pc: "pc-1",
          operacao: "requer_atualizacao_lancamento_gasto",
        },
      };
      metodosAuxiliares.getPath("/consulta-detalhamento-analise-da-dre", parametroLocation);
      expect(window.location.assign).toHaveBeenCalledWith(
        "/consulta-detalhamento-analise-da-dre/pc-1#tabela-acertos-lancamentos"
      );
    });

    it("onCancelarTrue fecha modal, ativa loading e redireciona", () => {
      const setShow = jest.fn();
      const setLoading = jest.fn();
      metodosAuxiliares.onCancelarTrue(setShow, setLoading, undefined);
      expect(setShow).toHaveBeenCalledWith(false);
      expect(setLoading).toHaveBeenCalledWith(true);
      expect(window.location.assign).toHaveBeenCalledWith("/lista-de-despesas");
    });
  });

  describe("verificarSaldo e get_nome_razao_social", () => {
    it("verificarSaldo chama serviço com id da despesa", async () => {
      getVerificarSaldo.mockResolvedValue({ ok: true });
      const result = await metodosAuxiliares.verificarSaldo({ a: 1 }, { idDespesa: "d1" });
      expect(getVerificarSaldo).toHaveBeenCalledWith({ a: 1 }, "d1");
      expect(result).toEqual({ ok: true });
    });

    it("get_nome_razao_social preenche nome quando não informado", async () => {
      getNomeRazaoSocial.mockResolvedValue([{ nome: "Fornecedor X" }]);
      const setFieldValue = jest.fn();
      await metodosAuxiliares.get_nome_razao_social("123", setFieldValue, "");
      expect(setFieldValue).toHaveBeenCalledWith("nome_fornecedor", "Fornecedor X");
    });

    it("get_nome_razao_social não altera quando nome já existe", async () => {
      const setFieldValue = jest.fn();
      await metodosAuxiliares.get_nome_razao_social("123", setFieldValue, "Já tem");
      expect(getNomeRazaoSocial).not.toHaveBeenCalled();
      expect(setFieldValue).not.toHaveBeenCalled();
    });
  });

  describe("documentos de transação", () => {
    const tabelas = {
      tipos_transacao: [
        { id: 1, nome: "Cheque", tem_documento: true },
        { id: 2, nome: "PIX", tem_documento: false },
      ],
    };

    it("exibeDocumentoTransacao mostra documento quando tipo exige", () => {
      const setCss = jest.fn();
      const setLabel = jest.fn();
      metodosAuxiliares.exibeDocumentoTransacao(1, setCss, setLabel, tabelas);
      expect(setCss).toHaveBeenCalledWith("");
      expect(setLabel).toHaveBeenCalledWith("Cheque");
    });

    it("exibeDocumentoTransacao esconde quando tipo não exige documento", () => {
      const setCss = jest.fn();
      const setLabel = jest.fn();
      metodosAuxiliares.exibeDocumentoTransacao(2, setCss, setLabel, tabelas);
      expect(setCss).toHaveBeenCalledWith("escondeItem");
    });

    it("exibeDocumentoTransacao esconde sem valor", () => {
      const setCss = jest.fn();
      const setLabel = jest.fn();
      metodosAuxiliares.exibeDocumentoTransacao(null, setCss, setLabel, tabelas);
      expect(setCss).toHaveBeenCalledWith("escondeItem");
    });

    it("exibeDocumentoTransacaoImposto atualiza por índice", () => {
      const setCss = jest.fn();
      const setLabel = jest.fn();
      metodosAuxiliares.exibeDocumentoTransacaoImposto(
        1,
        setLabel,
        {},
        setCss,
        {},
        tabelas,
        0
      );
      expect(setCss).toHaveBeenCalledWith({ 0: "" });
      expect(setLabel).toHaveBeenCalledWith({ 0: "Cheque" });
    });

    it("exibeDocumentoTransacaoImposto esconde sem valor", () => {
      const setCss = jest.fn();
      const setLabel = jest.fn();
      metodosAuxiliares.exibeDocumentoTransacaoImposto(
        null,
        setLabel,
        {},
        setCss,
        {},
        tabelas,
        1
      );
      expect(setCss).toHaveBeenCalledWith({ 1: "escondeItem" });
    });

    it("documentoTransacaoObrigatorio retorna true/false conforme tipo", () => {
      expect(metodosAuxiliares.documentoTransacaoObrigatorio(1, tabelas)).toBe(true);
      expect(metodosAuxiliares.documentoTransacaoObrigatorio({ id: 2 }, tabelas)).toBe(false);
      expect(metodosAuxiliares.documentoTransacaoObrigatorio(null, tabelas)).toBe(false);
    });
  });

  describe("valores e rateios", () => {
    it("setValorRealizado e limpaTipoDespesaCusteio", () => {
      const setFieldValue = jest.fn();
      metodosAuxiliares.setValorRealizado(setFieldValue, "10,50");
      expect(setFieldValue).toHaveBeenCalledWith("valor_total", expect.any(Number));

      metodosAuxiliares.limpaTipoDespesaCusteio(setFieldValue, 0);
      expect(setFieldValue).toHaveBeenCalledWith("rateios[0].tipo_custeio", null);
      expect(setFieldValue).toHaveBeenCalledWith(
        "rateios[0].especificacao_material_servico",
        ""
      );
    });

    it("setaValoresCusteioCapital preenche quando mais_de_um_tipo_de_despesa é nao", () => {
      const setFieldValue = jest.fn();
      const values = {
        valor_total: "100,00",
        valor_recursos_proprios: "0,00",
        rateios: [{}],
      };
      metodosAuxiliares.setaValoresCusteioCapital("nao", values, setFieldValue);
      expect(setFieldValue).toHaveBeenCalledWith("rateios[0].valor_rateio", expect.any(Number));
      expect(setFieldValue).toHaveBeenCalledWith("rateios[0].quantidade_itens_capital", "");
    });

    it("setaValoresCusteioCapital não altera quando mais de um tipo", () => {
      const setFieldValue = jest.fn();
      metodosAuxiliares.setaValoresCusteioCapital("sim", {}, setFieldValue);
      expect(setFieldValue).not.toHaveBeenCalled();
    });

    it("getErroValorOriginalRateios e getErroValorRealizadoRateios calculam diferença", () => {
      const values = {
        valor_total: "100,00",
        valor_recursos_proprios: "0,00",
        valor_original: "100,00",
        valor_recursos_proprios_original: "0,00",
        retem_imposto: false,
        rateios: [
          {
            aplicacao_recurso: "CUSTEIO",
            valor_original: "40,00",
            valor_rateio: "40,00",
          },
        ],
      };
      expect(typeof metodosAuxiliares.getErroValorOriginalRateios(values)).toBe("number");
      expect(typeof metodosAuxiliares.getErroValorRealizadoRateios(values)).toBe("number");
    });

    it("getErroValorRealizadoRateios considera imposto retido", () => {
      const values = {
        valor_total: "100,00",
        valor_recursos_proprios: "0,00",
        retem_imposto: true,
        despesas_impostos: [
          {
            rateios: [{ valor_rateio: "10,00" }],
          },
        ],
        rateios: [{ valor_rateio: "90,00" }],
      };
      const erro = metodosAuxiliares.getErroValorRealizadoRateios(values);
      expect(erro).toBe(0);
    });
  });

  describe("apenasNumero e onHandleChangeApenasNumero", () => {
    it("valida apenas números", () => {
      expect(apenasNumero("123")).toBe(true);
      expect(apenasNumero("")).toBe(true);
      expect(apenasNumero("12a")).toBe(false);
    });

    it("onHandleChangeApenasNumero seta valor válido", () => {
      const setFieldValue = jest.fn();
      metodosAuxiliares.onHandleChangeApenasNumero(
        { target: { value: "99" } },
        setFieldValue,
        "campo"
      );
      expect(setFieldValue).toHaveBeenCalledWith("campo", "99");
    });

    it("onHandleChangeApenasNumero ignora valor inválido", () => {
      const setFieldValue = jest.fn();
      metodosAuxiliares.onHandleChangeApenasNumero(
        { target: { value: "9a" } },
        setFieldValue,
        "campo"
      );
      expect(setFieldValue).not.toHaveBeenCalled();
    });
  });

  describe("origem análise e operações", () => {
    it("origemAnaliseLancamento UE e DRE", () => {
      expect(metodosAuxiliares.origemAnaliseLancamento(null)).toBe(false);
      expect(metodosAuxiliares.origemAnaliseLancamento({})).toBe(false);
      expect(
        metodosAuxiliares.origemAnaliseLancamento({
          state: {
            origem_visao: "UE",
            origem: "/consulta-detalhamento-analise-da-dre",
          },
        })
      ).toBe(true);
      expect(
        metodosAuxiliares.origemAnaliseLancamento({
          state: { origem_visao: "UE", origem: "/outra" },
        })
      ).toBe(false);
      expect(
        metodosAuxiliares.origemAnaliseLancamento({
          state: {
            origem_visao: "DRE",
            origem: "/dre-detalhe-prestacao-de-contas-resumo-acertos",
          },
        })
      ).toBe(true);
      expect(
        metodosAuxiliares.origemAnaliseLancamento({
          state: { origem_visao: "DRE", origem: "/outra" },
        })
      ).toBe(false);
      expect(
        metodosAuxiliares.origemAnaliseLancamento({
          state: { origem_visao: "SME" },
        })
      ).toBe(false);
    });

    it("temPermissaoEdicao e flags de operação", () => {
      expect(metodosAuxiliares.temPermissaoEdicao({ state: { tem_permissao_de_edicao: true } })).toBe(
        true
      );
      expect(metodosAuxiliares.temPermissaoEdicao({})).toBe(false);

      expect(
        metodosAuxiliares.ehOperacaoAtualizacao({
          state: { operacao: "requer_atualizacao_lancamento_gasto" },
        })
      ).toBe(true);
      expect(metodosAuxiliares.ehOperacaoAtualizacao({})).toBe(false);

      expect(
        metodosAuxiliares.ehOperacaoExclusao({
          state: { operacao: "requer_exclusao_lancamento_gasto" },
        })
      ).toBe(true);
      expect(metodosAuxiliares.ehOperacaoExclusao({})).toBe(false);
    });
  });

  describe("conciliação e bloqueios", () => {
    it("mantemConciliacaoAtual marca rateios", () => {
      const values = { rateios: [{}, {}] };
      metodosAuxiliares.mantemConciliacaoAtual(values);
      expect(values.rateios.every((r) => r.update_conferido === true)).toBe(true);
    });

    it("mantemConciliacaoAtualImposto marca rateios do imposto", () => {
      const despesa = { rateios: [{}] };
      metodosAuxiliares.mantemConciliacaoAtualImposto(despesa);
      expect(despesa.rateios[0].update_conferido).toBe(true);
    });

    it("bloqueiaCamposDespesaPrincipal para DRE sem permissão", () => {
      const setReadOnlyCampos = jest.fn();
      const setReadOnlyBtnAcao = jest.fn();
      metodosAuxiliares.bloqueiaCamposDespesaPrincipal(
        {
          state: {
            tem_permissao_de_edicao: false,
            origem_visao: "DRE",
            operacao: "requer_atualizacao_lancamento_gasto",
          },
        },
        setReadOnlyCampos,
        setReadOnlyBtnAcao
      );
      expect(setReadOnlyCampos).toHaveBeenCalledWith(true);
      expect(setReadOnlyBtnAcao).toHaveBeenCalledWith(true);
    });

    it("bloqueiaCamposDespesaImposto quando sem permissão", () => {
      const setReadOnlyCamposImposto = jest.fn((updater) =>
        typeof updater === "function" ? updater({}) : updater
      );
      const setDisableBtnAdicionarImposto = jest.fn();
      metodosAuxiliares.bloqueiaCamposDespesaImposto(
        { state: { tem_permissao_de_edicao: false } },
        setReadOnlyCamposImposto,
        setDisableBtnAdicionarImposto,
        { initialValues: { despesas_impostos: [{}] } }
      );
      expect(setDisableBtnAdicionarImposto).toHaveBeenCalledWith(true);
      expect(setReadOnlyCamposImposto).toHaveBeenCalled();
    });

    it("validaConciliacao concilia novos rateios quando existentes estão conciliados", () => {
      const values = {
        rateios: [
          { uuid: "r1", conferido: true },
          { uuid: undefined, conferido: false },
        ],
      };
      metodosAuxiliares.validaConciliacao(values, { id: 10 });
      expect(values.rateios[1].conferido).toBe(true);
      expect(values.rateios[1].periodo_conciliacao).toBe(10);
    });

    it("conciliaRateios marca todos os rateios", () => {
      const values = { rateios: [{}, {}] };
      metodosAuxiliares.conciliaRateios(values, { id: 5 });
      expect(values.rateios[0].conferido).toBe(true);
      expect(values.rateios[1].periodo_conciliacao).toBe(5);
    });
  });

  describe("mostraBotaoDeletar", () => {
    it("retorna false sem permissão de edição", () => {
      expect(
        metodosAuxiliares.mostraBotaoDeletar("id", {
          state: { tem_permissao_de_edicao: false },
        })
      ).toBe(false);
    });

    it("em análise de lançamento, só exclusão mostra botão", () => {
      const base = {
        origem_visao: "UE",
        origem: "/consulta-detalhamento-analise-da-dre",
        tem_permissao_de_edicao: true,
      };
      expect(
        metodosAuxiliares.mostraBotaoDeletar("id", {
          state: { ...base, operacao: "requer_exclusao_lancamento_gasto" },
        })
      ).toBe(true);
      expect(
        metodosAuxiliares.mostraBotaoDeletar("id", {
          state: { ...base, operacao: "requer_atualizacao_lancamento_gasto" },
        })
      ).toBe(false);
      expect(
        metodosAuxiliares.mostraBotaoDeletar("id", {
          state: { ...base, operacao: "requer_inclusao_documento_gasto" },
        })
      ).toBe(false);
    });

    it("fora da análise, depende de idDespesa", () => {
      expect(metodosAuxiliares.mostraBotaoDeletar("id", null)).toBe(true);
      expect(metodosAuxiliares.mostraBotaoDeletar(null, null)).toBe(false);
    });
  });
});
