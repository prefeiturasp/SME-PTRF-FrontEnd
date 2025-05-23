import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tags } from '../index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, ...props }) => <a href={to.pathname || to} {...props}>{children}</a>,
}));

describe('Tags Component', () => {
  const mockFormikPropsBase = {
    handleChange: jest.fn(),
    setFieldValue: jest.fn(),
  };

  const mockDespesasTabelas = {
    tags: [
      { uuid: 'tag1-uuid', nome: 'Tag 1' },
      { uuid: 'tag2-uuid', nome: 'Tag 2' },
    ],
  };

  const getProps = (escolha_tags = 'sim') => {
    const rateioIndex = 0;
    const rateioData = { escolha_tags, tag: 'tag1-uuid' };
    const formikValues = {
      rateios: [],
    };
    formikValues.rateios[rateioIndex] = rateioData;

    return {
      formikProps: {
        ...mockFormikPropsBase,
        values: formikValues,
      },
      index: rateioIndex,
      rateio: rateioData,
      verboHttp: 'POST',
      disabled: false,
      despesasTabelas: mockDespesasTabelas,
      bloqueiaRateioEstornado: jest.fn(() => false),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders na condição de escolha_tags == sim', () => {
    render(<Tags {...getProps()} />);

    expect(screen.getByText('Esse gasto possui vínculo com alguma atividade específica?')).toBeInTheDocument();
    expect(screen.getByLabelText('Sim')).toBeInTheDocument();
    expect(screen.getByLabelText('Não')).toBeInTheDocument();

    expect(screen.getByLabelText('Não')).not.toBeChecked();
    expect(screen.getByLabelText('Sim')).toBeChecked();

    expect(screen.queryByRole('combobox')).toBeInTheDocument();
  });

  test('renders na condição de escolha_tags == não', () => {
    render(<Tags {...getProps('nao')} />);

    expect(screen.getByText('Esse gasto possui vínculo com alguma atividade específica?')).toBeInTheDocument();
    expect(screen.getByLabelText('Sim')).toBeInTheDocument();
    expect(screen.getByLabelText('Não')).toBeInTheDocument();

    expect(screen.getByLabelText('Não')).toBeChecked();
    expect(screen.getByLabelText('Sim')).not.toBeChecked();

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  test('handles "Sim" radio button click', async () => {
    const props = getProps('nao');
    render(<Tags {...props} />);

    expect(screen.getByLabelText('Não')).toBeChecked();

    const radioNao = screen.getByLabelText('Não');
    const radioSim = screen.getByLabelText('Sim');
    await fireEvent.click(radioSim);
    await fireEvent.click(radioNao);
    expect(radioNao.value).toBe('nao');
    expect(radioSim.value).toBe('sim');

    expect(props.formikProps.handleChange).toHaveBeenCalledTimes(1);
    expect(props.formikProps.setFieldValue).toHaveBeenCalledWith('rateios[0].escolha_tags', 'sim');

    await waitFor(() => {
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
  });

  test('altera a selecao de tag', async () => {
    const props = getProps('sim');
    render(<Tags {...props} />);
    const user = userEvent;

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    user.selectOptions(selectElement, 'tag2-uuid');

    expect(props.formikProps.handleChange).toHaveBeenCalledTimes(1);
  });

  test('disables elements when `bloqueiaRateioEstornado` returns true', () => {
    const mockBloqueiaRateioEstornado = jest.fn(() => true);
    const props = getProps('sim');
    props.bloqueiaRateioEstornado = mockBloqueiaRateioEstornado,
    render(<Tags {...props} />);

    expect(screen.getByLabelText('Sim')).toBeDisabled();
    expect(screen.getByLabelText('Não')).toBeDisabled();
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(mockBloqueiaRateioEstornado).toHaveBeenCalledWith(props.rateio);
  });

});