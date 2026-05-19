import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormularioAcertos } from '../FormularioAcertos';
import { ValidarParcialTesouro } from '../../../../../../../context/DetalharAcertos';

jest.mock('../FormularioAcertosBasico', () => ({
    FormularioAcertosBasico: ({ label }) => <div data-testid='formulario-basico'>{label}</div>,
}));

jest.mock('../FormularioAcertosDevolucaoAoTesouro', () => ({
    FormularioAcertosDevolucaoAoTesouro: () => (
        <div data-testid='formulario-devolucao'>Devolução ao Tesouro</div>
    ),
}));

jest.mock('../YupSignupSchemaDetalharAcertos', () => ({
    YupSignupSchemaDetalharAcertos: () => ({
        validate: jest.fn().mockResolvedValue(true),
    }),
}));

const renderComponent = ({
    solicitacoes_acerto = {
        solicitacoes_acerto: [
            {
                tipo_acerto: '',
                detalhamento: '',
                devolucao_tesouro: {},
            },
        ],
    },
    listaTiposDeAcertoLancamentosAgrupado = [
        {
            id: 'DEVOLUCAO',
            nome: 'Devolução',
            tipos_acerto_lancamento: [
                {
                    uuid: 'UUID_DEV',
                    nome: 'Devolução ao Tesouro',
                    deve_exibir: true,
                },
            ],
        },
    ],
    exibeCamposCategoriaDevolucao = {},
    ehSolicitacaoCopiada = () => false,
    textoCategoria = [],
    corTextoCategoria = [],
    lancamentosParaAcertos = [],
    setListaTiposDeAcertoLancamentosAgrupado = jest.fn(),
    setIsValorParcialValido = jest.fn(),
} = {}) => {
    const validaContaAoSalvar = jest.fn();

    render(
        <ValidarParcialTesouro.Provider value={{ setIsValorParcialValido }}>
            <FormularioAcertos
                solicitacoes_acerto={solicitacoes_acerto}
                listaTiposDeAcertoLancamentosAgrupado={listaTiposDeAcertoLancamentosAgrupado}
                setListaTiposDeAcertoLancamentosAgrupado={setListaTiposDeAcertoLancamentosAgrupado}
                formRef={React.createRef()}
                handleChangeTipoDeAcertoLancamento={jest.fn()}
                exibeCamposCategoriaDevolucao={exibeCamposCategoriaDevolucao}
                tiposDevolucao={[]}
                bloqueiaSelectTipoDeAcerto={[]}
                removeBloqueiaSelectTipoDeAcertoJaCadastrado={jest.fn()}
                textoCategoria={textoCategoria}
                corTextoCategoria={corTextoCategoria}
                removeTextoECorCategoriaTipoDeAcertoJaCadastrado={jest.fn()}
                adicionaTextoECorCategoriaVazio={jest.fn()}
                ehSolicitacaoCopiada={ehSolicitacaoCopiada}
                valorDocumento={100}
                lancamentosParaAcertos={lancamentosParaAcertos}
                validaContaAoSalvar={validaContaAoSalvar}
            />
        </ValidarParcialTesouro.Provider>,
    );

    return { validaContaAoSalvar, setIsValorParcialValido };
};

describe('FormularioAcertos', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('deve renderizar o formulário com item inicial', () => {
        renderComponent();

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText(/adicionar novo item/i)).toBeInTheDocument();
    });

    it('deve permitir adicionar um novo item', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(screen.getByRole('button', { name: /\+ adicionar novo item/i }));

        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('deve permitir remover um item', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(screen.getByText('Remover item'));

        expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    it('deve exibir formulário de devolução quando condição é atendida', () => {
        renderComponent({
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    {
                        tipo_acerto: 'UUID_DEV',
                        devolucao_tesouro: {},
                    },
                ],
            },
            exibeCamposCategoriaDevolucao: {
                UUID_DEV: true,
            },
        });

        expect(screen.getByTestId('formulario-devolucao')).toBeInTheDocument();
    });

    it('deve alterar texto do botão quando solicitação é copiada', () => {
        renderComponent({
            ehSolicitacaoCopiada: () => true,
        });

        expect(screen.getByText('Considerar correto')).toBeInTheDocument();
    });

    it('deve filtrar categorias quando lançamento está INATIVO', () => {
        const setLista = jest.fn();

        renderComponent({
            lancamentosParaAcertos: [
                {
                    documento_mestre: { status: 'INATIVO' },
                },
            ],
            setListaTiposDeAcertoLancamentosAgrupado: setLista,
        });

        expect(setLista).toHaveBeenCalled();
    });

    it('deve ocultar categoria DEVOLUCAO em seleção de mais de um lançamento', () => {
        renderComponent({
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    {
                        tipo_acerto: '',
                        devolucao_tesouro: {},
                    },
                    {
                        tipo_acerto: '',
                        devolucao_tesouro: {},
                    },
                ],
            },
            lancamentosParaAcertos: [
                { documento_mestre: { status: 'ATIVO' } },
                { documento_mestre: { status: 'ATIVO' } },
            ],
        });

        expect(screen.getAllByRole('combobox')).toHaveLength(2);
    });

    it('deve remover validação do botão salvar ao remover devolução', async () => {
        const user = userEvent.setup();
        const setIsValorParcialValido = jest.fn();

        renderComponent({
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    {
                        tipo_acerto: 'UUID_DEV',
                        devolucao_tesouro: { tipo: 'TOTAL' },
                    },
                ],
            },
            setIsValorParcialValido,
        });

        await user.click(screen.getByText('Remover item'));

        expect(setIsValorParcialValido).toHaveBeenCalledWith(false);
    });

    it('deve exibir alerta adicional quando há estorno de crédito', () => {
        renderComponent({
            textoCategoria: ['Esse tipo de acerto reabre o lançamento para exclusão.'],
            corTextoCategoria: ['texto-categoria-vermelho'],
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    {
                        tipo_acerto: '',
                        devolucao_tesouro: {},
                    },
                ],
            },
            lancamentosParaAcertos: [
                {
                    tipo_transacao: 'Crédito',
                    descricao: 'Estorno',
                    documento_mestre: {
                        status: 'ATIVO',
                    },
                },
            ],
        });

        expect(
            screen.getByText(/ao ser apagado, o estorno do gasto será desfeito/i),
        ).toBeInTheDocument();
    });

    it('deve não oculta categoria quando há itens para exibir', () => {
        renderComponent({
            listaTiposDeAcertoLancamentosAgrupado: [
                {
                    id: 'TESTE_CATEGORIA',
                    nome: 'Categoria teste',
                    tipos_acerto_lancamento: [{ uuid: '1', nome: 'Item 1', deve_exibir: true }],
                },
            ],
            solicitacoes_acerto: {
                solicitacoes_acerto: [
                    {
                        tipo_acerto: '',
                        devolucao_tesouro: {},
                    },
                ],
            },
        });

        expect(screen.queryByRole('group', { name: /Categoria teste/i })).toBeInTheDocument();
    });
});
