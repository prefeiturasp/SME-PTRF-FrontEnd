import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormularioAcertosDevolucaoAoTesouro } from '../FormularioAcertosDevolucaoAoTesouro';
import { ValidarParcialTesouro } from '../../../../../../../context/DetalharAcertos';

jest.mock('../../../../../../Globais/DatePickerField', () => ({
    DatePickerField: ({ name }) => (
        <input type='text' aria-label='Data da devolução' name={name} readOnly />
    ),
}));

jest.mock('../../../../../../Globais/ReactNumberFormatInput', () => ({
    ReactNumberFormatInput: ({ value, onChangeEvent, disabled, name }) => (
        <input
            type='text'
            aria-label='Valor'
            name={name}
            value={value}
            disabled={disabled}
            onChange={onChangeEvent}
        />
    ),
}));

jest.mock('../../../../../../../services/visoes.service', () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn().mockReturnValue('UE'),
    },
}));

const renderComponent = ({ valorDocumento = 1000, devolucao_total = 'false', handleChange = jest.fn() } = {}) => {
    const setIsValorParcialValido = jest.fn();

    const acerto = {
        devolucao_tesouro: {
            tipo: '',
            data: '',
            devolucao_total,
            valor: '',
        },
    };

    render(
        <ValidarParcialTesouro.Provider value={{ setIsValorParcialValido }}>
            <FormularioAcertosDevolucaoAoTesouro
                formikProps={{
                    handleChange,
                    setFieldValue: jest.fn(),
                    errors: {},
                }}
                acerto={acerto}
                index={0}
                tiposDevolucao={[{ id: 1, uuid: 'DEV1', nome: 'Devolução Tesouro' }]}
                valorDocumento={valorDocumento}
            />
        </ValidarParcialTesouro.Provider>,
    );

    return { setIsValorParcialValido, handleChange };
};

describe('FormularioAcertosDevolucaoAoTesouro', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar os campos principais', () => {
        renderComponent();

        expect(screen.getByText('Tipo de devolução')).toBeInTheDocument();
        expect(screen.getByLabelText('Data da devolução')).toBeInTheDocument();
        expect(screen.getByText('Valor total ou parcial da despesa')).toBeInTheDocument();
        expect(screen.getByLabelText('Valor')).toBeInTheDocument();
    });

    it('deve desabilitar o campo Valor quando a devolução é total', async () => {
        const user = userEvent.setup();
        renderComponent({ devolucao_total: 'true' });

        const selects = screen.getAllByRole('combobox');
        await user.selectOptions(selects[1], 'true');

        expect(screen.getByLabelText('Valor')).toBeDisabled();
    });

    it('deve manter o valor como inválido quando o valor parcial é maior que o documento', async () => {
        const user = userEvent.setup();
        const { setIsValorParcialValido } = renderComponent({
            valorDocumento: 1000,
        });

        await user.type(screen.getByLabelText('Valor'), 'R$1500,00');

        expect(setIsValorParcialValido).toHaveBeenCalled();
        expect(setIsValorParcialValido).not.toHaveBeenCalledWith(true);
        expect(setIsValorParcialValido).toHaveBeenLastCalledWith(false);
    });

    it('deve manter o valor como inválido quando o valor parcial é igual ao documento', async () => {
        const user = userEvent.setup();
        const { setIsValorParcialValido } = renderComponent({
            valorDocumento: 1000,
        });

        await user.type(screen.getByLabelText('Valor'), 'R$1000,00');

        expect(setIsValorParcialValido).not.toHaveBeenCalledWith(true);
        expect(setIsValorParcialValido).toHaveBeenLastCalledWith(false);
    });

    it('deve invalidar e exibir erro quando o valor parcial informado de uma vez é maior que o documento', () => {
        const { setIsValorParcialValido } = renderComponent({ valorDocumento: 1000 });

        fireEvent.change(screen.getByLabelText('Valor'), { target: { value: 'R$1.500,00' } });

        expect(setIsValorParcialValido).toHaveBeenCalledWith(true);
        expect(
            screen.getByText('O valor parcial não pode ser maior que o valor do documento'),
        ).toBeInTheDocument();
    });

    it('deve invalidar e exibir erro quando o valor parcial informado de uma vez é igual ao documento', () => {
        const { setIsValorParcialValido } = renderComponent({ valorDocumento: 1000 });

        fireEvent.change(screen.getByLabelText('Valor'), { target: { value: 'R$1.000,00' } });

        expect(setIsValorParcialValido).toHaveBeenCalledWith(true);
        expect(
            screen.getByText('O valor parcial não pode ser igual ao valor do documento'),
        ).toBeInTheDocument();
    });

    it('deve chamar handleChange do formik ao selecionar o tipo de devolução', async () => {
        const user = userEvent.setup();
        const { handleChange } = renderComponent();

        await user.selectOptions(screen.getByLabelText('Tipo de devolução'), 'DEV1');

        expect(handleChange).toHaveBeenCalled();
    });
});
