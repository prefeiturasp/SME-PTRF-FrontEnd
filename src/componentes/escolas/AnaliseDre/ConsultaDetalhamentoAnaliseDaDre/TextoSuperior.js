import React, {memo} from "react";

const TextoSuperior = ({retornaTextoSuperior}) => {
    return(
        <>
            {retornaTextoSuperior()}
        </>
    )
}
export default memo(TextoSuperior)
