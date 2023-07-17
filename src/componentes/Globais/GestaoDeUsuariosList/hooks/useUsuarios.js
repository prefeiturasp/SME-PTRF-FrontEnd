import {getUsuarios} from '../services/GestaoDeUsuarios.service';
import {useQuery} from '@tanstack/react-query';
import {useContext} from "react";
import {GestaoDeUsuariosListContext} from "../context/GestaoDeUsuariosListProvider";

export const useUsuarios = ()  => {
  const {
    uuidUnidadeBase,
    filter,
    currentPage,
    setTotalPages,
    setCount
  } = useContext(GestaoDeUsuariosListContext);
  async function getUsuariosList() {
    try {
      const result = await getUsuarios(uuidUnidadeBase, filter, currentPage)
      setTotalPages(result?.total_pages)
      setCount(result?.count)
      return result;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return useQuery(['usuarios-list', uuidUnidadeBase, filter, currentPage], getUsuariosList, {
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
  });
};
