import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CamposStatusPresidente } from '../CamposStatusPresidente';
import * as mandatosService from '../../../../services/MandatosVacancia.service';

jest.mock('../../../../services/MandatosVacancia.service');
jest.mock('../../../../services/auth.service', () => ({
  ASSOCIACAO_UUID: 'UUID_FAKE',
}));

const substitutosOcupados = [
  { id: 'VICE_PRESIDENTE_DIRETORIA_EXECUTIVA', cargo: 'Vice-Presidente', nome: 'Ana Vice' },
  { id: 'VOGAL_1', cargo: 'Vogal', nome: 'Bruno Vogal' },
];

const conselheirosOcupados = [
  { id: 'PRESIDENTE_CONSELHO_FISCAL', nome: 'Ana Goncalves Barros' },
  { id: 'CONSELHEIRO_1', nome: 'Carlos Conselheiro' },
];

const CamposComConclusao = ({statusDoPeriodo, cargoDoPeriodo, conselheiroDoPeriodo}) => {
  const [podeConcluir, setPodeConcluir] = useState(false);

  return (
    <>
      <CamposStatusPresidente
        statusDoPeriodo={statusDoPeriodo}
        cargoDoPeriodo={cargoDoPeriodo}
        conselheiroDoPeriodo={conselheiroDoPeriodo}
        onDefinir={(_dados, valido) => setPodeConcluir(valido)}
      />
      <button type="button" disabled={!podeConcluir}>Concluir período</button>
    </>
  );
};

const promessaPendente = () => new Promise(() => {});

describe('CamposStatusPresidente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('UUID_FAKE', 'uuid-assoc');
    mandatosService.getSubstitutosPresidenteVacancia.mockResolvedValue(substitutosOcupados);
    mandatosService.getConselheirosAssinaturaVacancia.mockResolvedValue(conselheirosOcupados);
  });

  describe('carregamento', () => {
    it('deve desabilitar o status, o conselheiro e a conclusão enquanto os dados carregam', () => {
      mandatosService.getSubstitutosPresidenteVacancia.mockReturnValue(promessaPendente());
      mandatosService.getConselheirosAssinaturaVacancia.mockReturnValue(promessaPendente());

      render(<CamposComConclusao />);

      expect(screen.getByRole('switch')).toBeDisabled();
      expect(screen.getByRole('combobox', { name: 'Conselheiro da assinatura' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();
      expect(screen.queryByLabelText('Responsável pelas atribuições:')).not.toBeInTheDocument();
    });
  });

  describe('edição', () => {
    it('deve abrir presente e sem seleção quando o período não tem prestação salva', async () => {
      render(<CamposComConclusao />);

      await screen.findByRole('option', { name: 'Ana Goncalves Barros' });
      expect(screen.queryByLabelText('Responsável pelas atribuições:')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Conselheiro da assinatura' })).toHaveDisplayValue(
        'Escolha o conselheiro',
      );
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();
    });

    it('deve pré-selecionar o conselheiro gravado na prestação deste período', async () => {
      render(<CamposComConclusao conselheiroDoPeriodo="PRESIDENTE_CONSELHO_FISCAL" />);

      await screen.findByRole('option', { name: 'Ana Goncalves Barros' });
      expect(screen.getByRole('combobox', { name: 'Conselheiro da assinatura' })).toHaveDisplayValue(
        'Ana Goncalves Barros',
      );
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeEnabled();
    });

    it('deve pré-selecionar o responsável gravado na prestação deste período', async () => {
      render(
        <CamposComConclusao
          statusDoPeriodo="AUSENTE"
          cargoDoPeriodo="VOGAL_1"
          conselheiroDoPeriodo="PRESIDENTE_CONSELHO_FISCAL"
        />,
      );

      expect(await screen.findByLabelText('Responsável pelas atribuições:')).toHaveDisplayValue('Vogal - Bruno Vogal');
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeEnabled();
    });

    it('deve ocultar o responsável e manter a conclusão habilitada ao marcar o presidente como presente', async () => {
      const user = userEvent.setup();
      render(
        <CamposComConclusao
          statusDoPeriodo="AUSENTE"
          cargoDoPeriodo="VOGAL_1"
          conselheiroDoPeriodo="PRESIDENTE_CONSELHO_FISCAL"
        />,
      );

      await screen.findByLabelText('Responsável pelas atribuições:');
      await user.click(screen.getByRole('switch'));

      expect(screen.queryByLabelText('Responsável pelas atribuições:')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Conselheiro da assinatura' })).toHaveDisplayValue(
        'Ana Goncalves Barros',
      );
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeEnabled();
    });

    it('deve desabilitar a conclusão quando o presidente está ausente e nenhum responsável foi escolhido', async () => {
      const user = userEvent.setup();
      render(<CamposComConclusao conselheiroDoPeriodo="PRESIDENTE_CONSELHO_FISCAL" />);

      await screen.findByRole('option', { name: 'Ana Goncalves Barros' });
      await user.click(screen.getByRole('switch'));

      expect(screen.getByLabelText('Responsável pelas atribuições:')).toHaveDisplayValue('Escolha o responsável');
      expect(screen.getByRole('option', { name: 'Escolha o responsável' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();
    });

    it('deve desabilitar a conclusão enquanto nenhum conselheiro está selecionado', async () => {
      const user = userEvent.setup();
      render(<CamposComConclusao />);

      await screen.findByRole('option', { name: 'Carlos Conselheiro' });
      const conselheiro = screen.getByRole('combobox', { name: 'Conselheiro da assinatura' });
      expect(conselheiro).toHaveDisplayValue('Escolha o conselheiro');
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();

      await user.selectOptions(conselheiro, 'CONSELHEIRO_1');

      expect(conselheiro).toHaveDisplayValue('Carlos Conselheiro');
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeEnabled();
    });

    it('deve deixar o responsável em branco quando o cargo salvo não está mais ocupado', async () => {
      mandatosService.getSubstitutosPresidenteVacancia.mockResolvedValue([
        { id: 'VICE_PRESIDENTE_DIRETORIA_EXECUTIVA', cargo: 'Vice-Presidente', nome: 'Ana Vice' },
      ]);
      render(
        <CamposComConclusao
          statusDoPeriodo="AUSENTE"
          cargoDoPeriodo="VOGAL_1"
          conselheiroDoPeriodo="PRESIDENTE_CONSELHO_FISCAL"
        />,
      );

      expect(await screen.findByLabelText('Responsável pelas atribuições:')).toHaveDisplayValue(
        'Escolha o responsável',
      );
      expect(screen.queryByRole('option', { name: 'Vogal - Bruno Vogal' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();
    });

    it('deve exibir só a opção de escolha quando não há substituto ocupado', async () => {
      mandatosService.getSubstitutosPresidenteVacancia.mockResolvedValue([]);
      render(<CamposComConclusao statusDoPeriodo="AUSENTE" />);

      const responsavel = await screen.findByLabelText('Responsável pelas atribuições:');

      expect(responsavel).toHaveDisplayValue('Escolha o responsável');
      expect(screen.getByRole('option', { name: 'Escolha o responsável' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'Vogal - Bruno Vogal' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Concluir período' })).toBeDisabled();
    });
  });
});
