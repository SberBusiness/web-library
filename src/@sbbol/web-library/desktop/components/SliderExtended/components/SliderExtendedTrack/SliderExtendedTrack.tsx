import * as React from 'react';
import {useContext, useRef, useState, useLayoutEffect} from 'react';
import throttle from 'lodash.throttle';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {SliderExtendedContext} from '../../SliderExtendedContext';
import {SliderExtendedMoveHandler, TOnTargetMouseDown} from '../SliderExtendedMoveHandler';
import {SliderExtendedUtils} from '../../SliderExtendedUtils';
import {EVENT_KEY_CODES} from '../../../../utils/keyboard';
import {KeyDownListener} from '../../../KeyDownListener/KeyDownListener';
import {SliderExtendedTrackActions} from './SliderExtendedTrackActions';

export interface ISliderExtendedTrackProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: never;
    /**
     * Трек можно передвигать. По-умолчанию true.
     */
    draggable?: boolean;
}

/**
 * Компонент полосы между двумя SliderExtendedDot.
 */
export const SliderExtendedTrack: React.FC<ISliderExtendedTrackProps> = ({
    className,
    draggable = true,
    onBlur,
    onFocus,
    onMouseDown,
    onMouseOver,
    onMouseOut,
    ...htmlSpanAttributes
}) => {
    /**
     * Элемент в фокусе.
     */
    const [isFocused, setIsFocused] = useState(false);
    /**
     * Track можно передвигать.
     */
    const [innerDraggable, setInnerDraggable] = useState(false);
    /**
     * Track получил фокус при клике.
     */
    const [isFocusedByClick, setIsFocusedByClick] = useState(false);
    /**
     * Track в текущий момент перетаскивается мышью.
     */
    const [isDragByMouse, setIsDragByMouse] = useState(false);
    const [tabIndex, setTabIndex] = useState(-1);

    const trackRef = useRef<HTMLSpanElement | null>(null);
    const {
        disabled,
        dots,
        focused: focusedSlider,
        isHoverOrDragTrack,
        railNode,
        setIsHoverOrDragTrack,
        reverse,
        setFocused: setFocusedSlider,
        steps,
    } = useContext(SliderExtendedContext);
    /**
     * Предыдущая позиция курсора при перемещении SliderExtended.Track.
     */
    const cursorPrevNormalizedValue = useRef(0);

    useLayoutEffect(() => {
        if (dots.length > 1) {
            draggable && !innerDraggable && setInnerDraggable(true);
        } else if (innerDraggable !== false) {
            setInnerDraggable(false);
        }
    }, [dots]);

    useLayoutEffect(() => {
        if (dots.length > 1) {
            focusedSlider ? setTabIndex(2) : setTabIndex(-1);
        }
    }, [focusedSlider]);

    if (!dots.length) {
        return null;
    }

    const handleDocumentMouseUp = (event: MouseEvent) => {
        setIsDragByMouse(false);
        // Курсор отпущен за пределами Track.
        if (event.target !== trackRef.current) {
            setIsHoverOrDragTrack(false);
        }

        document.removeEventListener('mouseup', handleDocumentMouseUp);
    };

    const handleMouseDown = (onTargetMouseDown: TOnTargetMouseDown) => (event: React.MouseEvent<HTMLDivElement>) => {
        setIsFocusedByClick(true);

        setIsDragByMouse(true);
        document.addEventListener('mouseup', handleDocumentMouseUp);

        if (railNode) {
            cursorPrevNormalizedValue.current = SliderExtendedUtils.getNormalizedCursorValue({
                cursorXPosition: event.clientX,
                railNode,
            });
        }

        onTargetMouseDown(event);
        onMouseDown?.(event);
    };

    const handleMouseMove = (event: MouseEvent) =>
        SliderExtendedTrackActions.dragDots({
            cursorPrevNormalizedValue,
            cursorXPosition: event.clientX,
            dots,
            railNode,
            reverse,
            steps,
        });

    /**
     * Обработчик сочетаний клавиш, меняющих значение слайдера на меньшее.
     */
    const handleKeyDownToMoveLeft = (event: KeyboardEvent) => {
        // Предотвращает скролл страницы.
        event.preventDefault();

        SliderExtendedTrackActions.moveToPrevStep(dots, steps);
    };

    /**
     * Обработчик сочетаний клавиш, меняющих значение слайдера на большее.
     */
    const handleKeyDownToMoveRight = (event: KeyboardEvent) => {
        // Предотвращает скролл страницы.
        event.preventDefault();

        SliderExtendedTrackActions.moveToNextStep(dots, steps);
    };

    const handleFocus = (event: React.FocusEvent<HTMLSpanElement>) => {
        if (!focusedSlider) {
            setFocusedSlider(true);
        }

        setIsFocused(true);
        onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
        if (focusedSlider) {
            setFocusedSlider(false);
        }

        setIsFocusedByClick(false);
        setIsFocused(false);
        onBlur?.(event);
    };

    const handleMouseOver = (event: React.MouseEvent<HTMLSpanElement>) => {
        setIsHoverOrDragTrack(true);
        onMouseOver?.(event);
    };

    const handleMouseOut = (event: React.MouseEvent<HTMLSpanElement>) => {
        // Track в текущий момент не перетаскивается мышью.
        if (!isDragByMouse) {
            setIsHoverOrDragTrack(false);
        }
        onMouseOut?.(event);
    };

    const {left, right} = SliderExtendedTrackActions.getTrackPosition({dots, reverse});

    return (
        <>
            {isFocused && (
                <>
                    <KeyDownListener
                        onMatch={handleKeyDownToMoveLeft}
                        eventKeyCode={[EVENT_KEY_CODES.ARROW_LEFT, EVENT_KEY_CODES.ARROW_DOWN]}
                    />
                    <KeyDownListener
                        onMatch={handleKeyDownToMoveRight}
                        eventKeyCode={[EVENT_KEY_CODES.ARROW_RIGHT, EVENT_KEY_CODES.ARROW_UP]}
                    />
                </>
            )}

            <SliderExtendedMoveHandler onMouseMove={throttle(handleMouseMove, 100)}>
                {({onTargetMouseDown}) => (
                    <span
                        role="button"
                        tabIndex={!disabled && innerDraggable ? tabIndex : -1}
                        {...htmlSpanAttributes}
                        className={classnames('cssClass[sliderExtendedTrack]', className, {
                            'cssClass[disabled]': disabled,
                            // Не перетаскиваемый.
                            'cssClass[staticSlider]': !innerDraggable,
                            'cssClass[focusedByClick]': isFocusedByClick,
                            'cssClass[hoverOrDragByMouse]': isHoverOrDragTrack,
                        })}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onMouseDown={handleMouseDown(onTargetMouseDown)}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        ref={trackRef}
                        style={{
                            left: `${left}%`,
                            right: `${right}%`,
                        }}
                    />
                )}
            </SliderExtendedMoveHandler>
        </>
    );
};

SliderExtendedTrack.displayName = 'SliderExtendedTrack';
