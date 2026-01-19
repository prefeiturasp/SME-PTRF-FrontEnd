import { metodosAuxiliares } from "../../componentes/escolas/Despesas/metodosAuxiliares";
import { ASSOCIACAO_UUID } from "../../services/auth.service";
import { getPeriodoFechado } from "../../services/escolas/Associacao.service";
import { 
    exibeValorFormatadoPT_BR, 
    exibeDataPT_BR, 
    exibeDateTimePT_BR, 
    exibeDateTimePT_BR_Ata,
    trataNumericos,
    convertToNumber,
    round,
    calculaValorRateio,
    calculaValorOriginal,
    calculaValorRecursoAcoes,
    cpfMaskContitional, 
    processoIncorporacaoMask, 
    valida_cpf_cnpj, 
    valida_cpf_cnpj_permitindo_cnpj_zerado,
    getTextoStatusPeriodo, 
    getCorStatusPeriodo, 
    slugify,
    gerarUuid,
    comparaObjetos,
    valida_cpf_exportado,
    apenasNumero,
    formataNomeDRE,
    periodoFechadoImposto,
    periodoFechado,
    validaPayloadDespesas
} from "../ValidacoesAdicionaisFormularios";

import moment from "moment";

jest.mock("../../services/escolas/Associacao.service", () => ({
    getPeriodoFechado: jest.fn(),
}));

var localStorageMock = (function() {

    return {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    }; 
  })();
  
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe("Verificação de período fechado", () => {
    let setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral;
  
    beforeEach(() => {
      setReadOnlyBtnAcao = jest.fn();
      setShowPeriodoFechado = jest.fn();
      setReadOnlyCampos = jest.fn();
      onShowErroGeral = jest.fn();
    });
  
    test("Define campos como somente leitura quando o período está fechado", async () => {
      getPeriodoFechado.mockResolvedValue({ aceita_alteracoes: false });
  
      await periodoFechado("2024-02-15", setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral);
  
      expect(setReadOnlyBtnAcao).toHaveBeenCalledWith(true);
      expect(setShowPeriodoFechado).toHaveBeenCalledWith(true);
      expect(setReadOnlyCampos).toHaveBeenCalledWith(true);
    });
  
    test("Permite alterações quando o período não está fechado", async () => {
      getPeriodoFechado.mockResolvedValue({ aceita_alteracoes: true });
  
      await periodoFechado("2024-02-15", setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral);
  
      expect(setReadOnlyBtnAcao).toHaveBeenCalledWith(false);
      expect(setShowPeriodoFechado).toHaveBeenCalledWith(false);
      expect(setReadOnlyCampos).toHaveBeenCalledWith(false);
    });
  
    test("Trata erro ao buscar período fechado", async () => {
      getPeriodoFechado.mockRejectedValue(new Error("Erro ao buscar"));
  
      await periodoFechado("2024-02-15", setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral);
  
      expect(setReadOnlyBtnAcao).toHaveBeenCalledWith(true);
      expect(setShowPeriodoFechado).toHaveBeenCalledWith(true);
      expect(setReadOnlyCampos).toHaveBeenCalledWith(true);
      expect(onShowErroGeral).toHaveBeenCalled();
    });
  });

