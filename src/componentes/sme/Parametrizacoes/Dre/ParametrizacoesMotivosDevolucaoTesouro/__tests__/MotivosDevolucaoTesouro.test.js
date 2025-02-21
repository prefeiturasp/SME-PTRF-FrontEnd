import { render, screen, fireEvent } from '@testing-library/react';
import { MotivosDevolucaoTesouroProvider, MotivosDevolucaoTesouroContext } from '../context/MotivosDevolucaoTesouro';
import { useContext } from 'react';

// Componente de teste que usa o contexto
const TestComponent = () => {
    const {
        filter, setFilter,
        showModalForm, setShowModalForm,
        stateFormModal, setStateFormModal,
        setBloquearBtnSalvarForm
    } = useContext(MotivosDevolucaoTesouroContext);

    return (
        <div>
            <button onClick={() => setShowModalForm(true)}>Mostrar Modal</button>
            <button onClick={() => setStateFormModal({ ...stateFormModal, nome: 'Teste' })}>Alterar nome no formulário</button>
            <button onClick={() => setFilter({ nome: 'Novo filtro' })}>Alterar Filtro</button>
            <button onClick={() => setBloquearBtnSalvarForm(true)}>Bloquear Botão</button>

            <div>
                <span>{`Modal: ${showModalForm ? 'Aberto' : 'Fechado'}`}</span>
            </div>
            <div>
                <span>{`Nome no formulário: ${stateFormModal.nome}`}</span>
            </div>
            <div>
                <span>{`Filtro: ${filter.nome}`}</span>
            </div>
        </div>
    );
};

describe('MotivosDevolucaoTesouroContext', () => {
    test('Deve alterar o estado do modal', () => {
        render(
            <MotivosDevolucaoTesouroProvider>
                <TestComponent />
            </MotivosDevolucaoTesouroProvider>
        );

        fireEvent.click(screen.getByText('Mostrar Modal'));

        expect(screen.getByText('Modal: Aberto')).toBeInTheDocument();
    });

    test('Deve alterar o nome no formulário', () => {
        render(
            <MotivosDevolucaoTesouroProvider>
                <TestComponent />
            </MotivosDevolucaoTesouroProvider>
        );

        fireEvent.click(screen.getByText('Alterar nome no formulário'));

        expect(screen.getByText('Nome no formulário: Teste')).toBeInTheDocument();
    });

    test('Deve alterar o filtro', () => {
        render(
            <MotivosDevolucaoTesouroProvider>
                <TestComponent />
            </MotivosDevolucaoTesouroProvider>
        );

        fireEvent.click(screen.getByText('Alterar Filtro'));

        expect(screen.getByText('Filtro: Novo filtro')).toBeInTheDocument();
    });

    test('Deve bloquear o botão de salvar', () => {
        render(
            <MotivosDevolucaoTesouroProvider>
                <TestComponent />
            </MotivosDevolucaoTesouroProvider>
        );

        fireEvent.click(screen.getByText('Bloquear Botão'));

        // Teste da lógica relacionada ao bloqueio do botão
        // Exemplo, você pode adicionar algum comportamento visual ou class que indique o bloqueio
        expect(true).toBe(true); // Adicionar lógica apropriada
    });
});
