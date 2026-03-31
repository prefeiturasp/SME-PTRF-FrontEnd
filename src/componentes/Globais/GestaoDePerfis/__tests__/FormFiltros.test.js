import { render, screen, fireEvent } from '@testing-library/react';
import { FormFiltros } from '../FormFiltros';

const GRUPOS_MOCK = [
    { id: 1, nome: 'Administradores' },
    { id: 2, nome: 'Leitores' },
];

const STATE_FILTROS_DEFAULT = {
    filtrar_por_nome: '',
    filtrar_por_grupo: '',
    filtrar_por_nome_unidade: '',
    filtrar_tipo_de_usuario: '',
};

const renderForm = (props = {}) => {
    const defaults = {
        stateFiltros: STATE_FILTROS_DEFAULT,
        handleChangeFiltros: jest.fn(),
        limpaFiltros: jest.fn(),
        handleSubmitFiltros: jest.fn(),
        grupos: GRUPOS_MOCK,
        visao_selecionada: 'UE',
    };
    return render(<FormFiltros {...defaults} {...props} />);
};


describe('FormFiltros', () => {
    describe('estrutura básica', () => {
        it('renderiza o campo de nome/id de usuário', () => {
            renderForm();
            expect(screen.getByPlaceholderText('Escreva o nome ou id')).toBeInTheDocument();
        });

        it('renderiza o select de grupo', () => {
            renderForm();
            expect(screen.getByLabelText('Filtrar por grupo')).toBeInTheDocument();
        });

        it('renderiza o botão Filtrar', () => {
            renderForm();
            expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument();
        });

        it('renderiza o botão Limpar', () => {
            renderForm();
            expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument();
        });
    });

    describe('select de grupos', () => {
        it('renderiza a opção padrão "Selecione um tipo"', () => {
            renderForm();
            expect(screen.getByRole('option', { name: 'Selecione um tipo' })).toBeInTheDocument();
        });

        it('renderiza as opções dos grupos', () => {
            renderForm();
            expect(screen.getByRole('option', { name: 'Administradores' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Leitores' })).toBeInTheDocument();
        });

        it('não renderiza opções de grupos quando grupos é undefined', () => {
            renderForm({ grupos: undefined });
            expect(screen.queryByRole('option', { name: 'Administradores' })).not.toBeInTheDocument();
        });

        it('não renderiza opções de grupos quando grupos é array vazio', () => {
            renderForm({ grupos: [] });
            expect(screen.queryByRole('option', { name: 'Administradores' })).not.toBeInTheDocument();
            expect(screen.queryByRole('option', { name: 'Leitores' })).not.toBeInTheDocument();
        });

        it('exibe valor selecionado do grupo a partir de stateFiltros', () => {
            renderForm({ stateFiltros: { ...STATE_FILTROS_DEFAULT, filtrar_por_grupo: '1' } });
            expect(screen.getByLabelText('Filtrar por grupo')).toHaveValue('1');
        });
    });

    describe('campo de nome/id', () => {
        it('exibe o valor de stateFiltros.filtrar_por_nome', () => {
            renderForm({ stateFiltros: { ...STATE_FILTROS_DEFAULT, filtrar_por_nome: 'João' } });
            expect(screen.getByPlaceholderText('Escreva o nome ou id')).toHaveValue('João');
        });

        it('chama handleChangeFiltros ao digitar no campo de nome', () => {
            const handleChangeFiltros = jest.fn();
            renderForm({ handleChangeFiltros });
            fireEvent.change(screen.getByPlaceholderText('Escreva o nome ou id'), {
                target: { name: 'filtrar_por_nome', value: 'Maria' },
            });
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_nome', 'Maria');
        });
    });

    describe('select de tipo de usuário', () => {
        it('renderiza as opções Servidor e Não Servidor', () => {
            renderForm();
            expect(screen.getByRole('option', { name: 'Servidor' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Não Servidor' })).toBeInTheDocument();
        });

        it('chama handleChangeFiltros ao alterar tipo de usuário', () => {
            const handleChangeFiltros = jest.fn();
            renderForm({ handleChangeFiltros });
            fireEvent.change(screen.getByDisplayValue('Filtrar por tipo de usuário'), {
                target: { name: 'filtrar_tipo_de_usuario', value: 'True' },
            });
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_tipo_de_usuario', 'True');
        });
    });

    describe('visao_selecionada = "DRE"', () => {
        it('exibe o campo "Filtrar por unidade educacional"', () => {
            renderForm({ visao_selecionada: 'DRE' });
            expect(screen.getByPlaceholderText('Nome da unidade')).toBeInTheDocument();
        });

        it('exibe o valor filtrar_por_nome_unidade no campo de unidade', () => {
            renderForm({
                visao_selecionada: 'DRE',
                stateFiltros: { ...STATE_FILTROS_DEFAULT, filtrar_por_nome_unidade: 'EMEF Teste' },
            });
            expect(screen.getByPlaceholderText('Nome da unidade')).toHaveValue('EMEF Teste');
        });

        it('chama handleChangeFiltros ao digitar no campo de unidade', () => {
            const handleChangeFiltros = jest.fn();
            renderForm({ visao_selecionada: 'DRE', handleChangeFiltros });
            fireEvent.change(screen.getByPlaceholderText('Nome da unidade'), {
                target: { name: 'filtrar_por_nome_unidade', value: 'EMEF' },
            });
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_nome_unidade', 'EMEF');
        });

        it('aplica classe col ao botão de ações (DRE)', () => {
            renderForm({ visao_selecionada: 'DRE' });
            const filtrarBtn = screen.getByRole('button', { name: 'Filtrar' });
            expect(filtrarBtn.closest('div.col')).toBeInTheDocument();
        });

        it('chama handleChangeFiltros ao alterar tipo de usuário (DRE)', () => {
            const handleChangeFiltros = jest.fn();
            const { container } = renderForm({ visao_selecionada: 'DRE', handleChangeFiltros });
            fireEvent.change(container.querySelector('#filtrar_tipo_de_usuario'), {
                target: { name: 'filtrar_tipo_de_usuario', value: 'True' },
            });
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_tipo_de_usuario', 'True');
        });
    });

    describe('visao_selecionada = "SME"', () => {
        it('exibe o campo "Filtrar por unidade educacional"', () => {
            renderForm({ visao_selecionada: 'SME' });
            expect(screen.getByPlaceholderText('Nome da unidade')).toBeInTheDocument();
        });

        it('chama handleChangeFiltros ao digitar no campo de unidade (SME)', () => {
            const handleChangeFiltros = jest.fn();
            renderForm({ visao_selecionada: 'SME', handleChangeFiltros });
            fireEvent.change(screen.getByPlaceholderText('Nome da unidade'), {
                target: { name: 'filtrar_por_nome_unidade', value: 'CEI' },
            });
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_nome_unidade', 'CEI');
        });

        it('aplica classe col ao botão de ações (SME)', () => {
            renderForm({ visao_selecionada: 'SME' });
            const filtrarBtn = screen.getByRole('button', { name: 'Filtrar' });
            expect(filtrarBtn.closest('div.col')).toBeInTheDocument();
        });
    });

    describe('visao_selecionada != DRE e != SME', () => {
        it('não exibe o campo de unidade educacional', () => {
            renderForm({ visao_selecionada: 'UE' });
            expect(screen.queryByPlaceholderText('Nome da unidade')).not.toBeInTheDocument();
        });

        it('aplica classe col-auto ao botão de ações (UE)', () => {
            renderForm({ visao_selecionada: 'UE' });
            const filtrarBtn = screen.getByRole('button', { name: 'Filtrar' });
            expect(filtrarBtn.closest('div.col-auto')).toBeInTheDocument();
        });
    });

    describe('botões de ação', () => {
        it('chama limpaFiltros ao clicar em Limpar', () => {
            const limpaFiltros = jest.fn();
            renderForm({ limpaFiltros });
            fireEvent.click(screen.getByRole('button', { name: 'Limpar' }));
            expect(limpaFiltros).toHaveBeenCalledTimes(1);
        });

        it('chama handleSubmitFiltros ao submeter o formulário', () => {
            const handleSubmitFiltros = jest.fn((e) => e.preventDefault());
            renderForm({ handleSubmitFiltros });
            fireEvent.submit(screen.getByRole('button', { name: 'Filtrar' }).closest('form'));
            expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
        });

        it('chama handleChangeFiltros ao alterar select de grupo', () => {
            const handleChangeFiltros = jest.fn();
            renderForm({ handleChangeFiltros });
            fireEvent.change(screen.getByLabelText('Filtrar por grupo'), {
                target: { name: 'filtrar_por_grupo', value: '2' },
            });
            expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_grupo', '2');
        });
    });
});
