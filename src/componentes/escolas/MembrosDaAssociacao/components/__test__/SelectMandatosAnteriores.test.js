import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectMandatosAnteriores } from '../SelectMandatosAnteriores'; // Ajuste o caminho se necessário
import { MembrosDaAssociacaoContext } from '../../context/MembrosDaAssociacao';
import { useGetMandatosAnteriores } from '../../hooks/useGetMandatosAnteriores';
import useDataTemplate from '../../../../../hooks/Globais/useDataTemplate';

jest.mock('../../hooks/useGetMandatosAnteriores');
jest.mock('../../../../../hooks/Globais/useDataTemplate');

describe('SelectMandatosAnteriores Component', () => {
    const mockMandatos = [
        { uuid: 'uuid-1', id: 10, data_inicial: '2020-01-01', data_final: '2022-01-01' },
        { uuid: 'uuid-2', id: 20, data_inicial: '2022-01-02', data_final: '2024-01-01' },
    ];

    const mockSetMandatoUuid = jest.fn();

    const renderComponent = (contextValue = {}) => {
        const defaultContext = {
            mandatoUuid: '',
            setMandatoUuid: mockSetMandatoUuid,
            ...contextValue,
        };

        return render(
            <MembrosDaAssociacaoContext.Provider value={defaultContext}>
                <SelectMandatosAnteriores />
            </MembrosDaAssociacaoContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        
        useDataTemplate.mockImplementation(() => (prefix, suffix, date) => date);
    });

    it('deve renderizar o select com as opções formatadas quando houver dados e nenhum erro', () => {
        useGetMandatosAnteriores.mockReturnValue({
            data_mandatos_anteriores: mockMandatos,
            isError: false,
        });

        renderComponent({ mandatoUuid: 'uuid-1' });

        const label = screen.getByText('Selecionar período');
        const select = screen.getByLabelText(/selecionar período/i);
        
        expect(label).toBeInTheDocument();
        expect(select).toBeInTheDocument();
        expect(select.value).toBe('uuid-1');

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveValue('uuid-1');
        expect(options[0].textContent).toBe('2020-01-01 até 2022-01-01');
        expect(options[1]).toHaveValue('uuid-2');
        expect(options[1].textContent).toBe('2022-01-02 até 2024-01-01');
    });

    it('não deve renderizar nada se "data_mandatos_anteriores" for nulo ou indefinido', () => {
        useGetMandatosAnteriores.mockReturnValue({
            data_mandatos_anteriores: null,
            isError: false,
        });

        renderComponent();

        const select = screen.queryByLabelText(/selecionar período/i);
        expect(select).not.toBeInTheDocument();
    });

    it('não deve renderizar nada se houver um estado de erro (isError === true)', () => {
        useGetMandatosAnteriores.mockReturnValue({
            data_mandatos_anteriores: mockMandatos,
            isError: true,
        });

        renderComponent();

        const select = screen.queryByLabelText(/selecionar período/i);
        expect(select).not.toBeInTheDocument();
    });

    it('deve renderizar o select vazio se a lista de mandatos vier vazia', () => {
        useGetMandatosAnteriores.mockReturnValue({
            data_mandatos_anteriores: [],
            isError: false,
        });

        renderComponent();

        const select = screen.getByLabelText(/selecionar período/i);
        expect(select).toBeInTheDocument();
        expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('deve chamar a função setMandatoUuid do contexto quando o usuário alterar a opção selecionada', async () => {
        useGetMandatosAnteriores.mockReturnValue({
            data_mandatos_anteriores: mockMandatos,
            isError: false,
        });

        renderComponent({ mandatoUuid: 'uuid-1' });
        
        const select = screen.getByLabelText(/selecionar período/i);
        
        await userEvent.selectOptions(select, 'uuid-2');

        expect(mockSetMandatoUuid).toHaveBeenCalledTimes(1);
        expect(mockSetMandatoUuid).toHaveBeenCalledWith('uuid-2');
    })

    it('deve lidar corretamente com a ausência de data_inicial ou data_final', () => {
        const mandatosIncompletos = [
            { uuid: 'uuid-3', id: 30, data_inicial: null, data_final: '2025-01-01' },
            { uuid: 'uuid-4', id: 40, data_inicial: '2025-01-02', data_final: undefined }
        ];

        useGetMandatosAnteriores.mockReturnValue({
            data_mandatos_anteriores: mandatosIncompletos,
            isError: false,
        });

        renderComponent();

        const options = screen.getAllByRole('option');
        
        expect(options[0].textContent).toBe(' até 2025-01-01');
        expect(options[1].textContent).toBe('2025-01-02 até ');
    });
});