import * as React from 'react';
import {TIndentSize} from '@sbbol/web-library/desktop/common/consts/IndentConst';
import {cssClass} from '@sbbol/web-library/desktop/utils/cssClass';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';

/** Свойства компонента CheckboxXGroup. */
export interface ICheckboxXGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Размер отступа. */
    indent?: TIndentSize;
}

/** Компонент CheckboxXGroup. Группа чекбоксов с направлением по оси X. */
export const CheckboxXGroup: React.FC<ICheckboxXGroupProps> = (props) => {
    const {children, className, indent = 12, ...rest} = props;
    const classNames = classnames('cssClass[checkboxXGroup]', cssClass(`indent-${indent}`), className);

    return (
        <div className={classNames} role="group" {...rest}>
            {children}
        </div>
    );
};

CheckboxXGroup.displayName = 'CheckboxXGroup';
