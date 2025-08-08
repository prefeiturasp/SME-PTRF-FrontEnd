import { render, screen, waitFor } from '@testing-library/react';
import { PresidenteAusente } from '../PresidenteAusente';
import * as prestacaoService from '../../../../services/escolas/PrestacaoDeContas.service';
import { barraMensagemCustom } from '../../../Globais/BarraMensagem';

jest.mock('../../../../services/escolas/PrestacaoDeContas.service');
jest.mock('../../../Globais/BarraMensagem', () => ({
  barraMensagemCustom: {
    BarraMensagemSucessAzul: jest.fn((msg) => <div data-testid="mensagem">{msg}</div>),
  },
}));
jest.mock('../../../../services/auth.service', () => ({
  ASSOCIACAO_UUID: 'UUID_FAKE',
}));

describe('PresidenteAusente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('UUID_FAKE', 'uuid-assoc');
  });

  const mockStatusPC = {
    prestacao_contas_status: {
      documentos_gerados: false,
    },
  };

  it('não exibe a barra se o presidente não estiver ausente', async () => {
    prestacaoService.getStatusPresidente.mockResolvedValue({
      status_presidente: 'PRESENTE',
      cargo_substituto_presidente_ausente_value: '',
    });

    render(<PresidenteAusente statusPC={mockStatusPC} />);

    await waitFor(() => {
      expect(screen.queryByTestId('mensagem')).not.toBeInTheDocument();
    });
  });

  it('não exibe a barra se documentos já foram gerados', async () => {
    prestacaoService.getStatusPresidente.mockResolvedValue({
      status_presidente: 'AUSENTE',
      cargo_substituto_presidente_ausente_value: 'vice-presidente da diretoria executiva',
    });

    render(
      <PresidenteAusente
        statusPC={{ prestacao_contas_status: { documentos_gerados: true } }}
      />
    );

    await waitFor(() => {
      expect(screen.queryByTestId('mensagem')).not.toBeInTheDocument();
    });
  });

  it('não exibe a barra se statusPC for undefined', async () => {
    prestacaoService.getStatusPresidente.mockResolvedValue({
      status_presidente: 'AUSENTE',
      cargo_substituto_presidente_ausente_value: 'secretário',
    });

    render(<PresidenteAusente statusPC={undefined} />);

    await waitFor(() => {
      expect(screen.queryByTestId('mensagem')).not.toBeInTheDocument();
    });
  });
});