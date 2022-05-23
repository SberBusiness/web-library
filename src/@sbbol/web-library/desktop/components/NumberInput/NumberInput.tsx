import * as React from 'react';
import {EInputGroupPosition} from '@sbbol/web-library/desktop/components/InputGroup/InputGroup';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {NumberBaseInput} from '../protected/NumberBaseInput/NumberBaseInput';
import {INumberBaseInputProps} from '../protected/NumberBaseInput/types';

/**
 * Свойства компонента.
 * @extends INumberBaseInputProps
 */
export interface INumberInputProps extends INumberBaseInputProps {
    /** Единица измерения.*/
    unit?: string;
    /** Позиция внутри компонента InputGroup. */
    groupPosition?: EInputGroupPosition;
}

const mapInputGroupPositionToCSSClass = {
    [EInputGroupPosition.LEFT]: 'cssClass[left]',
    [EInputGroupPosition.INTERMEDIATE]: 'cssClass[intermediate]',
    [EInputGroupPosition.RIGHT]: 'cssClass[right]',
};

/** Компонент ввода суммы или количества. */
export class NumberInput extends React.PureComponent<INumberInputProps> {
    public static displayName = 'NumberInput';
    public static defaultProps = {
        max: Number.MAX_SAFE_INTEGER,
        min: Number.MIN_SAFE_INTEGER,
    };

    public render(): JSX.Element {
        const {className, unit, groupPosition, 'data-test-id': dataTestId = NumberInput.displayName, ...restProps} = this.props;
        const {value, error, disabled} = restProps;

        const classNames = classnames(
            'cssClass[numberInput]',
            {
                'cssClass[filled]': !!value,
                'cssClass[withUnit]': !!unit,
                'cssClass[grouped]': !!groupPosition,
                'cssClass[error]': !!error,
                'cssClass[disabled]': !!disabled,
            },
            className
        );

        return (
            <div className={classNames} data-test-id={dataTestId}>
                <NumberBaseInput
                    {...restProps}
                    className={groupPosition ? mapInputGroupPositionToCSSClass[groupPosition] : undefined}
                    data-test-id={`${dataTestId}__input`}
                />
                {unit && (
                    <div className="cssClass[unitBox]">
                        <span className="cssClass[unitText]" data-test-id={`${dataTestId}__unit`}>
                            {unit}
                        </span>
                    </div>
                )}
            </div>
        );
    }
}
