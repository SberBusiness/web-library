import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import * as React from 'react';
import {WidgetFooterContent} from './WidgetFooterContent';
import {WidgetFooterControls} from './WidgetFooterControls';

interface IWidgetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export type TWidgetFooter = React.FC<IWidgetFooterProps> & {
    Content: typeof WidgetFooterContent;
    Controls: typeof WidgetFooterControls;
};

export const WidgetFooter: TWidgetFooter = ({children, className, ...htmlDivAttrributes}) => (
    <div {...htmlDivAttrributes} className={classnames(className, 'cssClass[widgetFooter]')}>
        {children}
    </div>
);

WidgetFooter.Content = WidgetFooterContent;
WidgetFooter.Controls = WidgetFooterControls;
WidgetFooter.displayName = 'WidgetFooter';
