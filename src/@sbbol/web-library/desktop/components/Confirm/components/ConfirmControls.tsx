import * as React from 'react';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';

export interface IConfirmControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ConfirmControls: React.FC<IConfirmControlsProps> = ({children, className, ...htmlDivAttributes}) => (
    <div className={classnames('cssClass[confirmControls]', className)} {...htmlDivAttributes}>
        {children}
    </div>
);

ConfirmControls.displayName = 'ConfirmControls';
