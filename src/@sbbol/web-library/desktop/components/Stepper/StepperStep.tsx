import React, {ReactNode, useContext, useState, useRef} from 'react';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {Text} from '@sbbol/web-library/desktop/components/Typography/Text';
import {EFontType, ETextSize} from '@sbbol/web-library/desktop/components/Typography/enums';
import {StepperStepIcon} from './StepperStepIcon';
import {isKey} from '@sbbol/web-library/desktop/utils/keyboard';
import {StepperExtendedContext} from './StepperExtendedContext';
import {EFocusSource} from '@sbbol/web-library/common/enums/EFocusSource';

const ArrowBorderRight = React.memo(() => (
    <svg className="cssClass[arrow]" xmlns="http://www.w3.org/2000/svg" width="20" height="32" viewBox="0 0 20 32" focusable="false">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.6167 29.2619C10.3977 30.9795 8.42205 32 6.31585 32L0.0079937 32C0.00799463 21.3333 0.00795742 10.6667 0.0079984 9.69544e-06L6.31587 4.52484e-06C8.42206 8.52367e-06 10.3977 1.02053 11.6167 2.73815L19.18 13.3956C20.287 14.9554 20.287 17.0446 19.18 18.6044L11.6167 29.2619Z"
            fill="#FFFFFF"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.6176 29.2619C10.3987 30.9795 8.42303 32 6.31682 32L0.00897026 32L0.00897035 31L6.31683 31C8.099 31 9.7707 30.1365 10.8021 28.6831L18.3655 18.0256C19.2265 16.8124 19.2265 15.1876 18.3655 13.9744L10.8021 3.31689C9.7707 1.86353 8.099 1.00001 6.31684 1L0.00897106 1.00001L0.00897497 9.69544e-06L6.31684 4.52484e-06C8.42304 8.52367e-06 10.3987 1.02053 11.6176 2.73815L19.181 13.3956C20.288 14.9554 20.288 17.0446 19.181 18.6044L11.6176 29.2619Z"
            fill="#B2B8BF"
        />
    </svg>
));

ArrowBorderRight.displayName = 'ArrowBorderRight';

/** Внутренние составляющие StepperStep. */
interface IStepperStepComposition {
    Icon: typeof StepperStepIcon;
}

/** Свойства StepperStep. */
export interface IStepperStepProps extends React.LiHTMLAttributes<HTMLLIElement> {
    id: string;
    disabled?: boolean;
    icon?: ReactNode;
}

/** Компонент StepperStep, шаг в Stepper. */
export const StepperStep: React.FC<IStepperStepProps> & IStepperStepComposition = ({
    children,
    className,
    id,
    onFocus,
    onBlur,
    onKeyDown,
    onMouseDown,
    onClick,
    disabled,
    icon,
    ...rest
}) => {
    const {selectedId, onSelectStep} = useContext(StepperExtendedContext);
    const [focusSource, setFocusSource] = useState(EFocusSource.NONE);
    const ref = useRef<HTMLLIElement>(null);
    const selected = id === selectedId;
    const classNames = classnames(
        'cssClass[step]',
        {
            'cssClass[onlyIcon]': !!icon && !children,
            'cssClass[onlyText]': !icon && !!children,
            'cssClass[selected]': selected,
            'cssClass[disabled]': !!disabled,
            'cssClass[focusVisible]': focusSource === EFocusSource.KEYBOARD,
        },
        className
    );

    const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
        onSelectStep(id);
        onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
        const {keyCode} = event;

        if (isKey(keyCode, 'ENTER')) onSelectStep(id);
        else if (isKey(keyCode, 'SPACE')) {
            event.preventDefault();
            onSelectStep(id);
        }
        onKeyDown?.(event);
    };

    const renderTextBlock = (size: ETextSize, type: EFontType) => {
        const classNames = classnames('cssClass[text]', {'cssClass[unselected]': !selected && type === EFontType.GENERAL});

        return (
            <Text className={classNames} size={size} type={type}>
                {children}
            </Text>
        );
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLLIElement>): void => {
        if (!focusSource) {
            setFocusSource(EFocusSource.MOUSE);
        }
        onMouseDown?.(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLLIElement>): void => {
        if (!focusSource && ref.current === event.target) {
            setFocusSource(EFocusSource.KEYBOARD);
        }
        onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLLIElement>): void => {
        if (ref.current !== document.activeElement && ref.current === event.target) {
            setFocusSource(EFocusSource.NONE);
        }
        onBlur?.(event);
    };

    return (
        <li
            className={classNames}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            tabIndex={disabled ? -1 : 0}
            {...rest}
            role="tab"
            ref={ref}
        >
            {icon && <span className="cssClass[icon]">{icon}</span>}
            {children && renderTextBlock(ETextSize.B2, disabled ? EFontType.DISABLED : EFontType.GENERAL)}
            <ArrowBorderRight />
        </li>
    );
};

StepperStep.Icon = StepperStepIcon;
