import React from "react";
import {OPEN_MODAL, CLOSE_MODAL} from "./actions";

const initialState = {
    open: false,
    options: {
        children: <></>,
    },
}

export const Modal = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_MODAL:
            return{
                ...state,
                open: true,
                options: {
                    ...state.options,
                    ...action.payload,
                },
            }
        case CLOSE_MODAL:
            return{
                ...state,
                open: false,
                options: {
                    children: <></>,
                },                
            }
        default:
            return state

    }
}