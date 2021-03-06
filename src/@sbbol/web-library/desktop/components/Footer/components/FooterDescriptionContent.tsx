import * as React from 'react';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';

/**
 * Футер, контент основной части.
 */
export class FooterDescriptionContent extends React.PureComponent<React.HTMLAttributes<HTMLDivElement>> {
    public static displayName = 'FooterDescriptionContent';

    public render(): JSX.Element {
        const {children, className, ...htmlDivAttributes} = this.props;
        return (
            <div className={classnames(className, 'cssClass[footerDescriptionContent]')} {...htmlDivAttributes}>
                {children}
            </div>
        );
    }
}