describe("Verificação de período fechado de imposto", () => {
    let setReadOnlyBtnAcao, setShowPeriodoFechadoImposto, setReadOnlyCamposImposto, setDisableBtnAdicionarImposto, onShowErroGeral;
  
    beforeEach(() => {
      setReadOnlyBtnAcao = jest.fn();
      setShowPeriodoFechadoImposto = jest.fn();
      setReadOnlyCamposImposto = jest.fn();
      setDisableBtnAdicionarImposto = jest.fn();
      onShowErroGeral = jest.fn();
    });
  
    test("Define campos como somente leitura quando o período está fechado", async () => {
      getPeriodoFechado.mockResolvedValue({ aceita_alteracoes: false });
  
      const despesas_impostos = [{ data_transacao: "2024-02-15" }];
      await periodoFechadoImposto(despesas_impostos, setReadOnlyBtnAcao, setShowPeriodoFechadoImposto, setReadOnlyCamposImposto, setDisableBtnAdicionarImposto, onShowErroGeral);
  
      expect(setReadOnlyBtnAcao).toHaveBeenCalledWith(true);
      expect(setShowPeriodoFechadoImposto).toHaveBeenCalledWith(true);
      expect(setReadOnlyCamposImposto).toHaveBeenCalled();
      expect(setDisableBtnAdicionarImposto).toHaveBeenCalledWith(true);
    });
  
    test("Permite alterações quando o período não está fechado", async () => {
      getPeriodoFechado.mockResolvedValue({ aceita_alteracoes: true });
  
      const despesas_impostos = [{ data_transacao: "2024-02-15" }];
      await periodoFechadoImposto(despesas_impostos, setReadOnlyBtnAcao, setShowPeriodoFechadoImposto, setReadOnlyCamposImposto, setDisableBtnAdicionarImposto, onShowErroGeral);
  
      expect(setReadOnlyBtnAcao).toHaveBeenCalledWith(false);
      expect(setShowPeriodoFechadoImposto).toHaveBeenCalledWith(false);
      expect(setReadOnlyCamposImposto).toHaveBeenCalled();
      expect(setDisableBtnAdicionarImposto).toHaveBeenCalledWith(false);
    });
  
    test("Trata erro ao buscar período fechado", async () => {
      getPeriodoFechado.mockRejectedValue(new Error("Erro ao buscar"));
  
      const despesas_impostos = [{ data_transacao: "2024-02-15" }];
      await periodoFechadoImposto(despesas_impostos, setReadOnlyBtnAcao, setShowPeriodoFechadoImposto, setReadOnlyCamposImposto, setDisableBtnAdicionarImposto, onShowErroGeral);
  
      expect(setReadOnlyBtnAcao).toHaveBeenCalledWith(true);
      expect(setShowPeriodoFechadoImposto).toHaveBeenCalledWith(true);
      expect(setReadOnlyCamposImposto).toHaveBeenCalled();
      expect(setDisableBtnAdicionarImposto).toHaveBeenCalledWith(true);
      expect(onShowErroGeral).toHaveBeenCalled();
    });
});

