import React from 'react';
import {SuccessStsIcon16} from '@sberbusiness/icons/SuccessStsIcon16';
import {WarningStsIcon16} from '@sberbusiness/icons/WarningStsIcon16';
import {ErrorStsIcon16} from '@sberbusiness/icons/ErrorStsIcon16';
import {WaitStsIcon16} from '@sberbusiness/icons/WaitStsIcon16';

/** Возможные типы иконки в шаге. */
export enum EStepperStepIconType {
    SUCCESS = 'success',
    PROGRESS = 'progress',
    WAIT = 'wait',
    WARNING = 'warning',
    ERROR = 'error',
}

/** Свойства иконки в шаге. */
export type TStepperStepIconProps =
    | {
          /** Тип иконки. */
          type: Exclude<EStepperStepIconType, EStepperStepIconType.PROGRESS>;
          /** Прогресс в процентах (0...1). */
          progress?: never;
      }
    | {
          /** Тип иконки. */
          type: EStepperStepIconType.PROGRESS;
          /** Прогресс в процентах (0...1). */
          progress?: number;
      };

/** Компонент StepperStepIcon, иконка в шаге. */
export const StepperStepIcon: React.FC<TStepperStepIconProps> = ({type, progress}) => {
    const className = 'cssClass[icon]';

    const getProgressPie = (degree: number, radius: number, offset: number) => {
        const radians = ((degree - 90) * Math.PI) / 180;
        const largeArcFlag = degree % 360 > 180 ? 1 : 0;
        const x = offset + radius * Math.cos(radians);
        const y = offset + radius * Math.sin(radians);

        return <path d={`M 8 1 A 7 7 0 ${largeArcFlag} 1 ${x} ${y} L 8 8`} fill="#107F8C" />;
    };

    const getProgressIcon = (progress = 0) => (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" focusable="false">
            <circle cx="8" cy="8" r="7.5" fill="#E4E8EB" stroke="#107F8C" />
            {getProgressPie(progress * 360, 7, 8)}
        </svg>
    );

    switch (type) {
        case EStepperStepIconType.PROGRESS:
            return getProgressIcon(progress);
        case EStepperStepIconType.SUCCESS:
            return <SuccessStsIcon16 className={className} />;
        case EStepperStepIconType.WARNING:
            return <WarningStsIcon16 className={className} />;
        case EStepperStepIconType.ERROR:
            return <ErrorStsIcon16 className={className} />;
        case EStepperStepIconType.WAIT:
            return <WaitStsIcon16 className={className} />;
        default:
            return null;
    }
};
