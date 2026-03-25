import { useCallback } from 'react'
import { Spin } from 'antd';
// import { useNavigate } from 'react-router-dom';
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import { useGetPaa } from './hooks/useGetPaa';
import { useQueryClient } from "@tanstack/react-query";

export const Paa = ({paaUuid, children}) => {
  //   const navigate = useNavigate();
  const queryClient = useQueryClient()

  const {data: paa, isFetching, error} = useGetPaa(paaUuid);
  console.log('Paa do Pai: ', paaUuid, paa)

  const atualizaPaa = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [`retrieve-paa`, paaUuid], exact: false })
  }, [paaUuid, queryClient])

  const associacaoUuid = () => localStorage.getItem(ASSOCIACAO_UUID);
  return <>
    <Spin spinning={isFetching}>
      # Associacao: {JSON.stringify(localStorage.getItem(ASSOCIACAO_UUID))}
      <br />
      # PAA uuid{JSON.stringify(paaUuid)}
      <br />
      # PAA Associacao{JSON.stringify(paa?.associacao)}
      <br />
      #Error {JSON.stringify(error, null, 2)}
      <br />
      <button onClick={atualizaPaa}>Atualizar Paa</button>

      {paa?.associacao === associacaoUuid() && children({ paa, atualizaPaa })}

    </Spin>
  </>
}