describe("validaPayloadDespesas", () => {
  it("deve limpar documento_transacao se tipo_transacao não exigir", () => {
    const values = { rateios: [], tipo_transacao: { id: 1 }, documento_transacao: "12345" };
    const despesasTabelas = { tipos_transacao: [{ id: 1, tem_documento: false }] };
    
    const resultado = validaPayloadDespesas(values, despesasTabelas);
    expect(resultado.documento_transacao).toBe("");
  });

  it("deve manter documento_transacao se tipo_transacao exigir", () => {
    const values = { rateios: [], tipo_transacao: { id: 2 }, documento_transacao: "12345" };
    const despesasTabelas = { tipos_transacao: [{ id: 2, tem_documento: true }] };
    
    const resultado = validaPayloadDespesas(values, despesasTabelas);
    expect(resultado.documento_transacao).toBe("12345");
  });

  it("deve atualizar values.tipo_documento se for um objeto", () => {
    const values = { rateios: [], tipo_documento: {id: "5"}};
    const resultado = validaPayloadDespesas(values);
    expect(resultado.tipo_documento).toBe("5");
  });

  test("deve atualizar values.associacao se for um objeto", () => { 
    const values = { rateios: [], tipo_documento: {id: "5"}, associacao: {}};
    
    validaPayloadDespesas(values);

    expect(localStorageMock.getItem).toHaveBeenCalledWith(ASSOCIACAO_UUID);
  });
  
  it("deve converter tipo_documento e tipo_transacao para número", () => {
    const values = { rateios: [], tipo_documento: "5", tipo_transacao: "3" };
    const resultado = validaPayloadDespesas(values);
    expect(resultado.tipo_documento).toBe(5);
    expect(resultado.tipo_transacao).toBe(3);
  });

  it("deve converter datas para o formato YYYY-MM-DD ou atribuir null caso não preenchidas", () => {
    let values = { rateios: [], data_documento: "2024-07-01", data_transacao: "2024-07-02" };
    let resultado = validaPayloadDespesas(values);
    expect(resultado.data_documento).toBe(moment("2024-07-01").format("YYYY-MM-DD"));
    expect(resultado.data_transacao).toBe(moment("2024-07-02").format("YYYY-MM-DD"));

    values = { rateios: [], data_documento: "", data_transacao: "" };
    resultado = validaPayloadDespesas(values);
    expect(resultado.data_documento).toBe(null);
    expect(resultado.data_transacao).toBe(null);    
  });

  it("deve tratar valores numéricos corretamente", () => {
    const values = { rateios: [], valor_total: "1000,50", valor_original: "2000,75" };
    const resultado = validaPayloadDespesas(values);
    expect(resultado.valor_total).toBeCloseTo(1000.5, 2);
    expect(resultado.valor_original).toBeCloseTo(2000.75, 2);
  });

  it("deve tratar valores nulos corretamente", () => {
    const values = { rateios: [], tipo_documento: "", tipo_transacao: null };
    const resultado = validaPayloadDespesas(values);
    expect(resultado.tipo_documento).toBeNull();
    expect(resultado.tipo_transacao).toBeNull();
  });

  it("deve tratar valores nulos corretamente em rateios", () => {
    const values = { 
        rateios: [{
            conta_associacao: "",
            acao_associacao: "",
            aplicacao_recurso: "0",
            especificacao_material_servico: "0",
            tipo_custeio: "0",
            tag: ""
        }],
    };
    const resultado = validaPayloadDespesas(values);

    expect(resultado.rateios[0].acao_associacao).toBeNull();
    expect(resultado.rateios[0].conta_associacao).toBeNull();
    expect(resultado.rateios[0].aplicacao_recurso).toBeNull();
    expect(resultado.rateios[0].especificacao_material_servico).toBeNull();
    expect(resultado.rateios[0].tipo_custeio).toBeNull();
    expect(resultado.rateios[0].tag).toBeNull();
  });

  it("deve atribuir corretamente UUID/Id quando objetos em rateios", () => {
    const values = { 
        rateios: [{
            conta_associacao: {uuid: "uuid-fake-conta_associacao"},
            acao_associacao: {uuid: "uuid-fake-acao_associacao"},
            tipo_custeio: {id: "id-fake-tipo_custeio"},
            tag: {uuid: "uuid-fake-tag"},
        }],
    };
    const resultado = validaPayloadDespesas(values);

    expect(resultado.rateios[0].acao_associacao).toBe("uuid-fake-acao_associacao");
    expect(resultado.rateios[0].conta_associacao).toBe("uuid-fake-conta_associacao");
    expect(resultado.rateios[0].tipo_custeio).toBe("id-fake-tipo_custeio");
    expect(resultado.rateios[0].tag).toBe("uuid-fake-tag");
  });

  it("deve processar corretamente os rateios", () => {
    const values = {
      rateios: [
        {
          especificacao_material_servico: { id: 10 },
          conta_associacao: { uuid: "abc-123" },
          quantidade_itens_capital: "2",
          valor_item_capital: "100,00",
          valor_rateio: "200,00",
          valor_original: "200,00",
        },
      ],
    };
    const resultado = validaPayloadDespesas(values);
    expect(resultado.rateios[0].especificacao_material_servico).toBe(10);
    expect(resultado.rateios[0].conta_associacao).toBe("abc-123");
    expect(resultado.rateios[0].quantidade_itens_capital).toBe(2);
    expect(resultado.rateios[0].valor_item_capital).toBe(100.0);
    expect(resultado.rateios[0].valor_rateio).toBe(200.0);
  });

  test("deve formatar corretamente os valores de despesas_impostos", () => {
    const values = {
      rateios: [],
      despesas_impostos: [
        {
          data_transacao: "2025-03-01T12:00:00Z",
          rateios: [
            {
              valor_rateio: "100.50",
              valor_original: "150.75",
              quantidade_itens_capital: "3",
              valor_item_capital: "50.25"
            }
          ]
        }
      ]
    };

    const resultado = validaPayloadDespesas(values);

    expect(resultado.despesas_impostos[0].data_transacao).toBe(moment("2025-03-01T12:00:00Z").format("YYYY-MM-DD"));
    expect(resultado.despesas_impostos[0].rateios[0].valor_rateio).toBe(10050);
    expect(resultado.despesas_impostos[0].rateios[0].valor_original).toBe(15075);
    expect(resultado.despesas_impostos[0].rateios[0].quantidade_itens_capital).toBe(3);
    expect(resultado.despesas_impostos[0].rateios[0].valor_item_capital).toBe(5025);
  });

  test("deve definir data_transacao como null se estiver vazia", () => {
    const values = {
      rateios: [],
      despesas_impostos: [
        {
          data_transacao: "",
          rateios: []
        }
      ]
    };

    const resultado = validaPayloadDespesas(values);
    expect(resultado.despesas_impostos[0].data_transacao).toBeNull();
  });

  test("deve chamar mantemConciliacaoAtualImposto se origemAnaliseLancamento retornar verdadeiro", () => {
    const values = {
      rateios: [],
      despesas_impostos: [{ data_transacao: "2025-03-01", rateios: [] }],
    };
    const despesasTabelas = {
        tipos_transacao: [
        {
            "id": 3,
            "nome": "Cartão",
            "tem_documento": true
        }
    ]}
    const parametroLocation = true;

    jest.spyOn(metodosAuxiliares, "origemAnaliseLancamento").mockReturnValue(true);
    jest.spyOn(metodosAuxiliares, "mantemConciliacaoAtualImposto").mockImplementation(() => {});

    validaPayloadDespesas(values, despesasTabelas, parametroLocation);

    expect(metodosAuxiliares.mantemConciliacaoAtualImposto).toHaveBeenCalledWith(values.despesas_impostos[0]);
  });
});

