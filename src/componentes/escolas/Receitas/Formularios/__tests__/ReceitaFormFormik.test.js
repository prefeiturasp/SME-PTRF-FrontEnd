import React from "react";
import {render, screen, within} from "@testing-library/react";
import {ReceitaFormFormik} from "../ReceitaFormFormik";

jest.mock("../../../../Globais/ReactNumberFormatInput", () => ({
    ReactNumberFormatInput: ({value, onChangeEvent, ...rest}) => (
        <input data-testid="currency-input" value={value} onChange={onChangeEvent} {...rest} />
    )
}));

jest.mock("../../../../Globais/DatePickerField", () => ({
    DatePickerField: ({value, onChange, name}) => (
        <input
            data-testid="datepicker-field"
            value={value || ""}
            onChange={({target}) => onChange(name, target.value)}
        />
    )
}));

describe("ReceitaFormFormik - classificação do crédito", () => {
    const defaultProps = {
        initialValue: {
            tipo_receita: "1",
            categoria_receita: "CUSTEIO",
            acao_associacao: "acao-1",
            conta_associacao: "",
            data: "2024-01-10",
            detalhe_tipo_receita: "",
            detalhe_outros: "",
            detalhe_tipo_receita_outros: "",
            valor: "1.000,00",
            referencia_devolucao: "",
            saida_do_recurso: "",
            rateio_estornado: "",
            motivos_estorno: [],
            outros_motivos_estorno: ""
        },
        onSubmit: jest.fn(),
        validateFormReceitas: jest.fn(),
        readOnlyCampos: false,
        readOnlyTipoReceita: false,
        consultaRepasses: jest.fn(),
        getClassificacaoReceita: jest.fn(),
        setaDetalhesTipoReceita: jest.fn(),
        getAvisoTipoReceita: jest.fn(),
        setShowCadastrarSaida: jest.fn(),
        tabelas: {
            categorias_receita: [
                {id: "CUSTEIO", nome: "Custeio"},
                {id: "CAPITAL", nome: "Capital"}
            ],
            tipos_receita: []
        },
        periodosValidosAssociacaoencerrada: [],
        receita: {},
        verificaSeExibeDetalhamento: jest.fn().mockReturnValue(false),
        temOpcoesDetalhesTipoReceita: jest.fn(),
        getOpcoesDetalhesTipoReceita: jest.fn(),
        verificaSeDevolucao: jest.fn().mockReturnValue(false),
        readOnlyValor: false,
        readOnlyContaAssociacaoReceita: false,
        retornaTiposDeContas: jest.fn().mockReturnValue([]),
        readOnlyAcaoAssociacaoReceita: false,
        showBotaoCadastrarSaida: jest.fn(),
        getClasificacaoAcao: jest.fn(),
        retornaAcoes: jest.fn().mockReturnValue([]),
        atualizaValorRepasse: jest.fn(),
        readOnlyClassificacaoReceita: false,
        retornaClassificacaoReceita: jest.fn().mockImplementation(() => [
            <option key="CAPITAL" value="CAPITAL">Capital</option>
        ]),
        showEditarSaida: false,
        setExibeModalSalvoComSucesso: jest.fn(),
        setRedirectTo: jest.fn(),
        showCadastrarSaida: false,
        objetoParaComparacao: {},
        onCancelarTrue: jest.fn(),
        onShowModal: jest.fn(),
        uuid: undefined,
        exibirDeleteDespesa: false,
        readOnlyBtnAcao: false,
        onShowDeleteModal: jest.fn(),
        servicoDeVerificacoes: jest.fn(),
        showReceitaRepasse: false,
        setShowReceitaRepasse: jest.fn(),
        showSelecionaRepasse: false,
        setShowSelecionaRepasse: jest.fn(),
        setExibirDeleteDespesa: jest.fn(),
        repasses: [],
        trataRepasse: jest.fn(),
        readOnlyEstorno: false,
        despesa: null,
        idTipoReceitaEstorno: "99",
        showModalMotivoEstorno: false,
        setShowModalMotivoEstorno: jest.fn(),
        listaMotivosEstorno: [],
        selectMotivosEstorno: [],
        setSelectMotivosEstorno: jest.fn(),
        checkBoxOutrosMotivosEstorno: false,
        txtOutrosMotivosEstorno: "",
        handleChangeCheckBoxOutrosMotivosEstorno: jest.fn(),
        handleChangeTxtOutrosMotivosEstorno: jest.fn(),
        readOnlyReaberturaSeletiva: false,
        ehOperacaoExclusaoReaberturaSeletiva: jest.fn().mockReturnValue(false),
        ehOperacaoAtualizacaoReaberturaSeletiva: jest.fn().mockReturnValue(false),
        origemAnaliseLancamento: jest.fn().mockReturnValue(false),
        validacoesPersonalizadasCredito: jest.fn(),
        formDateErrors: "",
        escondeBotaoDeletar: false,
        mensagemDataInicialConta: "",
        repasse: {}
    };

    beforeEach(() => {
        defaultProps.retornaClassificacaoReceita.mockReset();
        defaultProps.retornaClassificacaoReceita.mockImplementation(() => [
            <option key="CAPITAL" value="CAPITAL">Capital</option>
        ]);
    });

    it("exibe opção já selecionada e mantém as demais opções disponíveis", async () => {
        render(<ReceitaFormFormik {...defaultProps} />);

        const select = screen.getByLabelText("Classificação do crédito");
        const options = within(select).getAllByRole("option");
        const textos = options.map(option => option.textContent);

        expect(textos).toContain("Custeio");

        expect(defaultProps.retornaClassificacaoReceita).toHaveBeenCalledWith(
            expect.objectContaining({categoria_receita: "CUSTEIO"}),
            expect.any(Function),
            "CUSTEIO"
        );
    });

    it("usa rótulo da categoria carregada quando não está presente nas tabelas", () => {
        const props = {
            ...defaultProps,
            initialValue: {
                ...defaultProps.initialValue,
                categoria_receita: {id: "LIVRE", nome: "Livre Aplicação"}
            },
            tabelas: {
                ...defaultProps.tabelas,
                categorias_receita: [{id: "CUSTEIO", nome: "Custeio"}]
            },
            retornaClassificacaoReceita: jest.fn().mockReturnValue([
                <option key="CUSTEIO" value="CUSTEIO">Custeio</option>
            ])
        };

        render(<ReceitaFormFormik {...props} />);

        const select = screen.getByLabelText("Classificação do crédito");
        const textos = within(select).getAllByRole("option").map(option => option.textContent);

        expect(textos).toContain("Livre Aplicação");
        expect(props.retornaClassificacaoReceita).toHaveBeenCalledWith(
            expect.objectContaining({categoria_receita: expect.any(Object)}),
            expect.any(Function),
            "LIVRE"
        );
    });

    it("mantém apenas opções adicionais quando nenhuma categoria está selecionada", () => {
        const props = {
            ...defaultProps,
            initialValue: {
                ...defaultProps.initialValue,
                categoria_receita: ""
            }
        };

        defaultProps.retornaClassificacaoReceita.mockClear();
        defaultProps.retornaClassificacaoReceita.mockReturnValue([
            <option key="CAPITAL" value="CAPITAL">Capital</option>
        ]);

        render(<ReceitaFormFormik {...props} />);

        const select = screen.getByLabelText("Classificação do crédito");
        const textos = within(select).getAllByRole("option").map(option => option.textContent);

        expect(textos[0]).toBe("Escolha a classificação");
        expect(textos).toContain("Capital");

        const ultimaChamada = defaultProps.retornaClassificacaoReceita.mock.calls.at(-1);
        expect(ultimaChamada[0]).toEqual(expect.objectContaining({categoria_receita: ""}));
        expect(typeof ultimaChamada[1]).toBe("function");
        expect(["", null]).toContain(ultimaChamada[2]);
    });
});
