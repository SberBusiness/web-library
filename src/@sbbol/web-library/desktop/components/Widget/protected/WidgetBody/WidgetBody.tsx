import * as React from 'react';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {IWidgetBodyProvideProps} from '../../types';

export interface IWidgetBodyProps extends IWidgetBodyProvideProps, React.HTMLAttributes<HTMLDivElement> {}

export const WidgetBody: React.FC<IWidgetBodyProps> = ({
    animating,
    children,
    widgetWithoutFooter,
    toggle,
    isOpen,
    className,
    ...htmlDivAttributes
}) => (
    <div
        {...htmlDivAttributes}
        className={classnames(className, 'cssClass[widgetBody]', {
            'cssClass[widgetBodyWithoutFooter]': widgetWithoutFooter,
        })}
    >
        {children}
    </div>
);

WidgetBody.displayName = 'WidgetBody';
