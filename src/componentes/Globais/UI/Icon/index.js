import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from 'antd';
import icones from "./icones";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as faIcons from "@fortawesome/free-solid-svg-icons";

export const Icon = ({icon, tooltipMessage = "", iconProps = {}}) => {
    const isFontAwesome = faIcons[icon] !== undefined;

    const IconImg = () => {
        return <img src={icones[icon]} alt={icon} className="ml-1"></img>
    };
    
    const renderIcon = () => {
        if (isFontAwesome) {
            return <FontAwesomeIcon icon={faIcons[icon]} {...iconProps} />;
        }
        return <IconImg/>;
    };

    return (
        tooltipMessage ? (
            <Tooltip title={tooltipMessage}>
                <span>
                    {renderIcon()}
                </span>
            </Tooltip>
        ) : (
            renderIcon()
        )
    )
};

Icon.propTypes = {
    icon: PropTypes.string.isRequired,
    tooltipMessage: PropTypes.string,
    iconProps: PropTypes.object,
};