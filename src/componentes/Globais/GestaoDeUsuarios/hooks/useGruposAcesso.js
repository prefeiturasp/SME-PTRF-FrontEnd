import {getGrupos} from '../../../../services/GestaoDeUsuarios.service';
import {useQuery} from '@tanstack/react-query';
import {useContext} from "react";
import {GestaoDeUsuariosContext} from "../context/GestaoDeUsuariosProvider";

export const useGruposAcesso = ()  => {
  const {visaoBase} = useContext(GestaoDeUsuariosContext);
  async function getGruposAcesso() {
    try {
      return await getGrupos(visaoBase);
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return useQuery(['grupos-acesso-list', visaoBase], getGruposAcesso, {
    keepPreviousData: true,
  });
};