describe("Formatadores de valores e datas", () => {
    it("exibeValorFormatadoPT_BR - deve formatar números corretamente", () => {
        expect(exibeValorFormatadoPT_BR(1234.56).replace(/\s/g, ""))
            .toBe("R$1.234,56");
        expect(exibeValorFormatadoPT_BR(0).replace(/\s/g, "")).toBe("R$0,00");
        expect(exibeValorFormatadoPT_BR(-50).replace(/\s/g, "")).toBe("R$-50,00");
    });

    it("exibeDataPT_BR - deve formatar datas corretamente", () => {
        expect(exibeDataPT_BR("2024-07-10")).toBe("10/07/2024");
        expect(exibeDataPT_BR("None")).toBe(moment(new Date()).format("DD/MM/YYYY")); 
    });

    it("exibeDateTimePT_BR - deve formatar data e hora corretamente", () => {
        expect(exibeDateTimePT_BR("2024-07-10T15:30:00")).toBe("10/07/2024 às 15:30:00");
        expect(exibeDateTimePT_BR("None")).toBe(moment(new Date()).format("DD/MM/YYYY [às] HH:mm:ss")); 
    });

    it("exibeDateTimePT_BR_Ata - deve formatar data e hora sem segundos", () => {
        expect(exibeDateTimePT_BR_Ata("2024-07-10T15:30:00")).toBe("10/07/2024 às 15:30");
        expect(exibeDateTimePT_BR_Ata("None")).toBe(moment(new Date()).format("DD/MM/YYYY [às] HH:mm")); 
    });
});

