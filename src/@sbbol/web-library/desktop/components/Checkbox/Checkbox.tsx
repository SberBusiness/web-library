import React, {useState, useRef, useEffect} from 'react';
import {ICheckboxProps} from '@sbbol/web-library/desktop/components/Checkbox/types';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {EFocusSource} from '@sbbol/web-library/common/enums/EFocusSource';
import {CheckboxbulkStsIcon16} from '@sberbusiness/icons/CheckboxbulkStsIcon16';
import {CheckboxtickStsIcon16} from '@sberbusiness/icons/CheckboxtickStsIcon16';
import {isKey} from '@sbbol/web-library/desktop/utils/keyboard';

/** Компонент "Чекбокс". Используется как одиночный чекбокс с описанием. */
export const Checkbox = React.forwardRef<HTMLInputElement, ICheckboxProps>((props, ref) => {
    const {children, className, onFocus, bulk, labelAttributes, ...inputAttributes} = props;
    const [focusSource, setFocusSource] = useState(EFocusSource.NONE);
    const labelRef = useRef<HTMLLabelElement | null>(null);
    const classNames = classnames('cssClass[checkbox]', {'cssClass[focusVisible]': focusSource === EFocusSource.KEYBOARD}, className);
    const labelClassNames = classnames('cssClass[label]', {'cssClass[nonempty]': !!children}, labelAttributes?.className);

    useEffect(() => {
        if (focusSource !== EFocusSource.NONE) {
            document.addEventListener('mousedown', listenMouseDown);
            document.addEventListener('keydown', listenKeyDown);
            return () => {
                document.removeEventListener('mousedown', listenMouseDown);
                document.removeEventListener('keydown', listenKeyDown);
            };
        }
    }, [focusSource]);

    const listenMouseDown = (event: MouseEvent) => {
        if (!labelRef.current?.contains(event.target as Node)) {
            setFocusSource(EFocusSource.NONE);
        }
    };

    const listenKeyDown = (event: KeyboardEvent) => {
        const key = event.code || event.keyCode;

        if (isKey(key, 'TAB')) {
            setFocusSource(EFocusSource.NONE);
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLLabelElement>) => {
        if (focusSource === EFocusSource.NONE && labelRef.current !== document.activeElement) {
            setFocusSource(EFocusSource.MOUSE);
        }
        labelAttributes?.onMouseDown?.(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        if (focusSource === EFocusSource.NONE) {
            setFocusSource(EFocusSource.KEYBOARD);
        }
        onFocus?.(event);
    };

    const renderCheckmarkIcon = () => {
        const className = 'cssClass[checkmarkIcon]';

        return bulk ? <CheckboxbulkStsIcon16 className={className} /> : <CheckboxtickStsIcon16 className={className} />;
    };

    return (
        <label {...labelAttributes} className={labelClassNames} onMouseDown={handleMouseDown} ref={labelRef}>
            <input type="checkbox" className={classNames} onFocus={handleFocus} {...inputAttributes} ref={ref} />
            <span className="cssClass[checkboxIcon]" />
            {renderCheckmarkIcon()}
            {children && <span className="cssClass[content]">{children}</span>}
        </label>
    );
});

Checkbox.displayName = 'Checkbox';
