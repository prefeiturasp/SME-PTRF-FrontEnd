import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModalVisualizarExtrato from '../ModalVisualizarExtrato';
import { getVisualizarExtratoBancario } from "../../../../services/sme/Parametrizacoes.service";

jest.mock('../../../../services/sme/Parametrizacoes.service', () => ({
  getVisualizarExtratoBancario: jest.fn()
}));

const mockHandleClose = jest.fn();
const props = {
  show: true,
  handleClose: mockHandleClose,
  observacaoUuid: "uuid-007"
}



describe('Componente Modal Visualizar Extrato', () => {
  it('renderiza o modal', () => {
    getVisualizarExtratoBancario.mockReturnValue({data: "123"});
    render(<ModalVisualizarExtrato {...props} />);
    waitFor(() => {
      expect(getVisualizarExtratoBancario).toHaveBeenCalledWith("uuid-007");
    });
  });
});