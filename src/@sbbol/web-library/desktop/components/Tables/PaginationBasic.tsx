import {PaginatorleftNavIcon32} from '@sberbusiness/icons/PaginatorleftNavIcon32';
import {PaginatorrightNavIcon32} from '@sberbusiness/icons/PaginatorrightNavIcon32';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {ButtonIcon, IButtonIconProps} from '@sbbol/web-library/desktop/components/Button/ButtonIcon/ButtonIcon';
import * as React from 'react';
import {getDataHTMLAttributes, TDataHTMLAttributes} from '@sbbol/web-library/desktop/utils/HTML/DataAttributes';
import {TestIds} from '@sbbol/web-library/common/dataTestIds/dataTestIds';
import {ESelectOrientation, ISelectOption, Select} from '@sbbol/web-library/desktop/components/Select/Select';

/**
 * Пагинация для таблицы.
 * @prop rowNumberOptions Опции отображения количества строк в таблице.
 * @prop [rowNumber] Количество записей на страницу.
 * @prop onSelectRowNumber Функция при выборе опции количества строк в таблице.
 * @prop currentPageNumber Номер текущей страницы в таблице.
 * @prop paginationLabel Текст лейбла пагинации.
 * @prop hasPrevPage Имеется ли предыдущая страница.
 * @prop hasNextPage Имеется ли следующая страница.
 * @prop onClickPrevPage Функция при смене страницы на предыдущую.
 * @prop onClickNextPage Функция при смене страницы на следующую.
 * @prop [isLoading] Состояние загрузки.
 * @prop [dataAttributes] Data-атрибуты.
 */
interface ITableBasicPaginationProps {
    rowNumberOptions: number[];
    rowNumber?: number;
    onSelectRowNumber: (option: number) => void;
    currentPageNumber: number;
    paginationLabel: string;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    onClickPrevPage: () => void;
    onClickNextPage: () => void;
    children?: never;
    isLoading?: boolean;
    dataAttributes?: TDataHTMLAttributes;
}

/** Компонент пагинации для таблицы. */
export class PaginationBasic extends React.PureComponent<ITableBasicPaginationProps> {
    public static displayName = 'PaginationBasic';

    public render(): JSX.Element {
        const {rowNumberOptions, rowNumber, currentPageNumber, isLoading, paginationLabel, dataAttributes} = this.props;
        const dataTestId = dataAttributes ? dataAttributes['test-id'] : undefined;

        const options: ISelectOption[] = rowNumberOptions.map((o) => ({label: o, value: String(o)}));
        const filteredOptions = options.filter((x) => x.value === String(rowNumber));
        const selectedOption = filteredOptions.length ? filteredOptions[0] : options[0];

        return (
            <div className="cssClass[paginationWrapper]" {...(Boolean(dataAttributes) && getDataHTMLAttributes(dataAttributes!))}>
                <div className="cssClass[paginationSelectBlock]">
                    <div className="cssClass[paginationSelectText]">{paginationLabel}</div>
                    <div className="cssClass[paginationSelect]">
                        <Select
                            options={options}
                            value={selectedOption}
                            onChange={this.onSelectRowNumber}
                            orientation={ESelectOrientation.TOP}
                            disabled={isLoading}
                            data-test-id={dataTestId && `${dataTestId}${TestIds.Tables.PaginationBasic.select}`}
                        />
                    </div>
                </div>

                <span className="cssClass[paginationIteratorBlock]">
                    {this.renderPrevButton(dataTestId)}
                    <span
                        className="cssClass[pageNumber]"
                        data-test-id={dataTestId && `${dataTestId}${TestIds.Tables.PaginationBasic.pageNumber}`}
                    >
                        {currentPageNumber}
                    </span>
                    {this.renderNextButton(dataTestId)}
                </span>
            </div>
        );
    }

    private renderPrevButton = (dataTestId: string | undefined) => {
        const {hasPrevPage, onClickPrevPage} = this.props;
        const dti = dataTestId && `${dataTestId}${TestIds.Tables.PaginationBasic.prevPage}`;

        return this.renderButtonIcon(<PaginatorleftNavIcon32 />, hasPrevPage, {onClick: onClickPrevPage}, dti);
    };

    private renderNextButton = (dataTestId: string | undefined) => {
        const {hasNextPage, onClickNextPage} = this.props;
        const dti = dataTestId && `${dataTestId}${TestIds.Tables.PaginationBasic.nextPage}`;

        return this.renderButtonIcon(<PaginatorrightNavIcon32 />, hasNextPage, {onClick: onClickNextPage}, dti);
    };

    private renderButtonIcon = (icon: JSX.Element, isActive: boolean, buttonProps: Partial<IButtonIconProps>, dti?: string) => {
        const {isLoading} = this.props;
        const disabled = isLoading || !isActive;

        return (
            <span
                className={classnames({
                    'cssClass[disable]': disabled,
                    'cssClass[paginationIteratorButton]': true,
                })}
            >
                <ButtonIcon disabled={disabled} data-test-id={dti} {...buttonProps}>
                    {icon}
                </ButtonIcon>
            </span>
        );
    };

    private onSelectRowNumber = (option: ISelectOption) => {
        const {onSelectRowNumber} = this.props;
        return onSelectRowNumber(Number(option.value));
    };
}
