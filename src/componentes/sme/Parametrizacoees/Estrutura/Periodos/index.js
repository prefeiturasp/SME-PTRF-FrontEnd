import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodosPeriodos} from "../../../../../services/sme/Parametrizacoes.service";
import TabelaPeriodos from "./TabelaPeriodos";
import moment from "moment";

export const Periodos = () =>{

    const [count, setCount] = useState(0);
    const [listaDePeriodos, setListaDePeriodos] = useState([]);

    const carregaTodosPeriodos =  useCallback( async ()=>{
        let periodos = await getTodosPeriodos();
        console.log('carregaTodosPeriodos ', periodos);
        setListaDePeriodos(periodos);
    }, []);

    useEffect(()=>{
        carregaTodosPeriodos();
    }, [carregaTodosPeriodos]);

    // Tabela
    const rowsPerPage = 2;
    const dataTemplate = useCallback((rowData, column) => {
        return (
            <div>
                {/*{rowData['data'] ? moment(rowData['data']).format('DD/MM/YYYY') : ''}*/}
                {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : ''}
            </div>
        )
    }, []);
    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Períodos</h1>
            <div className="page-content-inner">
                <button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback - {count}</button>
                <TabelaPeriodos
                    rowsPerPage={rowsPerPage}
                    listaDePeriodos={listaDePeriodos}
                    dataTemplate={dataTemplate}
                />
            </div>
        </PaginasContainer>
    );
};