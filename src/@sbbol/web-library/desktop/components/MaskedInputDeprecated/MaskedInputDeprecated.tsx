import * as React from 'react';
import {TFormatCharacters} from '@sbbol/web-library/desktop/components/MaskedInput/types';
import {MaskedInputDeprecatedBehavior} from './MaskedInputDeprecatedBehavior';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {EVENT_KEYS} from '@sbbol/web-library/desktop/utils/keyboard';

/**
 * Свойства компонента маскированного поля ввода.
 *
 * @prop {boolean} [keepCharPositions] Признак сохранения позиций символов при вводе/удалении.
 * @prop {boolean} [keepCaretPositionOnFocus] Признак сохранения позиции каретки при смене фокуса.
 * @prop {boolean} [overtype] Признак замены при вводе.
 * @prop {boolean} [autoSelectOnFocus] Признак выделения значения при фокусе.
 * @prop {TFormatCharacters} [formatCharacters] Конфигурация для работы с маской.
 * @prop {Function} onChange Обработчик изменения значения.
 * @prop {Function} [onPaste] Обработчик вставки значения из буфера обмена.
 * @prop {string} [placeholderChar] Символ для замены (по умолчанию "_").
 * @prop {string} [placeholderAsMask] Символы для заполнения пустых редактируемых позиций в маске (например, строка
 * вида "дд.мм.гггг").
 * @prop {Function} [validate] Функция-валидатор значения (при невалидном вводе значение поля и
 * положение каретки не изменится).
 * @prop {boolean} [focused] Состояние фокуса.
 * @prop {boolean} [error] Признак ошибки ввода данных.
 * @prop {string} value Значение.
 * @prop {string} mask Маска ввода.
 * @prop {Function} [setRef] Получить ссылку на элемент.
 */
export interface IMaskedInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'placeholder'> {
    keepCharPositions?: boolean;
    keepCaretPositionOnFocus?: boolean;
    overtype?: boolean;
    autoSelectOnFocus?: boolean;
    formatCharacters?: TFormatCharacters;
    onChange: (value: string, e?: React.SyntheticEvent<HTMLInputElement>) => void;
    onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    placeholderChar?: string;
    placeholderAsMask?: string;
    validate?: (value: string) => boolean;
    value: string;
    mask: string;
    focused?: boolean;
    error?: boolean;
    setRef?: (ref: HTMLInputElement) => void;
}

/**
 * Состояние компонента.
 * @prop {boolean} focused  Признак того, что сейчас компонент в фокусе.
 */
export interface IMaskedInputState {
    focused: boolean;
}

/**
 * Компонент маскированного поля ввода.
 */
export class MaskedInputDeprecated extends React.PureComponent<IMaskedInputProps, IMaskedInputState> {
    public static displayName = 'MaskedInput';

    public state: IMaskedInputState = {
        focused: false,
    };

    /** Библиотека для работы с маской. */
    protected maskedInputBehavior: MaskedInputDeprecatedBehavior;
    /** Сохранённое по рефам поле ввода. */
    protected savedInput?: HTMLInputElement;
    /** Сохранённая на начало выделения позиция каретки. */
    protected selectionStartedIdx = 0;

    constructor(props: Readonly<IMaskedInputProps>) {
        super(props);
        const {mask, value, formatCharacters, placeholderChar, overtype, validate, keepCharPositions, placeholderAsMask} = props;

        this.maskedInputBehavior = new MaskedInputDeprecatedBehavior({
            formatCharacters,
            keepCharPositions,
            overtype: overtype || (overtype === undefined && !!keepCharPositions),
            pattern: mask,
            placeholderChar,
            placeholderAsMask,
            validate,
            value,
        });
    }

    public componentDidMount(): void {
        this.maskedInputBehavior.setValue(this.props.value);
    }

    public componentDidUpdate(prevProps: IMaskedInputProps): void {
        const {value: prevValue, mask: prevMask} = prevProps;
        const {value, mask} = this.props;

        // Обновляем значение маски, если значение изменилось.
        if (value !== prevValue) {
            this.maskedInputBehavior.setValue(value);
            this.forceUpdate();
        }

        // Обновляем шаблон, если маска изменилась.
        if (prevMask !== mask) {
            this.maskedInputBehavior.setPattern(mask, {
                placeholderAsMask: this.props.placeholderAsMask,
                value: value === prevValue ? this.maskedInputBehavior.getRawValue() : value,
            });

            this.forceUpdate();
        }
    }

    /**
     * Сохраняет Ref-ссылку на поле ввода.
     *
     * @param {HTMLInputElement} input Поле ввода.
     */
    public saveInputElement = (input: HTMLInputElement): void => {
        const {setRef} = this.props;

        this.savedInput = input;

        setRef?.(input);
    };

