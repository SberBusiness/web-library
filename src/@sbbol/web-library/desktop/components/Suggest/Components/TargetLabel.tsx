import * as React from 'react';
import {ISuggestTargetProps, ISuggestOption} from '../types';

export function TargetLabel<T extends ISuggestOption>({
    renderTargetLabel,
    renderTargetInput,
    tabIndex,
    focused,
    opened,
    disabled,
    optionsLength,
    value,
    placeholder,
    query,
    setRef,
    loading,
    dataTestId,
    ...rest
}: ISuggestTargetProps<T>): JSX.Element {
    return (
        <div tabIndex={disabled ? -1 : tabIndex} {...rest}>
            {value?.label || placeholder}
        </div>
    );
}
