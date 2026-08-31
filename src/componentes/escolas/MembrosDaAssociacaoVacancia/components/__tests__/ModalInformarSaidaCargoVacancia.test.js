import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from 'moment';

import { ModalInformarSaidaCargoVacancia } from '../ModalInformarSaidaCargoVacancia';

const mockDatePickerField = jest.fn();

jest.mock('../../../../Globais/DatePickerField', () => ({
    DatePickerField: (props) => {
        mockDatePickerField(props);

        return (
            <input
                aria-label="Data da saída"
                value={props.value || ''}
                placeholder={props.placeholderText}
                onChange={(e) => props.onChange(props.name, e.target.value)}
            />
        );
    }
}));

describe('ModalInformarSaidaCargoVacancia', () => {
    const setup = (props = {}) => {
        const handleClose = jest.fn();
        const handleConfirm = jest.fn();

        render(
            <ModalInformarSaidaCargoVacancia
                show
                dataInicioNoCargo="2026-01-01"
                dataFinalMandato="2026-12-31"
                handleClose={handleClose}
                handleConfirm={handleConfirm}
                {...props}
            />
        );

        return {
            handleClose,
            handleConfirm
        };
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('renderização', () => {
        it('deve renderizar o modal com os elementos principais', () => {
            setup();

            expect(screen.getByText(/informar saída do cargo/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/data da saída/i)).toBeInTheDocument();
            expect(screen.getByRole('button', {name: /cancelar/i})).toBeInTheDocument();
            expect(screen.getByRole('button', {name: /confirmar/i})).toBeInTheDocument();
        });
    });

    describe('botão confirmar', () => {
        it('deve iniciar desabilitado quando não houver data', () => {
            setup();

            expect(screen.getByRole('button', {name: /confirmar/i})).toBeDisabled();
        });

        it('deve habilitar após informar uma data', () => {
            setup();

            fireEvent.change(
                screen.getByLabelText(/data da saída/i),
                { target: {value: '10/06/2026'} }
            );

            expect(screen.getByRole('button', {name: /confirmar/i})).toBeEnabled();
        });
    });

    describe('interações', () => {
        it('deve chamar handleClose ao clicar em cancelar', () => {
            const {handleClose} = setup();

            fireEvent.click(screen.getByRole('button', {name: /cancelar/i}));

            expect(handleClose).toHaveBeenCalledTimes(1);
        });

        it('deve chamar handleConfirm com a data selecionada', () => {
            const {handleConfirm} = setup();

            fireEvent.change(
                screen.getByLabelText(/data da saída/i),
                { target: {value: '15/06/2026'} }
            );

            fireEvent.click(screen.getByRole('button', {name: /confirmar/i}));

            expect(handleConfirm).toHaveBeenCalledTimes(1);
            expect(handleConfirm).toHaveBeenCalledWith('15/06/2026');
        });
    });

    describe('DatePickerField', () => {
        it('deve enviar minDate um dia depois de dataInicioNoCargo (não permite data igual à de entrada)', () => {
            setup();

            const propsRecebidas = mockDatePickerField.mock.calls[0][0];

            expect(propsRecebidas.minDate).toEqual(moment('2026-01-02').toDate());
        });

        it('deve enviar minDate vazio quando dataInicioNoCargo não for informada', () => {
            setup({ dataInicioNoCargo: undefined });

            const propsRecebidas = mockDatePickerField.mock.calls[0][0];

            expect(propsRecebidas.minDate).toBe('');
        });

        it('deve calcular corretamente o maxDate quando dataFinalMandato estiver no futuro', () => {
            setup();

            const propsRecebidas = mockDatePickerField.mock.calls[0][0];

            expect(propsRecebidas.maxDate).toBeInstanceOf(Date);

            const hoje = new Date();

            expect(propsRecebidas.maxDate.getFullYear()).toBe(hoje.getFullYear());
            expect(propsRecebidas.maxDate.getMonth()).toBe(hoje.getMonth());
            expect(propsRecebidas.maxDate.getDate()).toBe(hoje.getDate());
        });

        it('deve usar dataFinalMandato como maxDate quando ela estiver no passado', () => {
            const dataFinalPassada = '2020-12-31';

            setup({ dataFinalMandato: dataFinalPassada });

            const propsRecebidas = mockDatePickerField.mock.calls[0][0];

            expect(propsRecebidas.maxDate).toEqual(moment(dataFinalPassada).toDate());
        });

        it('deve enviar maxDate vazio quando dataFinalMandato não for informada', () => {
            setup({ dataFinalMandato: undefined });

            const propsRecebidas = mockDatePickerField.mock.calls[0][0];

            expect(propsRecebidas.maxDate).toBe('');
        });
    });
});
