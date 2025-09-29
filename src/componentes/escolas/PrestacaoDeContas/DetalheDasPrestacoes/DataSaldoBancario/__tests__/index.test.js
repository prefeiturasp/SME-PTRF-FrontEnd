import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import DataSaldoBancario from '../index';
import { visoesService } from '../../../../../../services/visoes.service';

jest.mock('../../../../../../services/visoes.service', () => ({
  visoesService: {
    getPermissoes: jest.fn()
  }
}));

jest.mock('../../../../../Globais/DatePickerField', () => ({
  DatePickerField: (props) => (
    <input
      data-testid="date-picker"
      value={props.value}
      onChange={(e) => props.onChange({ target: { value: e.target.value } })}
    />
  )
}));

jest.mock('../../../../../Globais/ReactNumberFormatInput', () => ({
  ReactNumberFormatInput: ({ value, onChangeEvent, ...rest }) => (
    <input
      data-testid="currency-input"
      value={value}
      onChange={(e) => onChangeEvent({ target: { name: rest.name, value: e.target.value } })}
    />
  )
}));

jest.mock('../../../../../Globais/ReactNumberFormatInput/indexv2', () => ({
  __esModule: true,
  ReactNumberFormatInputV2: (props) => <input data-testid="react-number-format-mock" {...props} />,
}));

describe('DataSaldoBancario', () => {
    const defaultProps = {
        valoresPendentes: { saldo_posterior_total: 1000 },
        dataSaldoBancario: { data_extrato: '', saldo_extrato: 0 },
        handleChangaDataSaldo: jest.fn(),
        periodoFechado: false,
        nomeComprovanteExtrato: 'comprovante.pdf',
        exibeBtnDownload: true,
        msgErroExtensaoArquivo: 'test mensagem de erro',
        changeUploadExtrato: jest.fn(),
        reiniciaUploadExtrato: jest.fn(),
        downloadComprovanteExtrato: jest.fn(),
        salvarExtratoBancario: jest.fn(),
        btnSalvarExtratoBancarioDisable: false,
        setBtnSalvarExtratoBancarioDisable: jest.fn(),
        classBtnSalvarExtratoBancario: 'primary',
        setClassBtnSalvarExtratoBancario: jest.fn(),
        checkSalvarExtratoBancario: false,
        setCheckSalvarExtratoBancario: jest.fn(),
        erroDataSaldo: '',
        dataAtualizacaoComprovanteExtrato: '30/07/2025',
        permiteEditarCamposExtrato: true,
        pendenciaSaldoBancario: false,
        dataSaldoBancarioSolicitacaoEncerramento: null,
        setShowModalSalvarDataSaldoExtrato: jest.fn()
    };

    beforeEach(() => {
        visoesService.getPermissoes.mockReturnValue(true);
    });

    it('deve renderizar data e saldo corretamente', async () => {
        render(<DataSaldoBancario {...defaultProps} />);

        await waitFor(() => {
            const dateInput = screen.getByTestId('date-picker');
            expect(dateInput).toBeInTheDocument();
        })
    });

    it('deve chamar salvarExtratoBancario ao clicar no botão salvar sem pendência', () => {
        render(<DataSaldoBancario {...defaultProps} />);

        const salvarButton = screen.getByRole('button', { name: /salvar saldo/i });
        fireEvent.click(salvarButton);

        expect(defaultProps.salvarExtratoBancario).toHaveBeenCalled();
    });

    it('deve exibir nome do comprovante e botão de download', () => {
        render(<DataSaldoBancario {...defaultProps} />);

        expect(screen.getByText(/comprovante.pdf/)).toBeInTheDocument();
        expect(screen.getByText(/atualizado em: 30\/07\/2025/i)).toBeInTheDocument();
    });

    it('deve exibir a data de encerramento da conta quando houver solicitação de encerramento', () => {
        const propsComSolicitacaoEncerramento = {
            ...defaultProps,
            dataSaldoBancarioSolicitacaoEncerramento: {
                data_extrato: '2023-06-28',
                saldo_encerramento: 10,
                possui_solicitacao_encerramento: true,
                data_encerramento: '2025-07-25'
            },
            checkSalvarExtratoBancario: true
        };

        render(<DataSaldoBancario {...propsComSolicitacaoEncerramento} />);

        expect(
            screen.getByText(/Data de encerramento da conta: 25\/07\/2025/)
        ).toBeInTheDocument();
    });

    it('deve abrir o modal ao tentar salvar com diferença de datas entre encerramento e formulário', () => {
        const setShowModalSalvarDataSaldoExtrato = jest.fn();

        const props = {
            ...defaultProps,
            setShowModalSalvarDataSaldoExtrato,
            dataSaldoBancario: {
                data_extrato: '2025-07-20', // diferente da data de encerramento
                saldo_extrato: 1234
            },
            dataSaldoBancarioSolicitacaoEncerramento: {
                possui_solicitacao_encerramento: true,
                data_encerramento: '2025-07-25',
                saldo_encerramento: 1111
            },
            erroDataSaldo: 'testa erro data saldo'
        };

        render(<DataSaldoBancario {...props} />);

        const salvarButton = screen.getByRole('button', { name: /salvar saldo/i });
        fireEvent.click(salvarButton);

        expect(setShowModalSalvarDataSaldoExtrato).toHaveBeenCalledWith(true);
    });
});
