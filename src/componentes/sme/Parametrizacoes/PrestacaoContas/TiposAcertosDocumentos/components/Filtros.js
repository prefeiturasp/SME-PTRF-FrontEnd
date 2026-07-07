import React, { useContext, useState, useEffect } from "react";
import { AcertosDocumentosContext } from "../context/AcertosDocumentos";
import { Select } from 'antd';
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

export const Filtros = () => {
    const { filter, setFilter, tabelas } = useContext(AcertosDocumentosContext);
    const { Option } = Select;
    const { categorias, documentos } = tabelas || { categorias: [], documentos: [] };
    const { selectedRecurso } = useAbasPorRecursoContext();

    // Estado temporário para os campos de filtro (não aplica imediatamente)
    const [filtroTemporario, setFiltroTemporario] = useState({
        filtrar_por_nome: filter.filtrar_por_nome,
        filtrar_por_categoria: filter.filtrar_por_categoria,
        filtrar_por_ativo: filter.filtrar_por_ativo,
        filtrar_por_documento_relacionado: filter.filtrar_por_documento_relacionado,
    });

    const handleChangeFiltros = (name, value) => {
        setFiltroTemporario({
            ...filtroTemporario,
            [name]: value,
        });
    };

    const handleSubmitFiltros = () => {
        setFilter({
            ...filtroTemporario,
            page: 1,
            recurso_uuid: selectedRecurso?.uuid,
        });
    };

    const handleLimpaFiltros = () => {
        const filtroLimpo = {
            filtrar_por_nome: "",
            filtrar_por_categoria: [],
            filtrar_por_ativo: "",
            filtrar_por_documento_relacionado: [],
        };
        setFiltroTemporario(filtroLimpo);
        setFilter({
            ...filtroLimpo,
            page: 1,
            recurso_uuid: selectedRecurso?.uuid,
        });
    };

    useEffect(() => {
      const filtroLimpo = {
          filtrar_por_nome: "",
          filtrar_por_categoria: [],
          filtrar_por_ativo: "",
          filtrar_por_documento_relacionado: [],
      };
      setFiltroTemporario(filtroLimpo);
    }, [filter.recurso_uuid]);

    return (
        <>
            <form className="mb-3">
                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_nome">Filtrar por nome</label>
                        <input
                            value={filtroTemporario.filtrar_por_nome}
                            onChange={(e) => handleChangeFiltros('filtrar_por_nome', e.target.value)}
                            name='filtrar_por_nome'
                            id="filtrar_por_nome"
                            type="text"
                            className="form-control"
                            placeholder="Escreva o termo que deseja filtrar"
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="filtrar_por_categoria">Filtrar por categorias</label>
                        <Select
                            id="filtrar_por_categoria"
                            mode="multiple"
                            allowClear
                            placeholder="Selecione as categorias"
                            value={filtroTemporario.filtrar_por_categoria}
                            onChange={(value) => handleChangeFiltros('filtrar_por_categoria', value)}
                            style={{ width: "100%" }}
                        >
                            {categorias && categorias.length > 0 && categorias.map(item => (
                                <Option key={item.id} value={item.id}>{item.nome}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="filtrar_por_documento_relacionado">Filtrar por tipo documentos de prestação</label>
                        <Select
                            id="filtrar_por_documento_relacionado"
                            mode="multiple"
                            placeholder="Selecione os documentos de prestação"
                            value={filtroTemporario.filtrar_por_documento_relacionado}
                            onChange={(value) => handleChangeFiltros('filtrar_por_documento_relacionado', value)}
                            className="documentos-table-multiple-search"
                            allowClear
                        >
                            {documentos && documentos.length > 0 && documentos.map(item => (
                                <Option key={item.id} value={item.id}>{item.nome}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="filtrar_por_ativo">Filtrar por status</label>
                        <select
                            value={filtroTemporario.filtrar_por_ativo}
                            onChange={(e) => handleChangeFiltros('filtrar_por_ativo', e.target.value)}
                            name='filtrar_por_ativo'
                            id="filtrar_por_ativo"
                            className="form-control"
                        >
                            <option value="">Selecione o status</option>
                            <option value='True'>Ativo</option>
                            <option value='False'>Inativo</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={handleLimpaFiltros} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button onClick={handleSubmitFiltros} type="button" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    );
};
