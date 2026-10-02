import React, { useRef } from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import FormularioAcertos from '../FormularioAcertos';

// Wrapper local que fornece um formRef real (useRef), já que o componente
// exige innerRef válido para o Formik.
const Wrapper = (props) => {
    const formRef = useRef();
    return <FormularioAcertos {...props} formRef={formRef} />;
};

const defaultTipos = [
    {
        id: 'SOLICITACAO_ESCLARECIMENTO',
        nome: 'Esclarecimento',
        tipos_acerto_documento: [{ uuid: 'tipo-escl-1', nome: 'Esclarecimento 1' }],
    },
    {
        id: 'INCLUSAO_CREDITO',
        nome: 'Inclusão de Crédito',
        tipos_acerto_documento: [
            { uuid: 'tipo-cred-1', nome: 'Crédito 1' },
            { uuid: 'tipo-cred-2', nome: 'Crédito 2' },
        ],
    },
    {
        id: 'CATEGORIA_UNICA',
        nome: 'Categoria Única',
        tipos_acerto_documento: [{ uuid: 'tipo-unica-1', nome: 'Única 1' }],
    },
];

const buildProps = (overrides = {}) => ({
    solicitacoes_acerto: {
        solicitacoes_acerto: [
            { uuid: null, copiado: false, tipo_acerto: '', detalhamento: '' },
        ],
    },
    validaContaAoSalvar: jest.fn(),
    tiposDeAcertoDocumentosAgrupados: defaultTipos,
    handleChangeTipoDeAcertoDocumento: jest.fn(),
    textoCategoria: [],
    corTextoCategoria: [],
    adicionaTextoECorCategoriaVazio: jest.fn(),
    removeTextoECorCategoriaTipoDeAcertoJaCadastrado: jest.fn(),
    ehSolicitacaoCopiada: () => false,
    ...overrides,
});

const renderComponent = (overrides = {}) => {
    const props = buildProps(overrides);
    const utils = render(<Wrapper {...props} />);
    return { ...utils, props };
};

