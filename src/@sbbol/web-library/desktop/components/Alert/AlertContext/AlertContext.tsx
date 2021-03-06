import * as React from 'react';
import {EAlertType} from '@sbbol/web-library/desktop/components/Alert/EAlertType';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {mapAlertTypeToClassName, renderDefaultIcon} from '@sbbol/web-library/desktop/components/Alert/AlertTypeUtils';

/** @deprecated Устаревшие свойства компонента AlertContext. */
export interface IDeprecatedAlertContextProps extends Omit<IAlertContextProps, 'type' | 'children'> {
    /** Текст внутри компонента. */
    text: React.ReactNode;
}

/** Свойства компонента AlertContext. */
export interface IAlertContextProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Тип предупреждения (info/warning/error/system). */
    type: Exclude<EAlertType, EAlertType.FEATURE>;
    /** Флаг отображения компонента, используется для чтения скрин-ридером, по умолчанию true. */
    visible?: boolean;
}

/** Компонент контекстного предупреждения. */
export const AlertContext: React.FC<IAlertContextProps> = ({children, className, type, visible = true, ...rest}) =>
    visible ? (
        <span role="alert" className={classnames('cssClass[alertContext]', mapAlertTypeToClassName(type), className)} {...rest}>
            {renderDefaultIcon(type)}
            <span className="cssClass[alertContextText]">{children}</span>
        </span>
    ) : null;
