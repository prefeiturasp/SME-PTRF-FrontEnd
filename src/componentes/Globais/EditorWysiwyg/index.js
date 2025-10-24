import React, { lazy, Suspense, memo } from "react";
import Loading from "../../../utils/Loading";

// Lazy load do editor para isolar as importações do TinyMCE
const EditorWysiwygLazy = lazy(() => import('./EditorWysiwygLoader'));

const EditorWysiwyg = (props) => {
    return (
        <Suspense fallback={
            <div className="mt-5">
                <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />
            </div>
        }>
            <EditorWysiwygLazy {...props} />
        </Suspense>
    );
};

export default memo(EditorWysiwyg);