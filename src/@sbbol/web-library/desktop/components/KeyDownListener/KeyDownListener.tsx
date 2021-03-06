import {EVENT_KEY_CODES} from '@sbbol/web-library/desktop/utils/keyboard';
import * as React from 'react';

type keyCode = typeof EVENT_KEY_CODES[keyof typeof EVENT_KEY_CODES];

export interface IKeyDownListenerProps {
    eventKeyCode: keyCode | keyCode[];
    /**
     * Обработчик нажатия клавиши.
     */
    onMatch: (event: KeyboardEvent) => void;
}

/**
 * Слушатель нажатия клавиш. При совпадении нужной клавиши вызывает onMatch.
 */
export class KeyDownListener extends React.Component<IKeyDownListenerProps> {
    public componentDidMount(): void {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    public componentWillUnmount(): void {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Обработчик для нажатия клавиш.
     *
     * @param {KeyboardEvent} event Событие нажатия клавиши.
     */
    public handleKeyDown = (event: KeyboardEvent): void => {
        const {eventKeyCode, onMatch} = this.props;

        if (typeof eventKeyCode === 'number') {
            eventKeyCode === event.keyCode && onMatch(event);
        } else if (eventKeyCode.includes(event.keyCode)) {
            onMatch(event);
        }
    };

    public render(): React.ReactNode {
        return this.props.children || null;
    }
}
