import { useCallback } from "react";
import { Spin } from "antd";

import { ASSOCIACAO_UUID } from "../../../../../services/auth.service";
import { useGetPaa } from "../hooks/useGetPaa";
import { useQueryClient } from "@tanstack/react-query";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import ConteudoBase from "./ConteudoBase";

const PaaBase = ({ paaUuid, ...rest }) => {
  const queryClient = useQueryClient();

  const { data: paa, isFetching, error } = useGetPaa(paaUuid);

  const atualizaPaa = useCallback(async () => {
    queryClient.invalidateQueries({
      queryKey: [`retrieve-paa`, paaUuid],
      exact: false,
    });
  }, [paaUuid, queryClient]);

  const associacaoUuid = () => localStorage.getItem(ASSOCIACAO_UUID);
  const debug = false;

  return (
    <>
      <PaginasContainer>
        <Spin spinning={isFetching} className="mt-5">
          {debug ? (
            <>
              # Associacao:{" "}
              {JSON.stringify(localStorage.getItem(ASSOCIACAO_UUID))}
              <br /># PAA uuid{JSON.stringify(paaUuid)}
              <br /># PAA Associacao{JSON.stringify(paa?.associacao)}
              <br />
              #Error {JSON.stringify(error, null, 2)}
              <br />
              <button onClick={atualizaPaa}>Atualizar Paa</button>
            </>
          ) : null}
          {paa
            ? paa?.associacao === associacaoUuid() && (
                <ConteudoBase paa={paa} atualizaPaa={atualizaPaa} {...rest} />
              )
            : null}
        </Spin>
      </PaginasContainer>
    </>
  );
};

export default PaaBase;
