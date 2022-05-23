import React, {useState, useEffect} from 'react';
import {IStepperType} from './enums';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {StepperExtendedContext} from './StepperExtendedContext';
import {StepperWrapper} from './StepperWrapper';
import {StepperStep} from './StepperStep';

/** Внутренние составляющие StepperExtended. */
interface IStepperExtendedComposition {
    Wrapper: typeof StepperWrapper;
    Step: typeof StepperStep;
}

/** Свойства StepperExtended. */
export interface IStepperExtendedProps extends React.HTMLAttributes<HTMLOListElement> {
    /** Тип списка. */
    type?: IStepperType;
    /** Уникальный идентификатор выбранного шага. */
    selectedStepId?: string;
    /** Обработчик выбора шага. */
    onSelectStep: (id: string) => void;
}

/** Компонент StepperExtended, расширенная версия Stepper. */
export const StepperExtended: React.FC<IStepperExtendedProps> & IStepperExtendedComposition = ({
    children,
    className,
    type = IStepperType.MAIN,
    onSelectStep,
    selectedStepId,
    ...rest
}) => {
    const [selectedId, setSelectedId] = useState(selectedStepId);
    const classNames = classnames('cssClass[stepperExtended]', className);

    useEffect(() => setSelectedId(selectedStepId), [setSelectedId, selectedStepId]);

    const handleSelect = (id: string) => onSelectStep(id);

    return (
        <StepperExtendedContext.Provider value={{type, selectedId, onSelectStep: handleSelect}}>
            <ol className={classNames} {...rest} role="tablist">
                {children}
            </ol>
        </StepperExtendedContext.Provider>
    );
};

StepperExtended.Wrapper = StepperWrapper;
StepperExtended.Step = StepperStep;
