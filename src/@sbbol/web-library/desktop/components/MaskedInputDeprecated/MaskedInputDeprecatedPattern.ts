import {DEFAULT_FORMAT_CHARACTERS, DEFAULT_PLACEHOLDER_CHAR, ESCAPE_CHAR} from '@sbbol/web-library/desktop/components/MaskedInput/consts';
import {TFormatCharacters} from '@sbbol/web-library/desktop/components/MaskedInput/types';
import {IStringHashMap} from '../../common/types/CoreTypes';

/** Класс шаблона маски. */
export class MaskedInputDeprecatedPattern {
    /** Шаблон после обработки символов экранирования. */
    public pattern: string[];
    /** Длина шаблона после обработки символов экранирования. */
    public length: number;
    /** Индекс первого редактируемого элемента. */
    public firstEditableIndex: number;
    /** Индекс последнего редактируемого элемента. */
    public lastEditableIndex: number;
    /** Символ-заполнитель. */
    private readonly placeholderChar: string;
    /** Символы для заполнения пустых редактируемых позиций в маске. */
    private readonly placeholderAsMask?: string[];
    /** Правила обработки символов маски. */
    private readonly formatCharacters: TFormatCharacters;
    /** Шаблон с символами экранирования. */
    private readonly source: string;
    /** Хэш редактируемых индексов в шаблоне. */
    private readonly editableIndices: IStringHashMap<boolean> = {};

    /**
     * @param {string} source Маска.
     * @param {TFormatCharacters} formatCharacters Правила обработки символов маски.
     * @param {string} placeholderChar Символ-заполнитель.
     * @param {string?} placeholderAsMask Строка-заполнитель (имеет более высокий приоритет, чем символ).
     */
    constructor(
        source: string,
        formatCharacters: TFormatCharacters = DEFAULT_FORMAT_CHARACTERS,
        placeholderChar: string = DEFAULT_PLACEHOLDER_CHAR,
        placeholderAsMask?: string
    ) {
        if (placeholderAsMask) {
            this.placeholderAsMask = placeholderAsMask.split('');
        }
        this.placeholderChar = placeholderChar;
        this.formatCharacters = formatCharacters;
        this.source = source;
        this.pattern = [];
        this.length = 0;
        this.firstEditableIndex = -1;
        this.lastEditableIndex = -1;

        this.editableIndices = {};

        this.parse();
    }

    /**
     * Возвращает символ-заполнитель для ещё не введённых редактируемых индексов.
     */
    public getPlaceholderChar(idx: number): string {
        return (this.placeholderAsMask && this.placeholderAsMask[idx]) || this.placeholderChar;
    }

    /**
     * Форматирование значения по шаблону.
     *
     * @param {string[]} value Исходное значение.
     * @return {string[]} Отформатированное значения.
     */
    public formatValue(value: string[]): string[] {
        const valueBuffer = new Array(this.length) as string[];
        let valueIndex = 0;

        for (let i = 0, l = this.length; i < l; i++) {
            if (this.isEditableIndex(i)) {
                valueBuffer[i] =
                    value.length > valueIndex && this.isValidAtIndex(value[valueIndex], i)
                        ? this.transform(value[valueIndex], i)
                        : this.getPlaceholderChar(i);
                valueIndex++;
            } else {
                valueBuffer[i] = this.pattern[i];
                // Позволяет значению содержать статические символы из шаблона.
                if (value.length > valueIndex && value[valueIndex] === this.pattern[i]) {
                    valueIndex++;
                }
            }
        }

        return valueBuffer;
    }

    /**
     * Является ли данный индекс редактируемым.
     *
     * @param {number} index Индекс для проверки.
     * @return {boolean} Результат проверки.
     */
    public isEditableIndex(index: number): boolean {
        return this.editableIndices[index];
    }

    /**
     * Подходит ли маске данный символ в данной позиции.
     *
     * @param {string} char Символ для проверки.
     * @param {number} index Позиция символа.
     * @return {boolean} Результат проверки.
     */
    public isValidAtIndex(char: string, index: number): boolean {
        return this.formatCharacters[this.pattern[index]].validate(char);
    }

    /**
     * Трансформация символа по маске.
     *
     * @param {string} char Символ для трансформации.
     * @param {number} index Позиция символа.
     * @return {boolean} Трансформированный символ.
     */
    public transform(char: string, index: number): string {
        const format = this.formatCharacters[this.pattern[index]];
        return typeof format.transform === 'function' ? format.transform(char) : char;
    }

    /**
     * Фозвращает исходное значение по отформатированному и маске.
     */
    public getRawValue(value: string[]): string {
        const rawValue = [];
        for (let i = 0, n = value.length; i < n; i++) {
            if (this.editableIndices[i] === true) {
                rawValue.push(value[i]);
            }
        }
        return rawValue.join('');
    }

    /** Разбор на редактируемые и нередактируемые символы по маске. */
    private parse() {
        const sourceChars = this.source.split('');
        let patternIndex = 0;
        const pattern = [];

        for (let i = 0, l = sourceChars.length; i < l; i++) {
            let char = sourceChars[i];
            if (char === ESCAPE_CHAR) {
                if (i === l - 1) {
                    throw new Error('InputMaskCore: pattern ends with a raw ' + ESCAPE_CHAR);
                }
                char = sourceChars[++i];
            } else if (char in this.formatCharacters) {
                if (this.firstEditableIndex === -1) {
                    this.firstEditableIndex = patternIndex;
                }
                this.lastEditableIndex = patternIndex;
                this.editableIndices[patternIndex] = true;
            }

            pattern.push(char);
            patternIndex++;
        }

        if (this.firstEditableIndex === -1) {
            throw new Error('InputMaskCore: pattern "' + this.source + '" does not contain any editable characters.');
        }

        this.pattern = pattern;
        this.length = pattern.length;
    }
}