describe('FormularioAcertos (DetalharAcertosDocumentos)', () => {
    afterEach(() => {
        cleanup();
    });

    it('renderiza um item inicial e o botão de adicionar novo item', () => {
        renderComponent();

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText(/\+ Adicionar novo item/i)).toBeInTheDocument();
    });

    it('adiciona um novo item ao clicar em "+ Adicionar novo item"', async () => {
        const user = userEvent.setup();
        const { props } = renderComponent();

        await user.click(screen.getByRole('button', { name: /\+ Adicionar novo item/i }));

        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(props.adicionaTextoECorCategoriaVazio).toHaveBeenCalledTimes(1);
    });

    it('remove um item ao clicar em "Remover item" quando não copiado', async () => {
        const user = userEvent.setup();
        const { props } = renderComponent({
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    { uuid: null, copiado: false, tipo_acerto: '', detalhamento: '' },
                    { uuid: null, copiado: false, tipo_acerto: '', detalhamento: '' },
                ],
            },
        });

        expect(screen.getByText('Item 2')).toBeInTheDocument();

        const botoesRemover = screen.getAllByText('Remover item');
        await user.click(botoesRemover[0]);

        expect(props.removeTextoECorCategoriaTipoDeAcertoJaCadastrado).toHaveBeenCalledWith(0);
        expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    });

    it('exibe "Considerar correto" quando ehSolicitacaoCopiada retorna true', async () => {
        const user = userEvent.setup();
        const { props } = renderComponent({
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    { uuid: 'uuid-1', copiado: true, tipo_acerto: 'tipo-cred-1', detalhamento: '' },
                ],
            },
            ehSolicitacaoCopiada: (acerto) => acerto.copiado === true,
        });

        const botaoConsiderarCorreto = screen.getByText('Considerar correto');
        expect(botaoConsiderarCorreto).toBeInTheDocument();
        expect(screen.queryByText('Remover item')).not.toBeInTheDocument();

        await user.click(botaoConsiderarCorreto);
        expect(props.removeTextoECorCategoriaTipoDeAcertoJaCadastrado).toHaveBeenCalledWith(0);
    });

    it('desabilita o select quando o item já possui uuid', () => {
        renderComponent({
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    { uuid: 'uuid-existente', copiado: false, tipo_acerto: 'tipo-cred-1', detalhamento: '' },
                ],
            },
        });

        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('não desabilita o select quando o item não possui uuid', () => {
        renderComponent();

        expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    it('chama handleChangeTipoDeAcertoDocumento ao selecionar um tipo de acerto', async () => {
        const user = userEvent.setup();
        const { props } = renderComponent();

        await user.selectOptions(screen.getByRole('combobox'), 'tipo-cred-1');

        expect(props.handleChangeTipoDeAcertoDocumento).toHaveBeenCalledTimes(1);
        expect(props.handleChangeTipoDeAcertoDocumento.mock.calls[0][1]).toBe(0);
        expect(screen.getByRole('combobox').value).toBe('tipo-cred-1');
    });

    it('exibe erro de validação quando o tipo de acerto é limpo (validateOnChange)', async () => {
        // O <select> deste formulário não possui onBlur ligado ao Formik (apenas
        // onChange), então a validação em uso real é disparada por mudança de
        // valor (validateOnChange=true), não por perda de foco.
        const user = userEvent.setup();
        renderComponent({
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    { uuid: null, copiado: false, tipo_acerto: 'tipo-cred-1', detalhamento: '' },
                ],
            },
        });

        const select = screen.getByRole('combobox');
        expect(select.value).toBe('tipo-cred-1');

        await user.selectOptions(select, '');

        expect(await screen.findByText('Tipo de acerto é obrigatorio')).toBeInTheDocument();
    });

    it('exibe texto e cor de categoria quando informados', () => {
        renderComponent({
            textoCategoria: ['Atenção: item já cadastrado'],
            corTextoCategoria: ['texto-categoria-documento-verde'],
        });

        const texto = screen.getByText('Atenção: item já cadastrado');
        expect(texto).toBeInTheDocument();
        expect(texto).toHaveClass('texto-categoria-documento-verde');
    });

    it('atualiza o campo de detalhamento ao digitar', async () => {
        const user = userEvent.setup();
        renderComponent();

        const textarea = screen.getByPlaceholderText('Utilize esse campo para detalhar o motivo');
        await user.type(textarea, 'Motivo do ajuste');

        expect(textarea).toHaveValue('Motivo do ajuste');
    });

    it('esconde categorias que não podem repetir e categorias sem itens a exibir, mantendo categoria com item repetível visível', () => {
        const { container } = renderComponent({
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    { uuid: null, copiado: false, tipo_acerto: 'tipo-escl-1', detalhamento: '' },
                    { uuid: null, copiado: false, tipo_acerto: 'tipo-cred-1', detalhamento: '' },
                    { uuid: null, copiado: false, tipo_acerto: 'tipo-unica-1', detalhamento: '' },
                ],
            },
        });

        const optgroupEsclarecimento = container.querySelector('optgroup[label="Esclarecimento"]');
        const optgroupCredito = container.querySelector('optgroup[label="Inclusão de Crédito"]');
        const optgroupUnica = container.querySelector('optgroup[label="Categoria Única"]');

        // SOLICITACAO_ESCLARECIMENTO não pode repetir -> categoria escondida
        expect(optgroupEsclarecimento).toHaveClass('esconde-categoria');
        // INCLUSAO_CREDITO pode repetir itens -> categoria continua visível
        expect(optgroupCredito).not.toHaveClass('esconde-categoria');
        // CATEGORIA_UNICA não está na lista de categorias que podem repetir e,
        // com seu único item já selecionado, fica sem itens a exibir -> escondida
        expect(optgroupUnica).toHaveClass('esconde-categoria');

        const optionEsclarecido = container.querySelector('option[value="tipo-escl-1"]');
        const optionCredito1 = container.querySelector('option[value="tipo-cred-1"]');
        const optionUnica = container.querySelector('option[value="tipo-unica-1"]');

        expect(optionEsclarecido).toHaveClass('esconde-tipo-acerto');
        // Itens de categoria repetível continuam com a classe de exibição normal
        expect(optionCredito1).not.toHaveClass('esconde-tipo-acerto');
        expect(optionUnica).toHaveClass('esconde-tipo-acerto');
    });

    it('não quebra quando tiposDeAcertoDocumentosAgrupados está vazio', () => {
        renderComponent({ tiposDeAcertoDocumentosAgrupados: [] });

        expect(screen.getByText('Selecione a especificação do acerto')).toBeInTheDocument();
    });

    it('não renderiza itens quando solicitacoes_acerto está vazio', () => {
        renderComponent({
            solicitacoes_acerto: { solicitacoes_acerto: [] },
        });

        expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
        expect(screen.getByText(/\+ Adicionar novo item/i)).toBeInTheDocument();
    });
});
