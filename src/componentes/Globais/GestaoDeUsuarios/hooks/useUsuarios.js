import {getUsuarios} from '../../../../services/GestaoDeUsuarios.service';
import {useQuery} from '@tanstack/react-query';
import {useContext} from "react";
import {GestaoDeUsuariosContext} from "../context/GestaoDeUsuariosProvider";

export const useUsuarios = ()  => {
  const {uuidUnidadeBase, filter} = useContext(GestaoDeUsuariosContext);
  async function getUsuariosList() {
    try {
      return await getUsuarios(uuidUnidadeBase, filter)
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return useQuery(['usuarios-list', uuidUnidadeBase, filter], getUsuariosList, {
    keepPreviousData: true,
  });
};