    public render(): React.ReactNode {
        const {
            props: {
                className,
                value,
                mask: omittedMask,
                formatCharacters: omittedFormatCharacters,
                validate: omittedValidate,
                overtype: omittedOvertype,
                keepCharPositions: omittedKeepCharPositions,
                placeholderAsMask: omittedPlaceholderAsMask,
                onChange: omittedOnChange,
                readOnly,
                disabled,
                autoSelectOnFocus,
                keepCaretPositionOnFocus,
                error,
                focused,
                setRef,
                ...props
            },
            maskedInputBehavior,
            handleChange,
            handleKeyDown,
            handleMouseDown,
            handleKeyPress,
            handlePaste,
            handleFocus,
            handleBlur,
            handleCut,
            saveInputElement,
        } = this;

        const val = maskedInputBehavior.getValue();
        const classNames = classnames(
            'cssClass[input]',
            {'cssClass[empty]': !value, 'cssClass[error]': !!error, 'cssClass[focus]': !!focused},
            className
        );

        return (
            <div>
                <input
                    {...props}
                    maxLength={maskedInputBehavior && maskedInputBehavior.pattern.length}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onKeyPress={handleKeyPress}
                    onMouseDown={handleMouseDown}
                    onPaste={handlePaste}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onCut={handleCut}
                    disabled={readOnly || disabled}
                    value={val}
                    ref={saveInputElement}
                    className={classNames}
                    type="text"
                    spellCheck={false}
                />
            </div>
        );
    }

    /**
     * Обработчик изменения значения поля ввода.
     */
    public handleChange = (): void => {
        // не вызывается, если не указать его в инпуте, то в консоли ошибка:
        // Failed prop type: You provided a `value` prop to a form field without an `onChange` handler.
        // This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`
        // но наш инпут является изменяемым, а defaultValue не обновляется при изменении пропсы
    };

    /**
     * Обработчик нажатия на клавишу.
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} event Событие.
     */
    private handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const {currentTarget: input} = event;
        const {
            maskedInputBehavior,
            props: {onChange, onKeyDown, validate},
        } = this;
        const {key} = event.nativeEvent;

        let old: string;
        let value = '';
        let changed: boolean;

        if ((event.ctrlKey || event.metaKey) && (event.shiftKey ? EVENT_KEYS.Y : EVENT_KEYS.Z).indexOf(key) !== -1) {
            // Отмена
            event.preventDefault();
            if (maskedInputBehavior.undo()) {
                input.value = maskedInputBehavior.getValue();
                input.setSelectionRange(maskedInputBehavior.selection.start, maskedInputBehavior.selection.end);

                onChange?.(input.value === maskedInputBehavior.emptyValue ? '' : input.value, event);
            }
            return;
        } else if ((event.ctrlKey || event.metaKey) && (event.shiftKey ? EVENT_KEYS.Z : EVENT_KEYS.Y).indexOf(key) !== -1) {
            // Повтор
            event.preventDefault();
            if (maskedInputBehavior.redo()) {
                input.value = maskedInputBehavior.getValue();
                input.setSelectionRange(maskedInputBehavior.selection.start, maskedInputBehavior.selection.end);

                onChange?.(input.value === maskedInputBehavior.emptyValue ? '' : input.value, event);
            }
            return;
        } else if (EVENT_KEYS.BACKSPACE.indexOf(key) !== -1) {
            event.preventDefault();
            maskedInputBehavior.selection = {
                end: input.selectionEnd || 0,
                start: input.selectionStart || 0,
            };
            old = input.value;
            changed = false;
            let inputValue = old;
            while (maskedInputBehavior.backspace()) {
                changed = true;
                inputValue = maskedInputBehavior.getValue();
                value = inputValue === maskedInputBehavior.emptyValue ? '' : inputValue;
                if (value !== old) {
                    break;
                }
            }
            if (changed && (!validate || maskedInputBehavior.isIncomplete() || validate(value))) {
                input.value = inputValue;
                input.setSelectionRange(maskedInputBehavior.selection.start, maskedInputBehavior.selection.end);

                onChange?.(value, event);
            }
            return;
        } else if (EVENT_KEYS.DELETE.indexOf(key) !== -1) {
            event.preventDefault();
            maskedInputBehavior.selection = {
                end: input.selectionEnd || 0,
                start: input.selectionStart || 0,
            };
            old = input.value;
            maskedInputBehavior.del();
            const inputValue = maskedInputBehavior.getValue();
            value = inputValue === maskedInputBehavior.emptyValue ? '' : inputValue;
            if (inputValue !== old && (!validate || maskedInputBehavior.isIncomplete() || validate(value))) {
                input.value = inputValue;
                input.setSelectionRange(maskedInputBehavior.selection.start, maskedInputBehavior.selection.end);

                onChange?.(value, event);
            }
            return;
        } else if (EVENT_KEYS.ARROW_RIGHT.indexOf(key) !== -1) {
            const firstFreePosition = this.maskedInputBehavior.getFirstFreePosition();
            if ((input.selectionEnd || 0) === firstFreePosition && input.selectionDirection == 'forward') {
                event.preventDefault();
            }
        } else if (EVENT_KEYS.ARROW_LEFT.indexOf(key) !== -1) {
            const firstFreePosition = this.maskedInputBehavior.getFirstFreePosition();
            if ((input.selectionStart || 0) === firstFreePosition && input.selectionDirection == 'backward') {
                event.preventDefault();
            }
        } else if (event.metaKey && EVENT_KEYS.X.indexOf(key) !== -1) {
            //fix for Safari
            this.handleCut((event as unknown) as React.ClipboardEvent<HTMLInputElement>);
        }