describe("convertToNumber", () => {
    it("deve converter uma string numérica em número", () => {
        expect(convertToNumber("1234")).toBe(1234);
        expect(convertToNumber("0")).toBe(0);
        expect(convertToNumber("-50")).toBe(-50);
    });

    it("deve retornar NaN para strings não numéricas", () => {
        expect(convertToNumber("abc")).toBeNaN();
        expect(convertToNumber("12a3")).toBeNaN();
    });
});

describe("round", () => {
    it("deve arredondar um número para o número especificado de casas decimais", () => {
        expect(round(1.23456, 2)).toBe(1.23);
        expect(round(1.23556, 2)).toBe(1.24);
        expect(round(10.5, 0)).toBe(11);
    });
});

describe("trataNumericos", () => {
    it("deve converter strings numéricas com vírgula em números", () => {
        expect(trataNumericos("1.234,56")).toBe(1234.56);
        expect(trataNumericos("0,99")).toBe(0.99);
        expect(trataNumericos("-50,75")).toBe(-50.75);
    });

    it("deve remover caracteres não numéricos antes da conversão", () => {
        expect(trataNumericos("R$ 1.234,56")).toBe(1234.56);
        expect(trataNumericos("US$ 99,99")).toBe(99.99);
    });

    it("deve retornar o valor original se não for string", () => {
        expect(trataNumericos(1234.56)).toBe(1234.56);
        expect(trataNumericos(-99.99)).toBe(-99.99);
    });
});

describe("Funções de cálculo", () => {
    test("calculaValorRateio - deve multiplicar corretamente dois valores", () => {
        expect(calculaValorRateio(10, 5)).toBe(50);
        expect(calculaValorRateio("10", "5")).toBe(50);
        expect(calculaValorRateio("10,5", "2")).toBe(21);
        expect(calculaValorRateio("-3", "4")).toBe(-12);
    });
    
    test("calculaValorRecursoAcoes - deve calcular corretamente a diferença entre valores", () => {
        expect(calculaValorRecursoAcoes({ valor_total: 100, valor_recursos_proprios: 30 })).toBe(70);
        expect(calculaValorRecursoAcoes({ valor_total: "200,5", valor_recursos_proprios: "50,5" })).toBe(150);
        expect(calculaValorRecursoAcoes({ valor_total: "-100", valor_recursos_proprios: "50" })).toBe(-150);
    });
    
    test("calculaValorOriginal - deve calcular corretamente a diferença entre valores", () => {
        expect(calculaValorOriginal({ valor_original: 100, valor_recursos_proprios: 30 })).toBe(70);
        expect(calculaValorOriginal({ valor_original: "200,5", valor_recursos_proprios: "50,5" })).toBe(150);
        expect(calculaValorOriginal({ valor_original: "-100", valor_recursos_proprios: "50" })).toBe(-150);
    });
});

describe("Máscaras de CPF/CNPJ", () => {
    test("Aplica máscara de CPF corretamente", () => {
        expect(cpfMaskContitional("12345678909")).toEqual([
        /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/
        ]);
    });

    test("Aplica máscara de CNPJ corretamente", () => {
        expect(cpfMaskContitional("12345678000195")).toEqual([
        /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/
        ]);
    });

    test("Aplica máscara de processo incorporação", () => {
        expect(processoIncorporacaoMask("12345678000195")).toEqual([
        /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/
        ]);
    });
});

