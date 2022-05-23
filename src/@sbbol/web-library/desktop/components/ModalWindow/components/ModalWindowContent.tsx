import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {SpinnerWidget} from '@sbbol/web-library/desktop/components/SpinnerWidget/SpinnerWidget';
import * as React from 'react';

interface IModalWindowContentProps {
    /** Состояние загрузки.*/
    isLoading?: boolean;
    /** Текст под спиннером.*/
    isLoadingText?: React.ReactNode;
}

/** Компонент контента модального окна. */
export const ModalWindowContent: React.FC<IModalWindowContentProps> = ({isLoading, isLoadingText, children}) => {
    const className = classnames({'cssClass[modalWindowContent]': true, 'cssClass[isLoading]': !!isLoading});

    return (
        <div className={className}>
            {children}
            {isLoading && <SpinnerWidget key="spinner">{isLoadingText}</SpinnerWidget>}
        </div>
    );
};
