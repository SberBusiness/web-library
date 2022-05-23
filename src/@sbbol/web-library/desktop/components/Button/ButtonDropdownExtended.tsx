import * as React from 'react';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {Dropdown} from '@sbbol/web-library/desktop/components/Dropdown/Dropdown';
import {isKey} from '@sbbol/web-library/desktop/utils/keyboard';

/** Состояния кнопки с выпадающим блоком. */
interface IButtonDropdownExtendedState {
    /** Состояние контролируемости. */
    isControlled: boolean;
    /** Состояние открытости. */
    isOpened?: boolean;
}

/** Свойства встроенной кнопки. */
export interface IButtonDropdownExtendedButtonProvideProps {
    /** Контролируемое состояние открытости. */
    opened: boolean;
    /** Функция, контролирующая состояние открытости. */
    setOpened: (opened: boolean) => void;
}

/** Свойства встроенного выпадающего блока. */
export interface IButtonDropdownExtendedDropdownProvideProps {
    /** Контролируемое состояние открытости. */
    opened: boolean;
    /** Функция, контролирующая состояние открытости. */
    setOpened: (opened: boolean) => void;
    /** Пробрасываемый стилевой класс. */
    className: string;
}

/** Свойства кнопки с выпадающим блоком. */
export interface IButtonDropdownExtendedProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Контролируемое состояние открытости. */
    opened?: boolean;
    /** Функция, контролирующая состояние открытости. */
    setOpened?: (opened: boolean) => void;
    /** Функция, отрисовывающая кнопку. */
    renderButton: (props: IButtonDropdownExtendedButtonProvideProps) => React.ReactNode;
    /** Функция, отрисовывающая выпадающий блок. */
    renderDropdown: (props: IButtonDropdownExtendedDropdownProvideProps) => React.ReactNode;
}

/** Компонент "Кнопка с выпадающим блоком". */
export class ButtonDropdownExtended extends React.Component<IButtonDropdownExtendedProps, IButtonDropdownExtendedState> {
    public static Dropdown = Dropdown;
    private ref = React.createRef<HTMLDivElement>();
    constructor(props: IButtonDropdownExtendedProps) {
        super(props);
        this.state = {isControlled: props.opened !== undefined, isOpened: props.opened === undefined ? false : undefined};
    }

    private getOpened = (): boolean => {
        const {opened} = this.props;
        const {isControlled, isOpened} = this.state;

        return !!(isControlled ? opened : isOpened);
    };

    private handleOpen = (opened: boolean) => {
        const {setOpened} = this.props;
        const {isControlled} = this.state;

        isControlled ? setOpened!(opened) : this.setState({isOpened: opened});
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        const key = event.code || event.keyCode;

        if (isKey(key, 'ESC') && this.getOpened()) {
            this.handleOpen(false);
        }
    };

    private handleClick = (event: MouseEvent) => {
        const {target} = event;

        if (this.getOpened() && this.ref?.current !== target && !this.ref?.current?.contains(target as Node)) {
            this.handleOpen(false);
        }
    };

    private addListeners(): void {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('click', this.handleClick);
    }

    private removeListeners(): void {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('click', this.handleClick);
    }

    public componentDidMount(): void {
        if (this.getOpened()) {
            this.addListeners();
        }
    }

    public componentDidUpdate(prevProps: Readonly<IButtonDropdownExtendedProps>, prevState: Readonly<IButtonDropdownExtendedState>): void {
        const {opened} = this.props;
        const {isOpened, isControlled} = this.state;
        const {opened: prevOpened} = prevProps;
        const {isOpened: prevIsOpened} = prevState;

        if (isControlled) {
            if (opened && !prevOpened) {
                this.addListeners();
            } else if (!opened && prevOpened) {
                this.removeListeners();
            }
        } else {
            if (isOpened && !prevIsOpened) {
                this.addListeners();
            } else if (!isOpened && prevIsOpened) {
                this.removeListeners();
            }
        }
    }

    public componentWillUnmount(): void {
        if (this.getOpened()) {
            this.removeListeners();
        }
    }

    public render(): JSX.Element {
        const {className, opened, setOpened, renderButton, renderDropdown, ...props} = this.props;
        const classNames = classnames('cssClass[buttonDropdownExtended]', className);

        return (
            <div className={classNames} ref={this.ref} {...props}>
                {renderButton({opened: this.getOpened(), setOpened: this.handleOpen})}
                {renderDropdown({opened: this.getOpened(), setOpened: this.handleOpen, className: 'cssClass[buttonDropdownExtendedBlock]'})}
            </div>
        );
    }
}
