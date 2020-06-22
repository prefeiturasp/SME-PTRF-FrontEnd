import React, {useState} from "react";
import {MenuInterno} from "../MenuInterno";
import {TabelaMembros} from "../TabelaMembros";
import {EditarMembro} from "../../../utils/Modais";

export const MembrosDaAssociacao = () =>{

    const [clickIconeToogle, setClickIconeToogle] = useState(false)
    const [showEditarMembro, setShowEditarMembro] = useState(false);

    const onHandleClose = () => {
        setShowEditarMembro(false);
    };

    return(
        <div className="row">
            <div className="col-12">
                <MenuInterno/>
                <TabelaMembros
                    clickIconeToogle={clickIconeToogle}
                    setClickIconeToogle={setClickIconeToogle}
                    setShowEditarMembro={setShowEditarMembro}
                />
            </div>

            <section>
                <EditarMembro
                    show={showEditarMembro}
                    handleClose={onHandleClose}
                    //onSubmitEditarAta={onSubmitEditarAta}
                    //onChange={handleChangeEditarAta}
                    //stateFormEditarAta={stateFormEditarAta}
                    //tabelas={tabelas}
                />
            </section>

        </div>
    );
}