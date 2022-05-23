import {createContext} from 'react';
import {IStepperType} from './enums';

/** Контекст компонента StepperExtended. */
export interface IStepperContext {
    /** Тип списка. */
    type?: IStepperType;
    /** Уникальный идентификатор выбранного шага. */
    selectedId?: string;
    /** Обработчик выбора шага. */
    onSelectStep: (selectedId: string) => void;
}

const defaultValue = {
    selectedId: undefined,
    onSelectStep: () => {},
};

/** Контекст в StepperExtended. */
export const StepperExtendedContext = createContext<IStepperContext>(defaultValue);
