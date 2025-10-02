import React, {useState, memo, useRef, useEffect} from 'react';
import {AutoComplete} from 'primereact/autocomplete';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import { Tag } from '../Tag';

const AutoCompleteModal = ({
    value,
    name,
    inputId,
    suggestions,
    completeMethod,
    field,
    onChange,
    onSelect,
    inputClassName = "form-control",
    style = {width: "100%", borderLeft:'none'},
    itemTemplate,
    disabled = false,
    placeholder = "",
    loading = false,
    loadingText = "Carregando...",
    showSearchIcon = true,
    searchIconColor = "#42474A",
    searchIconSize = "18px",
    ...props
}) => {
    const appendToRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const portalContainer = document.createElement('div');
        portalContainer.style.position = 'fixed';
        portalContainer.style.top = '0';
        portalContainer.style.left = '0';
        portalContainer.style.zIndex = '99999';
        portalContainer.style.pointerEvents = 'auto';
        document.body.appendChild(portalContainer);
        appendToRef.current = portalContainer;

        return () => {
            if (appendToRef.current && document.body.contains(appendToRef.current)) {
                document.body.removeChild(appendToRef.current);
            }
        };
    }, []);

    const getPanelStyle = () => {
        if (inputRef.current) {
            const inputRect = inputRef.current.getBoundingClientRect();
            return {
                zIndex: 99999,
                width: `${inputRect.width}px`,
                minWidth: `${inputRect.width}px`
            };
        }
        return { zIndex: 99999 };
    };

    const displayPlaceholder = loading ? loadingText : placeholder;

    return (
        <div className="d-flex bd-highlight">
            <div className="flex-grow-1 bd-highlight">
                <AutoComplete
                    value={value}
                    name={name}
                    inputId={inputId}
                    suggestions={suggestions}
                    completeMethod={completeMethod}
                    field={field}
                    onChange={onChange}
                    inputClassName={inputClassName}
                    onSelect={onSelect}
                    style={style}
                    appendTo={appendToRef.current}
                    panelStyle={getPanelStyle()}
                    itemTemplate={itemTemplate}
                    disabled={disabled || loading}
                    placeholder={displayPlaceholder}
                    inputRef={inputRef}
                    {...props}
                />
            </div>
            {showSearchIcon && (
                <div className="bd-highlight ml-0 py-1 px-3 ml-n3 border-top border-right border-bottom">
                    <FontAwesomeIcon
                        style={{fontSize: searchIconSize, marginRight: "0", color: searchIconColor}}
                        icon={faSearch}
                    />
                </div>
            )}
        </div>
    );
};

export default memo(AutoCompleteModal);