describe("Validação de CPF/CNPJ", () => {
    test("Valida CPF válido", () => {
        expect(valida_cpf_cnpj("12345678909")).toBe(true);
    });

    test("Valida CPF inválido", () => {
        expect(valida_cpf_cnpj("11111111111")).toBe(false);
    });

    test("Valida CPF inválido", () => {
        expect(valida_cpf_cnpj("12345678900")).toBe(false);
    });  
    
    test("Valida valor desconhecida", () => {
        expect(valida_cpf_cnpj("12345")).toBe(false);
    });  

    test("Valida CNPJ válido", () => {
        expect(valida_cpf_cnpj("12345678000195")).toBe(true);
    });

    test("Valida CNPJ inválido", () => {
        expect(valida_cpf_cnpj("11111111000111")).toBe(false);
    });

    test("Identifica CPF inválido", () => {
        expect(valida_cpf_cnpj_permitindo_cnpj_zerado("12345678900")).toBe(false);
    });

    test("Não identifica CPF ou CNPJ", () => {
        expect(valida_cpf_cnpj_permitindo_cnpj_zerado("1234")).toBe(false);
    });

    test("Valida CNPJ zerado permitido", () => {
        expect(valida_cpf_cnpj_permitindo_cnpj_zerado("00000000000000")).toBe(true);
    });


    test("Valida CNPJ inválido", () => {
        expect(valida_cpf_cnpj_permitindo_cnpj_zerado(null)).toBe(false);
    });

    test("Valida CNPJ zerado não permitido", () => {
        expect(valida_cpf_cnpj("00000000000000")).toBe(false);
    });
});

describe("Função getTextoStatusPeriodo", () => {
    test("Retorna a mensagem correta para EM_ANDAMENTO", () => {
        expect(getTextoStatusPeriodo("EM_ANDAMENTO")).toBe(
        "O período está em andamento, os dados apresentados estão em atualização sendo cadastrados."
        );
    });

    test("Retorna a mensagem correta para PENDENTE", () => {
        expect(getTextoStatusPeriodo("PENDENTE")).toBe("O período está pendente");
    });

    test("Retorna a mensagem correta para CONCILIADO", () => {
        expect(getTextoStatusPeriodo("CONCILIADO")).toBe("O período foi conferido e fechado pela Associação de Pais e Mestres");
    });
    
    test("Retorna a mensagem correta para APROVADO", () => {
        expect(getTextoStatusPeriodo("APROVADO")).toBe("O período está fechado e foi aprovado pela Diretoria Regional de Educação");
    });
    
    test("Retorna a mensagem correta para REJEITADO", () => {
        expect(getTextoStatusPeriodo("REJEITADO")).toBe("O período está fechado e foi rejeitado pela Diretoria Regional de Educação");
    });    

    test("Retorna a mensagem correta para indefinido", () => {
        expect(getTextoStatusPeriodo("indefinido")).toBe("O período está com status indefinido");
    });    
});

describe("Função getCorStatusPeriodo", () => {
    test("Retorna amarelo para EM_ANDAMENTO", () => {
        expect(getCorStatusPeriodo("EM_ANDAMENTO")).toBe("amarelo");
    });

    test("Retorna vermelho para PENDENTE", () => {
        expect(getCorStatusPeriodo("PENDENTE")).toBe("vermelho");
    });

    test("Retorna azul para CONCILIADO", () => {
        expect(getCorStatusPeriodo("CONCILIADO")).toBe("azul");
    });

    test("Retorna azul para CONCILIADO", () => {
        expect(getCorStatusPeriodo("CONCILIADO")).toBe("azul");
    });

    test("Retorna verde para APROVADO", () => {
        expect(getCorStatusPeriodo("APROVADO")).toBe("verde");
    });    

    test("Retorna vermelho para REJEITADO", () => {
        expect(getCorStatusPeriodo("REJEITADO")).toBe("vermelho");
    });  

    test("Retorna vermelho para status não identificado", () => {
        expect(getCorStatusPeriodo("Não mepeado")).toBe("vermelho");
    });            
});

