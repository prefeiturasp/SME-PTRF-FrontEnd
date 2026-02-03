import { useEffect, useState } from 'react'
import './index.scss'
import { Select } from 'antd';

import { ModalConfirm } from '../Modal/ModalConfirm';
import { useDispatch } from 'react-redux';

import { getRecursosDisponiveis } from '../../../services/AlterarRecurso.service';

export const SelecionaRecurso = () => {
  const dispatch = useDispatch();
  const [recursoSelecionado, setRecursoSelecionado] = useState(() => {
    const recursoStorage = localStorage.getItem('recursoSelecionado');
    return recursoStorage ? JSON.parse(recursoStorage) : null;
  })
  const [recursos, setRecursos] = useState([]);
  
  const handleChangeOption = (recursoUuid) => {
    const recursoSelecionadoObj = recursos.find(r => r.uuid === recursoUuid);

    if (recursoSelecionadoObj) {
      ModalConfirm({
        dispatch: dispatch,
        title: 'Trocar de Recurso',
        // eslint-disable-next-line no-multi-str
        message: `Deseja realmente trocar de recurso para ${recursoSelecionadoObj.nome_exibicao}? <br/> \
        Ao trocar, os dados de Resumo de recursos, Créditos e Gastos da Escola e Prestação de \
        contas serão exibidos conforme o recurso selecionado.`,
        cancelText: 'Cancelar',
        confirmText: 'Trocar',
        dataQa: 'modal-trocar-recurso',
        onConfirm: () => handleChangeRecurso(recursoSelecionadoObj)
      });
    }
  }

  const handleChangeRecurso = (recursoSelecionadoObj) => {
    setRecursoSelecionado(recursoSelecionadoObj);
    localStorage.setItem('recursoSelecionado', JSON.stringify(recursoSelecionadoObj));
  }

  useEffect(() => {
    getRecursosDisponiveis().then((res) => {
      setRecursos(res);
    });
  }, []);

  const opcoes = recursos.map((recurso) => ({
    label: recurso.nome_exibicao,
    value: recurso.uuid
  }))
  
  return (
    <>
      { recursos.length > 1 && (
        <div className="container-seleciona-recurso">
          <div className="imagem-container">
            <img 
              className='icone'
              src={recursoSelecionado?.icone} 
              alt="Seleciona Recurso" 
            />
          </div>

          <Select 
            className='select-recurso-antd'
            options={opcoes}
            value={recursoSelecionado?.uuid}
            onChange={handleChangeOption}
          />
        </div>
      ) }
    </>
  )
}