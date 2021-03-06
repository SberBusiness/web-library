import * as React from 'react';
import {LightBoxClose} from '@sbbol/web-library/desktop/components/LightBox/LightBoxControls/LightBoxClose';
import {LightBoxNext} from '@sbbol/web-library/desktop/components/LightBox/LightBoxControls/LightBoxNext';
import {LightBoxPrev} from '@sbbol/web-library/desktop/components/LightBox/LightBoxControls/LightBoxPrev';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';

interface ILightBoxControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface ILightBoxControlsFC extends React.FC<ILightBoxControlsProps> {
    Close: typeof LightBoxClose;
    Next: typeof LightBoxNext;
    Prev: typeof LightBoxPrev;
}

/**
 * Контейнер кнопок-действий(закрыть/вперед/назад).
 */
export const LightBoxControls: ILightBoxControlsFC = ({children, className, ...htmlDivAttributes}) => (
    <div className={classnames(className, 'cssClass[lightBoxControls]')} {...htmlDivAttributes} data-lightbox-component="controls">
        {children}
    </div>
);

LightBoxControls.displayName = 'LightBoxControls';
LightBoxControls.Close = LightBoxClose;
LightBoxControls.Next = LightBoxNext;
LightBoxControls.Prev = LightBoxPrev;
