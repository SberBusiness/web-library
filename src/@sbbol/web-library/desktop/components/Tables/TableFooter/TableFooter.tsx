import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {FooterDescription} from '@sbbol/web-library/desktop/components/Footer/components/FooterDescription';
import {TableFooterSummary} from '@sbbol/web-library/desktop/components/Tables/TableFooter/components/TableFooterSummary';
import {isIE} from '@sbbol/web-library/desktop/utils/userAgentUtils';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {FooterDescriptionControls} from '@sbbol/web-library/desktop/components/Footer/components/FooterDescriptionControls';

/**
 * Состояние компонента подвала таблицы.
 *
 * @prop {boolean} isFixed Фиксированное позиционирование (прижат к низу окна).
 * @prop {number} footerWidth Ширина подвала в пикселях.
 */
interface ITableFooterState {
    isFixed: boolean;
    footerWidth: number;
}

/**
 * @prop {boolean} [isLoading] Состояние загрузки.
 */
interface ITableFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    isLoading?: boolean;
}

/** Компонент подвала таблицы. */
// eslint-disable-next-line @typescript-eslint/ban-types
export class TableFooter extends React.PureComponent<ITableFooterProps, ITableFooterState> {
    public static displayName = 'TableFooter';

    state = {
        isFixed: false,
        footerWidth: 0,
    };

    public static Summary = TableFooterSummary;
    public static Controls = FooterDescriptionControls;

    public componentDidMount(): void {
        if (isIE) {
            document.addEventListener('scroll', this.updateFooterStyle);
            this.updateFooterStyle();
        }
    }

    public componentWillUnmount(): void {
        isIE && document.removeEventListener('scroll', this.updateFooterStyle);
    }

    render(): JSX.Element {
        const {isFixed, footerWidth} = this.state;
        const {children, className, isLoading, ...htmlDivAttributes} = this.props;

        const footerWrapperClassName = classnames(className, 'cssClass[tableFooterWrapper]', {'cssClass[ieBrowser]': isIE});
        const footerClassName = classnames('cssClass[tableFooter]', {'cssClass[fixed]': isIE && isFixed});
        const footerStyle = isIE && isFixed ? {width: `${footerWidth}px`} : undefined;

        return (
            <div className={footerWrapperClassName} {...htmlDivAttributes}>
                <div className={footerClassName} style={footerStyle}>
                    <FooterDescription>{children}</FooterDescription>
                </div>
            </div>
        );
    }

    /** Перерасчёт стилей (позиционирования и ширины) футера. Только для IE. */
    private updateFooterStyle = () => {
        // eslint-disable-next-line react/no-find-dom-node
        const footerWrapper = ReactDOM.findDOMNode(this) as Element;
        if (!footerWrapper) {
            return;
        }

        const footer = footerWrapper.firstElementChild;
        const table = footerWrapper.previousElementSibling;
        if (!footer || !table) {
            return;
        }

        const rectFooter = footer.getBoundingClientRect();
        const rectTable = table.getBoundingClientRect();

        const isFixed = rectTable.bottom + rectFooter.height > window.innerHeight;

        this.setState((prevState) => ({
            isFixed: isFixed,
            footerWidth: isFixed && !this.state.isFixed ? rectTable.width : prevState.footerWidth,
        }));
    };
}
