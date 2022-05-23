import React, {ReactNode} from 'react';
import {IStepperExtendedProps, StepperExtended} from './StepperExtended';
import {StepperWrapper} from './StepperWrapper';
import {StepperStep, IStepperStepProps} from './StepperStep';

/** Внутренние составляющие Stepper. */
interface IStepperComposition {
    Wrapper: typeof StepperWrapper;
    Step: typeof StepperStep;
}

/** Свойства шага в Stepper */
export interface IStepperStep extends IStepperStepProps {
    /** Название шага. */
    label?: ReactNode;
}

/** Свойства Stepper. */
export interface IStepperProps extends IStepperExtendedProps {
    children?: never;
    /** Шаги. */
    steps: Array<IStepperStep>;
}

/** Компонент Stepper, список шагов */
export const Stepper: React.FC<IStepperProps> & IStepperComposition = ({steps, ...rest}) => (
    <StepperExtended {...rest}>
        {steps.map(({label, ...step}) => (
            <StepperExtended.Step key={step.id} {...step}>
                {label}
            </StepperExtended.Step>
        ))}
    </StepperExtended>
);

Stepper.Wrapper = StepperWrapper;
Stepper.Step = StepperStep;
