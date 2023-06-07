import React from "react";
import './tag.scss';

export const Tag = ({
    label = '',
    color = 'default'
}) =>{

    return(
        <div className={`custom-tag custom-tag-${color}`}>
            <span>{label}</span>
        </div>
    )
};