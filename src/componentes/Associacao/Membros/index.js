import React, {useState} from "react";
import {MenuInterno} from "../MenuInterno";
import {TabelaMembrosDiretoriaExecutiva} from "../TabelaMembrosDiretoriaExecutiva";
import {TabelaMembrosConselhoFiscal} from "../TabelaMembrosConselhoFiscal";

import {EditarMembro} from "../../../utils/Modais";

export const MembrosDaAssociacao = () =>{

    const [clickIconeToogle, setClickIconeToogle] = useState({});
    const [showEditarMembro, setShowEditarMembro] = useState(false);
    const [stateFormEditarMembro, setStateFormEditarMembro] = useState({
        cargo_associacao:"",
        representacao_associacao:"",
        rf:"",
        nome_completo:"",
        cargo_educacao:"",
    });

    const toggleIcon = (id) => {
        setClickIconeToogle({
            ...clickIconeToogle,
            [id]: !clickIconeToogle[id]
        });
    }


    const onHandleClose = () => {
        setShowEditarMembro(false);
    };

    const handleChangeEditarMembro = (name, value) => {
        setStateFormEditarMembro({
            ...stateFormEditarMembro,
            [name]: value
        });
    };

    const onSubmitEditarMembro = () =>{
        setShowEditarMembro(false);
        console.log("onSubmitEditarMembro ", stateFormEditarMembro)
    };

    return(
        <div className="row">
            <div className="col-12">
                <>
                    <MenuInterno/>
                    <TabelaMembrosDiretoriaExecutiva
                        clickIconeToogle={clickIconeToogle}
                        toggleIcon={toggleIcon}
                        setShowEditarMembro={setShowEditarMembro}
                    />

                    <hr/>

                    <TabelaMembrosConselhoFiscal
                        clickIconeToogle={clickIconeToogle}
                        setClickIconeToogle={setClickIconeToogle}
                        setShowEditarMembro={setShowEditarMembro}
                    />
                </>
            </div>

            <section>
                <EditarMembro
                    show={showEditarMembro}
                    handleClose={onHandleClose}
                    onSubmitEditarMembro={onSubmitEditarMembro}
                    handleChangeEditarMembro={handleChangeEditarMembro}
                    stateFormEditarMembro={stateFormEditarMembro}
                    //tabelas={tabelas}
                />
            </section>

        </div>
    );
};