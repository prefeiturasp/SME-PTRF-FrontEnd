import React, { lazy, Suspense, memo } from "react";
import Loading from "../../../utils/Loading";

// Lazy load do editor para isolar as importações do TinyMCE
const EditorWysiwygCustomLazy = lazy(() => import('./EditorWysiwygCustomLoader'));

const EditorWysiwygCustom = (props) => {
    return (
        <Suspense fallback={
            <div className="mt-5">
                <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />
            </div>
        }>
            <EditorWysiwygCustomLazy {...props} />
        </Suspense>
    );
};

export default memo(EditorWysiwygCustom);
