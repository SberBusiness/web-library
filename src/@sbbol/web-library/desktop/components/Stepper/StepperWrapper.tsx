import React from 'react';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';

/** Свойства StepperWrapper. */
export interface IStepperWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Компонент StepperWrapper, обёртка для Stepper. */
export const StepperWrapper: React.FC<IStepperWrapperProps> = ({children, className, ...rest}) => {
    const classNames = classnames('cssClass[stepperWrapper]', className);

    return (
        <div className={classNames} {...rest}>
            {children}
        </div>
    );
};
