import {useEffect, useState} from "react";
import {getTabelasReceita} from "../../services/escolas/Receitas.service";

export const useCarregaTabelaReceita = () =>{
    const [tabelaReceita, setTabelasReceita] = useState([]);

    useEffect(() => {
        const carregaTabelasReceita = async () => {
            getTabelasReceita().then(response => {
                setTabelasReceita(response.data);
            }).catch(error => {
                console.log(error);
            });
        };
        carregaTabelasReceita()
    }, []);

    return tabelaReceita
}