describe("Função slugify", () => {
    test("Converte string com espaços e caracteres especiais", () => {
        expect(slugify("Olá Mundo!")).toBe("ola-mundo");
    });

    test("Remove acentos", () => {
        expect(slugify("coração")).toBe("coracao");
    });

    test("Converte string para slug com diferentes formatos", () => {
        expect(slugify("Hello World")).toBe("hello-world");
        expect(slugify("Teste com Acentos")).toBe("teste-com-acentos");
        expect(slugify("123 Test")).toBe("123-test");
    });

    test("Remove caracteres especiais corretamente", () => {
        expect(slugify("Test@#$%")).toBe("testpct");
        expect(slugify("Hello! World?")).toBe("hello-world");
    });
});

describe("Função gerarUuid", () => {
    test("Gera um UUID válido", () => {
        const uuid = gerarUuid();
        expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/);
    });

    test("Gera UUIDs diferentes a cada chamada", () => {
        const uuid1 = gerarUuid();
        const uuid2 = gerarUuid();
        expect(uuid1).not.toBe(uuid2);
    });
});

describe("Comparação de Objetos", () => {
    test("Objetos idênticos", () => {
        expect(comparaObjetos({ a: 1 }, { a: 1 })).toBe(true);
    });
    
    test("Objetos diferentes", () => {
        expect(comparaObjetos({ a: 1 }, { a: 2 })).toBe(false);
    });

    test("Objetos diferentes por quantidade de chaves", () => {
        expect(comparaObjetos({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });
    
    test("Objetos aninhados idênticos", () => {
        expect(comparaObjetos({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);
    });
    
    test("Objetos aninhados diferentes", () => {
        expect(comparaObjetos({ a: { b: 2 } }, { a: { b: 3 } })).toBe(false);
    });
    
    test("Comparação com null", () => {
        expect(comparaObjetos(null, null)).toBe(true);
        expect(comparaObjetos(null, {})).toBe(false);
    });
});
    
describe("Validação de CPF exportado", () => {
    test("CPF válido", () => {
        expect(valida_cpf_exportado("12345678909")).toBe(true);
    });
    test("CPF inválido", () => {
        expect(valida_cpf_exportado("1234567890")).toBe(false);
    });
});

describe("Apenas números", () => {
    test("Valor numérico válido", () => {
        expect(apenasNumero("12345")).toBe(true);
    });
    
    test("Valor com letras", () => {
        expect(apenasNumero("123a45")).toBe(false);
    });
    
    test("Valor vazio", () => {
        expect(apenasNumero("")).toBe(true);
    });

    test("Retorna true para strings apenas com números", () => {
        expect(apenasNumero("123")).toBe(true);
        expect(apenasNumero("123456789")).toBe(true);
    });

    test("Retorna false para strings com caracteres não numéricos", () => {
        expect(apenasNumero("abc123def")).toBe(false);
        expect(apenasNumero("123-456-789")).toBe(false);
        expect(apenasNumero("R$ 1.234,56")).toBe(false);
    });
});

describe("Formatação de Nome DRE", () => {
    test("Remove 'DIRETORIA REGIONAL DE EDUCACAO'", () => {
        expect(formataNomeDRE("DIRETORIA REGIONAL DE EDUCACAO NORTE")).toBe("NORTE");
    });
    
    test("Nome DRE sem alterações", () => {
        expect(formataNomeDRE("NORTE")).toBe("NORTE");
    });
    
    test("Nome DRE vazio", () => {
        expect(formataNomeDRE("")).toBe("");
    });

    test("Remove 'DIRETORIA REGIONAL DE EDUCACAO' de diferentes posições", () => {
        expect(formataNomeDRE("DIRETORIA REGIONAL DE EDUCACAO BUTANTA")).toBe("BUTANTA");
        expect(formataNomeDRE("DRE BUTANTA DIRETORIA REGIONAL DE EDUCACAO")).toBe("DRE BUTANTA");
    });

    test("Retorna nome quando não contém 'DIRETORIA REGIONAL DE EDUCACAO'", () => {
        expect(formataNomeDRE("DRE BUTANTA")).toBe("DRE BUTANTA");
    });
});    