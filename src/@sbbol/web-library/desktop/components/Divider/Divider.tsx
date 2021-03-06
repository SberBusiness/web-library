import * as React from 'react';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {cssClass} from '@sbbol/web-library/desktop/utils/cssClass';

/** Возможные размеры отступов.  */
export type TDividerMarginSize = 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32;

/** Свойства компонента Divider. */
export interface IDividerProps extends React.HTMLAttributes<HTMLHRElement> {
    /** Отступ сверху. */
    marginTopSize?: TDividerMarginSize;
    /** Отступ снизу. */
    marginBottomSize?: TDividerMarginSize;
}

/** Компонент Divider. */
export const Divider: React.FC<IDividerProps> = (props) => {
    const {className, marginTopSize, marginBottomSize, ...htmlDivAttributes} = props;
    const classNames = classnames(
        'cssClass[divider]',
        marginTopSize && cssClass(`marginTopSize-${marginTopSize}`),
        marginBottomSize && cssClass(`marginBottomSize-${marginBottomSize}`),
        className
    );

    return <hr className={classNames} {...htmlDivAttributes} />;
};

Divider.displayName = 'Divider';
