import React, {memo} from "react";

const LinkCustomSemAcao = ({classeCssBotao, children}) => {
    return(
        <span className={`${classeCssBotao}`}>{children}</span>
    )
}

export default memo(LinkCustomSemAcao)