import React, {useState, useRef, useEffect} from 'react';
import {IRadioProps} from '@sbbol/web-library/desktop/components/Radio/types';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {EFocusSource} from '@sbbol/web-library/common/enums/EFocusSource';
import {isKey} from '@sbbol/web-library/desktop/utils/keyboard';

/** Компонент Radio. Радио-кнопка. */
export const Radio = React.forwardRef<HTMLInputElement, IRadioProps>((props, ref) => {
    const {children, className, onFocus, labelAttributes, ...inputAttributes} = props;
    const [focusSource, setFocusSource] = useState(EFocusSource.NONE);
    const labelRef = useRef<HTMLLabelElement | null>(null);
    const classNames = classnames('cssClass[radio]', {'cssClass[focusVisible]': focusSource === EFocusSource.KEYBOARD}, className);
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

    return (
        <label {...labelAttributes} className={labelClassNames} onMouseDown={handleMouseDown} ref={labelRef}>
            <input type="radio" className={classNames} onFocus={handleFocus} {...inputAttributes} ref={ref} />
            <span className="cssClass[radioIcon]" />
            <span className="cssClass[content]">{children}</span>
        </label>
    );
});

Radio.displayName = 'Radio';
