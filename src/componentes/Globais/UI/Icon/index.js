import React from "react";
import { Tooltip } from 'antd';
import icones from "./icones";

export const Icon = ({icon, tooltipMessage}) => {
    const IconImg = () => {
        return <img src={icones[icon]} alt={icon} className="ml-1"></img>
    };
    
    return (
        tooltipMessage ? (
            <Tooltip title={tooltipMessage}>
                <span>
                    <IconImg/>
                </span>
            </Tooltip>
        ) : (
            <IconImg/>
        )
    )
};