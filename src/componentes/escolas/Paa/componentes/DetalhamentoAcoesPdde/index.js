import { useState } from 'react';
import { useGetAcoesPdde } from './hooks/useGetAcoesPdde';
import Tabela from './Tabela';
import { Spin } from 'antd';
import TabelaAcoesPDDE from './TabelaAcoesPDDE';
import { visoesService } from '../../../../../services/visoes.service';


const rowsPerPage = 20;
export const DetalhamentoAcoesPdde = () => {
  const TEM_FLAG_RECEITAS_PREVISTAS = visoesService.featureFlagAtiva('paa-receitas-prevista')
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const { data, isLoading, count } = useGetAcoesPdde(currentPage,rowsPerPage);

  return (
    <Spin spinning={isLoading}>
      <>
      <h4 className="mb-4">Ações PDDE</h4>
      {TEM_FLAG_RECEITAS_PREVISTAS ?
        <TabelaAcoesPDDE />
      :
        <Tabela
          rowsPerPage={rowsPerPage}
          data={data}
          isLoading={isLoading}
          setCurrentPage={setCurrentPage}
          firstPage={firstPage}
          setFirstPage={setFirstPage}
          count={count}
        />
      }
      </>
    </Spin>
  )
};