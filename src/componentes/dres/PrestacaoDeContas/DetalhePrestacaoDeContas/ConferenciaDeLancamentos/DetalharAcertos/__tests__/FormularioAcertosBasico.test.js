import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormularioAcertosBasico } from '../FormularioAcertosBasico';

describe('FormularioAcertosBasico', () => {
    const setup = ({
        detalhamento = '',
        index = 0,
        label = 'Detalhamento',
        placeholder = 'Digite o detalhamento',
    } = {}) => {
        const handleChange = jest.fn();

        render(
            <FormularioAcertosBasico
                formikProps={{ handleChange }}
                acerto={{ detalhamento }}
                index={index}
                label={label}
                placeholder={placeholder}
                required
            />,
        );

        const textarea = screen.getByLabelText(label);

        return {
            textarea,
            handleChange,
        };
    };

    describe('renderização inicial', () => {
        it('deve renderizar o label e o textarea corretamente', () => {
            setup();

            expect(screen.getByLabelText('Detalhamento')).toBeInTheDocument();
        });

        it('deve exibir o placeholder informado', () => {
            setup({ placeholder: 'Informe os dados' });

            expect(screen.getByPlaceholderText('Informe os dados')).toBeInTheDocument();
        });

        it('deve renderizar o valor inicial vindo de acerto.detalhamento', () => {
            setup({ detalhamento: 'Texto inicial' });

            expect(screen.getByDisplayValue('Texto inicial')).toBeInTheDocument();
        });
    });

    describe('interação do usuário', () => {
        it('deve chamar formikProps.handleChange ao digitar no textarea', async () => {
            const user = userEvent.setup();
            const { textarea, handleChange } = setup();

            await user.type(textarea, 'Novo texto');

            expect(handleChange).toHaveBeenCalled();
        });

        it('deve disparar o evento de mudança conforme o usuário digita', async () => {
            const user = userEvent.setup();
            const { textarea, handleChange } = setup();

            await user.type(textarea, 'Conteúdo digitado');

            expect(handleChange).toHaveBeenCalled();
            expect(handleChange).toHaveBeenCalledTimes('Conteúdo digitado'.length);
        });
    });

    describe('variações de props', () => {
        it('deve renderizar corretamente quando o index é diferente', () => {
            setup({
                index: 3,
                label: 'Outro campo',
            });

            const textarea = screen.getByLabelText('Outro campo');

            expect(textarea).toHaveAttribute('name', 'solicitacoes_acerto[3].detalhamento');
        });
    });
});
