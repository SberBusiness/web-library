import React from 'react';
import {EInputGroupPosition} from '@sbbol/web-library/desktop/components/InputGroup/InputGroup';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';

/** Свойства компонента "Поле для ввода информации". */
export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Состояние ошибки. */
    error?: boolean;
    /** Позиция внутри компонента InputGroup. */
    groupPosition?: EInputGroupPosition;
}

const mapInputGroupPositionToCSSClass = {
    [EInputGroupPosition.LEFT]: 'cssClass[left]',
    [EInputGroupPosition.INTERMEDIATE]: 'cssClass[intermediate]',
    [EInputGroupPosition.RIGHT]: 'cssClass[right]',
};

/** Компонент "Поле для ввода информации". */
export const Input = React.forwardRef<HTMLInputElement, IInputProps>(
    ({className, placeholder = 'Введите значение', groupPosition, error, ...rest}, ref) => {
        const classNames = classnames(
            'cssClass[input]',
            {'cssClass[grouped]': !!groupPosition},
            groupPosition ? mapInputGroupPositionToCSSClass[groupPosition] : undefined,
            {'cssClass[error]': !!error},
            className
        );

        return <input className={classNames} placeholder={placeholder} ref={ref} {...rest} />;
    }
);

Input.displayName = 'Input';
