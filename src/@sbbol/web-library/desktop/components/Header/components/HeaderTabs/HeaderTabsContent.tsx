import {Tabs} from '@sbbol/web-library/desktop/components/Tabs/Tabs';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import * as React from 'react';

interface IHeaderTabsContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 *  Контейнер табов.
 */
export class HeaderTabsContent extends React.PureComponent<IHeaderTabsContentProps> {
    public static displayName = 'HeaderTabsContent';

    public static Tabs = Tabs;

    public render(): React.ReactNode {
        const {children, className} = this.props;

        return <div className={classnames(className, 'cssClass[headerTabsContent]')}>{children}</div>;
    }
}
