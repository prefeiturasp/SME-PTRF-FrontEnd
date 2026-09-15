import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalConcluirAnalise } from '../ModalConcluirAnalise';

jest.mock('../../../Globais/ModalBootstrap', () => ({
    ModalBootstrapFormConcluirAnalise: ({ show, titulo, bodyText }) => (
        show ? (
            <div data-testid="modal-concluir-analise">
                <h1>{titulo}</h1>
                <div>{bodyText}</div>
            </div>
        ) : null
    ),
}));

jest.mock('primereact/multiselect', () => ({
    MultiSelect: ({ value, options, onChange, placeholder, optionLabel, selectedItemsLabel }) => (
        <div>
            <div data-testid="multiselect-label">{selectedItemsLabel}</div>
            <select
                data-testid="multiselect-select"
                multiple
                value={value ? value.map((v) => options.indexOf(v)) : []}
                onChange={(e) => {
                    const indexes = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
                    onChange({ value: indexes.map((i) => options[i]) });
                }}
            >
                <option value="" disabled>{placeholder}</option>
                {options && options.map((option, index) => (
                    <option key={index} value={index}>{option[optionLabel]}</option>
                ))}
            </select>
        </div>
    ),
}));

describe('ModalConcluirAnalise', () => {
    const tabelaPrestacoes = {
        status_de_conclusao_de_pc: [
            { id: 'APROVADA', nome: 'Aprovada' },
            { id: 'APROVADA_RESSALVA', nome: 'Aprovada com ressalva' },
            { id: 'REPROVADA', nome: 'Reprovada' },
        ],
    };

    const baseProps = {
        show: true,
        handleClose: jest.fn(),
        titulo: 'Concluir análise',
        primeiroBotaoTexto: 'Cancelar',
        primeiroBotaoCss: '',
        segundoBotaoCss: '',
        segundoBotaoTexto: 'Confirmar',
        tabelaPrestacoes,
        stateConcluirAnalise: { status: '' },
        handleChangeConcluirAnalise: jest.fn(),
        motivos: [],
        motivosAprovadoComRessalva: [
            { uuid: 'm1', motivo: 'Motivo 1' },
            { uuid: 'm2', motivo: 'Motivo 2' },
        ],
        setMotivos: jest.fn(),
        checkBoxOutrosMotivos: false,
        handleChangeCheckBoxOutrosMotivos: jest.fn(),
        txtOutrosMotivos: '',
        handleChangeTxtOutrosMotivos: jest.fn(),
        txtRecomendacoes: '',
        handleChangeTxtRecomendacoes: jest.fn(),
        selectMotivosReprovacao: [],
        motivosReprovacao: [
            { uuid: 'r1', motivo: 'Motivo reprovação 1' },
            { uuid: 'r2', motivo: 'Motivo reprovação 2' },
        ],
        setSelectMotivosReprovacao: jest.fn(),
        checkBoxOutrosMotivosReprovacao: false,
        handleChangeCheckBoxOutrosMotivosReprovacao: jest.fn(),
        txtOutrosMotivosReprovacao: '',
        handleChangeTxtOutrosMotivosReprovacao: jest.fn(),
        onConcluirAnalise: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('não renderiza o modal quando show é false', () => {
        render(<ModalConcluirAnalise {...baseProps} show={false} />);
        expect(screen.queryByTestId('modal-concluir-analise')).not.toBeInTheDocument();
    });

    it('renderiza o título e as opções de status disponíveis', () => {
        render(<ModalConcluirAnalise {...baseProps} />);
        expect(screen.getByText('Concluir análise')).toBeInTheDocument();
        expect(screen.getByText('Aprovada')).toBeInTheDocument();
        expect(screen.getByText('Aprovada com ressalva')).toBeInTheDocument();
        expect(screen.getByText('Reprovada')).toBeInTheDocument();
    });

    it('chama handleChangeConcluirAnalise ao selecionar o status', () => {
        const handleChangeConcluirAnalise = jest.fn();
        render(<ModalConcluirAnalise {...baseProps} handleChangeConcluirAnalise={handleChangeConcluirAnalise} />);

        fireEvent.change(screen.getByLabelText('Como você deseja concluir a análise?'), {
            target: { name: 'status', value: 'APROVADA' },
        });
        expect(handleChangeConcluirAnalise).toHaveBeenCalledWith('status', 'APROVADA');
    });

    it('desabilita o botão Confirmar quando não há status selecionado', () => {
        render(<ModalConcluirAnalise {...baseProps} />);
        expect(screen.getByText('Confirmar')).toBeDisabled();
    });

    it('mantém o botão Confirmar habilitado para status que não exigem motivos (ex: APROVADA)', () => {
        render(<ModalConcluirAnalise {...baseProps} stateConcluirAnalise={{ status: 'APROVADA' }} />);
        expect(screen.getByText('Confirmar')).not.toBeDisabled();
    });

    it('chama handleClose ao clicar em Cancelar', () => {
        const handleClose = jest.fn();
        render(<ModalConcluirAnalise {...baseProps} handleClose={handleClose} />);
        fireEvent.click(screen.getByText('Cancelar'));
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('chama onConcluirAnalise ao clicar em Confirmar quando habilitado', () => {
        const onConcluirAnalise = jest.fn();
        render(<ModalConcluirAnalise {...baseProps} stateConcluirAnalise={{ status: 'APROVADA' }} onConcluirAnalise={onConcluirAnalise} />);
        fireEvent.click(screen.getByText('Confirmar'));
        expect(onConcluirAnalise).toHaveBeenCalledTimes(1);
    });

    describe('status APROVADA_RESSALVA', () => {
        const propsRessalva = { ...baseProps, stateConcluirAnalise: { status: 'APROVADA_RESSALVA' } };

        it('exibe o MultiSelect de motivos e a lista de motivos selecionados', () => {
            render(<ModalConcluirAnalise {...propsRessalva} motivos={[{ uuid: 'm1', motivo: 'Motivo 1' }]} />);
            expect(screen.getByText('1. Motivo 1')).toBeInTheDocument();
        });

        it('exibe o rótulo no singular para 1 motivo selecionado e no plural para outras quantidades', () => {
            const { rerender } = render(<ModalConcluirAnalise {...propsRessalva} motivos={[{ uuid: 'm1', motivo: 'Motivo 1' }]} />);
            expect(screen.getByTestId('multiselect-label')).toHaveTextContent('1 selecionado');

            rerender(<ModalConcluirAnalise {...propsRessalva} motivos={[]} />);
            expect(screen.getByTestId('multiselect-label')).toHaveTextContent('0 selecionados');

            rerender(<ModalConcluirAnalise {...propsRessalva} motivos={[{ uuid: 'm1', motivo: 'Motivo 1' }, { uuid: 'm2', motivo: 'Motivo 2' }]} />);
            expect(screen.getByTestId('multiselect-label')).toHaveTextContent('2 selecionados');
        });

        it('chama setMotivos ao selecionar opções no MultiSelect', async () => {
            const user = userEvent.setup();
            const setMotivos = jest.fn();
            render(<ModalConcluirAnalise {...propsRessalva} setMotivos={setMotivos} />);

            await user.selectOptions(screen.getByTestId('multiselect-select'), ['0']);
            expect(setMotivos).toHaveBeenCalledWith([{ uuid: 'm1', motivo: 'Motivo 1' }]);
        });

        it('exibe o campo de texto "Outro motivo" apenas quando o checkbox está marcado', () => {
            const { container, rerender } = render(<ModalConcluirAnalise {...propsRessalva} checkBoxOutrosMotivos={false} />);
            expect(container.querySelector('textarea[name="outros_motivos_aprovacao_ressalva"]')).not.toBeInTheDocument();

            rerender(<ModalConcluirAnalise {...propsRessalva} checkBoxOutrosMotivos={true} />);
            expect(container.querySelector('textarea[name="outros_motivos_aprovacao_ressalva"]')).toBeInTheDocument();
        });

        it('chama handleChangeCheckBoxOutrosMotivos ao marcar o checkbox', () => {
            const handleChangeCheckBoxOutrosMotivos = jest.fn();
            render(<ModalConcluirAnalise {...propsRessalva} handleChangeCheckBoxOutrosMotivos={handleChangeCheckBoxOutrosMotivos} />);
            fireEvent.click(screen.getByLabelText('Outros motivos'));
            expect(handleChangeCheckBoxOutrosMotivos).toHaveBeenCalledTimes(1);
        });

        it('chama handleChangeTxtOutrosMotivos ao digitar no campo de outro motivo', () => {
            const handleChangeTxtOutrosMotivos = jest.fn();
            const { container } = render(<ModalConcluirAnalise {...propsRessalva} checkBoxOutrosMotivos={true} handleChangeTxtOutrosMotivos={handleChangeTxtOutrosMotivos} />);
            fireEvent.change(container.querySelector('textarea[name="outros_motivos_aprovacao_ressalva"]'), { target: { value: 'Motivo livre' } });
            expect(handleChangeTxtOutrosMotivos).toHaveBeenCalledTimes(1);
        });

        it('chama handleChangeTxtRecomendacoes ao digitar nas recomendações', () => {
            const handleChangeTxtRecomendacoes = jest.fn();
            render(<ModalConcluirAnalise {...propsRessalva} handleChangeTxtRecomendacoes={handleChangeTxtRecomendacoes} />);
            fireEvent.change(screen.getByPlaceholderText('Informe as recomendações (campo obrigatório)'), { target: { value: 'Recomendação X' } });
            expect(handleChangeTxtRecomendacoes).toHaveBeenCalledTimes(1);
        });

        it('desabilita Confirmar sem motivos e sem outros motivos', () => {
            render(<ModalConcluirAnalise {...propsRessalva} motivos={[]} txtOutrosMotivos="" txtRecomendacoes="Rec" />);
            expect(screen.getByText('Confirmar')).toBeDisabled();
        });

        it('desabilita Confirmar quando há motivos mas faltam recomendações', () => {
            render(<ModalConcluirAnalise {...propsRessalva} motivos={[{ uuid: 'm1', motivo: 'Motivo 1' }]} txtRecomendacoes="" />);
            expect(screen.getByText('Confirmar')).toBeDisabled();
        });

        it('habilita Confirmar com outros motivos preenchidos mesmo sem motivos selecionados, desde que haja recomendações', () => {
            render(<ModalConcluirAnalise {...propsRessalva} motivos={[]} txtOutrosMotivos="Motivo livre" txtRecomendacoes="Rec" />);
            expect(screen.getByText('Confirmar')).not.toBeDisabled();
        });

        it('habilita Confirmar quando há motivos e recomendações preenchidas', () => {
            render(<ModalConcluirAnalise {...propsRessalva} motivos={[{ uuid: 'm1', motivo: 'Motivo 1' }]} txtRecomendacoes="Rec" />);
            expect(screen.getByText('Confirmar')).not.toBeDisabled();
        });
    });

    describe('status REPROVADA', () => {
        const propsReprovada = { ...baseProps, stateConcluirAnalise: { status: 'REPROVADA' } };

        it('exibe o MultiSelect de motivos de reprovação e a lista de selecionados', () => {
            render(<ModalConcluirAnalise {...propsReprovada} selectMotivosReprovacao={[{ uuid: 'r1', motivo: 'Motivo reprovação 1' }]} />);
            expect(screen.getByText('1. Motivo reprovação 1')).toBeInTheDocument();
        });

        it('chama setSelectMotivosReprovacao ao selecionar opções', async () => {
            const user = userEvent.setup();
            const setSelectMotivosReprovacao = jest.fn();
            render(<ModalConcluirAnalise {...propsReprovada} setSelectMotivosReprovacao={setSelectMotivosReprovacao} />);

            await user.selectOptions(screen.getByTestId('multiselect-select'), ['1']);
            expect(setSelectMotivosReprovacao).toHaveBeenCalledWith([{ uuid: 'r2', motivo: 'Motivo reprovação 2' }]);
        });

        it('exibe o campo de outros motivos de reprovação apenas quando o checkbox está marcado', () => {
            const { container, rerender } = render(<ModalConcluirAnalise {...propsReprovada} checkBoxOutrosMotivosReprovacao={false} />);
            expect(container.querySelector('textarea[name="outros_motivos_reprovacao"]')).not.toBeInTheDocument();

            rerender(<ModalConcluirAnalise {...propsReprovada} checkBoxOutrosMotivosReprovacao={true} />);
            expect(container.querySelector('textarea[name="outros_motivos_reprovacao"]')).toBeInTheDocument();
        });

        it('chama handleChangeCheckBoxOutrosMotivosReprovacao ao marcar o checkbox', () => {
            const handleChangeCheckBoxOutrosMotivosReprovacao = jest.fn();
            render(<ModalConcluirAnalise {...propsReprovada} handleChangeCheckBoxOutrosMotivosReprovacao={handleChangeCheckBoxOutrosMotivosReprovacao} />);
            fireEvent.click(screen.getByLabelText('Outros motivos'));
            expect(handleChangeCheckBoxOutrosMotivosReprovacao).toHaveBeenCalledTimes(1);
        });

        it('chama handleChangeTxtOutrosMotivosReprovacao ao digitar', () => {
            const handleChangeTxtOutrosMotivosReprovacao = jest.fn();
            const { container } = render(
                <ModalConcluirAnalise
                    {...propsReprovada}
                    checkBoxOutrosMotivosReprovacao={true}
                    handleChangeTxtOutrosMotivosReprovacao={handleChangeTxtOutrosMotivosReprovacao}
                />
            );
            fireEvent.change(container.querySelector('textarea[name="outros_motivos_reprovacao"]'), { target: { value: 'Reprovado por X' } });
            expect(handleChangeTxtOutrosMotivosReprovacao).toHaveBeenCalledTimes(1);
        });

        it('desabilita Confirmar sem motivos de reprovação e sem outros motivos', () => {
            render(<ModalConcluirAnalise {...propsReprovada} selectMotivosReprovacao={[]} txtOutrosMotivosReprovacao="" />);
            expect(screen.getByText('Confirmar')).toBeDisabled();
        });

        it('habilita Confirmar quando há motivos de reprovação selecionados', () => {
            render(<ModalConcluirAnalise {...propsReprovada} selectMotivosReprovacao={[{ uuid: 'r1', motivo: 'Motivo reprovação 1' }]} />);
            expect(screen.getByText('Confirmar')).not.toBeDisabled();
        });

        it('habilita Confirmar quando há outros motivos de reprovação preenchidos', () => {
            render(<ModalConcluirAnalise {...propsReprovada} selectMotivosReprovacao={[]} txtOutrosMotivosReprovacao="Motivo livre" />);
            expect(screen.getByText('Confirmar')).not.toBeDisabled();
        });
    });
});
