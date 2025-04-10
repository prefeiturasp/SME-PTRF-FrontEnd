import { useState } from 'react';
import { useGetAcoesPdde } from './hooks/useGetAcoesPdde';
import Tabela from './Tabela';
import { Spin } from 'antd';

const rowsPerPage = 20;
export const DetalhamentoAcoesPdde = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const { data, isLoading, count } = useGetAcoesPdde(currentPage,rowsPerPage);

  return (
    <Spin spinning={isLoading}>
      <Tabela
        rowsPerPage={20}
        data={data}
        isLoading={isLoading}
        setCurrentPage={setCurrentPage}
        firstPage={firstPage}
        setFirstPage={setFirstPage}
        count={count}
      />
    </Spin>
  )
};