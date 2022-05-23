import React from 'react';
import {
    ISelectExtendedDropdownProvideProps,
    ISelectExtendedProps,
    ISelectExtendedTargetProvideProps,
    SelectExtended,
} from './SelectExtended';
import {ISelectExtendedTargetProps} from './components/SelectExtendedTarget';
import {IDropdownListItemProps} from '../Dropdown/components/DropdownListItem';
import {TestProps} from '../../common/types/CoreTypes';
import {EInputGroupPosition} from '@sbbol/web-library/desktop/components/InputGroup/InputGroup';
import {TestIds} from '../../../common/dataTestIds/dataTestIds';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';

/** Направление открытия выпадающего списка. */
export enum ESelectOrientation {
    BOTTOM,
    TOP,
}

/** Свойства опции списка. */
export interface ISelectOption
    extends Omit<IDropdownListItemProps, 'active' | 'onSelect' | 'selected' | 'keyCodesForSelection' | 'className' | 'id' | 'key'> {
    /** Значение опции. */
    value: string;
    /** Название опции. */
    label: React.ReactNode;
}

/** Свойства компонента Select.*/
export interface ISelectProps
    extends Omit<ISelectExtendedProps, 'children' | 'onChange' | 'placeholder' | 'renderTarget'>,
        Pick<ISelectExtendedTargetProps, 'disabled' | 'error' | 'loading' | 'placeholder'>,
        TestProps {
    children?: never;
    /** Текущее выбранное значение. */
    value?: ISelectOption;
    /** Список опций. */
    options: ISelectOption[];
    /** Обработчик изменения значения. */
    onChange: (option: ISelectOption) => void;
    /** Направление открытия выпадающего списка. */
    orientation?: ESelectOrientation;
    /** Позиция внутри компонента InputGroup. */
    groupPosition?: EInputGroupPosition;
}

const mapInputGroupPositionToCSSClass = {
    [EInputGroupPosition.LEFT]: 'cssClass[left]',
    [EInputGroupPosition.INTERMEDIATE]: 'cssClass[intermediate]',
    [EInputGroupPosition.RIGHT]: 'cssClass[right]',
};

/**
 * Компонент Select.
 * В качестве value и options принимает объекты типа ISelectOption.
 * Если требуется кастомизация options или другой формат value - создайте CustomSelect на основе SelectExtended.
 */
export const Select: React.FC<ISelectProps> = ({
    children,
    className,
    value,
    options,
    onChange,
    placeholder,
    orientation = ESelectOrientation.BOTTOM,
    loading,
    groupPosition,
    error,
    disabled,
    'data-test-id': dataTestId,
    ...rest
}) => {
    const renderTarget = (props: ISelectExtendedTargetProvideProps) => (
        <SelectExtended.Target
            className={classnames('cssClass[selectTarget]', groupPosition ? mapInputGroupPositionToCSSClass[groupPosition] : undefined)}
            label={value?.label}
            placeholder={placeholder}
            loading={loading}
            error={error}
            disabled={disabled}
            data-test-id={dataTestId && `${dataTestId}${TestIds.Select.target}`}
            {...props}
        />
    );

    return (
        <SelectExtended
            className={classnames('cssClass[select]', {'cssClass[grouped]': !!groupPosition}, className)}
            renderTarget={renderTarget}
            {...rest}
        >
            {({className: dropdownClassName, ...dropdownProps}: ISelectExtendedDropdownProvideProps) =>
                dropdownProps.opened && !loading ? (
                    <SelectExtended.Dropdown
                        className={classnames(dropdownClassName, 'cssClass[selectDropdown]', {
                            'cssClass[topOrientation]': orientation === ESelectOrientation.TOP,
                        })}
                        data-test-id={dataTestId && `${dataTestId}${TestIds.Select.dropdown}`}
                        opened={dropdownProps.opened}
                    >
                        <SelectExtended.Dropdown.List className="cssClass[selectDropdownList]" dropdownOpened={dropdownProps.opened}>
                            {options.map((option) => {
                                const {label, ...restOption} = option;

                                return (
                                    <SelectExtended.Dropdown.List.Item
                                        {...restOption}
                                        className="cssClass[selectDropdownListItem]"
                                        id={option.value}
                                        key={option.value}
                                        selected={option.value === value?.value}
                                        onSelect={() => {
                                            onChange(option);
                                            dropdownProps.setOpened(false);
                                        }}
                                        data-test-id={dataTestId && `${dataTestId}${TestIds.Select.dropdown}${TestIds.Dropdown.listItem}`}
                                    >
                                        {label}
                                    </SelectExtended.Dropdown.List.Item>
                                );
                            })}
                        </SelectExtended.Dropdown.List>
                    </SelectExtended.Dropdown>
                ) : null
            }
        </SelectExtended>
    );
};