        onKeyDown?.(event);
    };

    /**
     * Обработчик нажатия символьных клавиш, пробела и backspace.
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} event Событие.
     */
    private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const {currentTarget: input} = event;
        const {
            maskedInputBehavior,
            props: {onChange},
        } = this;

        maskedInputBehavior.selection = {
            end: input.selectionEnd || 0,
            start: input.selectionStart || 0,
        };

        maskedInputBehavior.setValue(input.value);

        if (maskedInputBehavior.input(event.key)) {
            const value = maskedInputBehavior.getValue();
            input.value = value;
            input.setSelectionRange(maskedInputBehavior.selection.start, maskedInputBehavior.selection.end);

            onChange?.(value, event);
        }
    };

    /**
     * Обработчик вставки текста из буфера обмена.
     *
     * @param {React.ClipboardEvent<HTMLInputElement>} event Событие.
     */
    private handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        if (event && event.clipboardData) {
            event.preventDefault();
            const text = event.clipboardData.getData('Text');
            const {currentTarget: input} = event;
            const {
                maskedInputBehavior,
                props: {onChange, onPaste},
            } = this;

            if (onPaste) {
                onPaste(event);
            } else {
                maskedInputBehavior.selection = {
                    end: input.selectionEnd || 0,
                    start: input.selectionStart || 0,
                };
                if (!maskedInputBehavior.paste(text)) {
                    return;
                }
                const value = maskedInputBehavior.getValue();
                input.value = value;
                input.setSelectionRange(maskedInputBehavior.selection.start, maskedInputBehavior.selection.end);

                onChange?.(value, event);
            }
        }
    };

    /**
     * Обработчик фокуса на поле ввода.
     *
     * @param {React.FocusEvent<HTMLInputElement>} event Событие.
     */
    private handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        const {currentTarget: input} = event;
        const {onFocus, autoSelectOnFocus} = this.props;

        if (autoSelectOnFocus) {
            // Выделяем весь текст.
            input.setSelectionRange(0, this.maskedInputBehavior.value.length);
        } else if (this.maskedInputBehavior.getValue() === this.maskedInputBehavior.emptyValue) {
            const position = this.maskedInputBehavior.getFirstFreePosition();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if ((document as any).documentMode) {
                // IE fix
                input.setSelectionRange(position, position);
            } else {
                requestAnimationFrame(() => input.setSelectionRange(position, position));
            }
        }

        this.setState({focused: true}, () => onFocus?.(event));
    };

    /**
     * Обработчик потери фокуса с поля ввода.
     *
     * @param {React.FocusEvent<HTMLInputElement>} event Событие.
     */
    private handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const {onBlur} = this.props;

        this.setState({focused: false}, () => onBlur?.(event));
    };

    /**
     * Обработчик нажатия на кнопку мыши (трекпада) на поле ввода.
     *
     * @param {React.MouseEvent<HTMLInputElement>} event Событие.
     */
    private handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
        const {currentTarget: input} = event;
        const {keepCaretPositionOnFocus, onMouseDown} = this.props;

        if (this.state.focused || this.props.focused) {
            if (!keepCaretPositionOnFocus) {
                requestAnimationFrame(() => {
                    const position = this.maskedInputBehavior.getFirstFreePosition();

                    if (input.selectionEnd && input.selectionEnd > position) {
                        // Устанавливаем каретку на первый доступный для ввода символ.
                        input.setSelectionRange(position, position);
                    }
                });
            }
        } else if (keepCaretPositionOnFocus) {
            // Сохраняем предыдущую позицию каретки.
            event.preventDefault();
            input.focus();
        }

        onMouseDown?.(event);
    };

    /**
     * Обработчик события вырезания
     *
     * @param {React.ClipboardEvent<HTMLInputElement>} event Событие.
     */
    private handleCut = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const {currentTarget: input} = event;
        //Если нет выделения текста
        if (!(input.selectionStart !== null && input.selectionEnd !== null && input.selectionStart !== input.selectionEnd)) {
            return;
        }

        document.execCommand('copy');

        const {
            maskedInputBehavior,
            props: {onChange, validate},
        } = this;
        maskedInputBehavior.selection = {
            end: input.selectionEnd || 0,
            start: input.selectionStart || 0,
        };
        const old = input.value;
        maskedInputBehavior.del();
        const inputValue = maskedInputBehavior.getValue();
        const value = inputValue === maskedInputBehavior.emptyValue ? '' : inputValue;
        if (inputValue !== old && ((!validate && maskedInputBehavior.isIncomplete()) || (validate && validate(value)))) {
            input.value = inputValue;
            input.setSelectionRange(maskedInputBehavior.selection.start, maskedInputBehavior.selection.end);

            onChange?.(value, event);
        }
        return;
    };
}
