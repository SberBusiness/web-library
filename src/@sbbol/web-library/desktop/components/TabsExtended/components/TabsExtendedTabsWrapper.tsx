import React, {useContext, useState, useRef, useLayoutEffect} from 'react';
import ReactResizeDetector from 'react-resize-detector/build/withPolyfill';
import {classnames} from '@sbbol/web-library/common/utils/classnames/classnames';
import {TabsExtendedContext} from '../TabsExtendedContext';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';

/**
 * Контейнер табов.
 * Рендерит инлайн табы и определяет табы, которые должны быть отрендерены в Dropdown.
 */
export const TabsExtendedTabsWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children, className, ...htmlDivAttributes}) => {
    const {setDropdownItemsIds, dropdownRef} = useContext(TabsExtendedContext);
    const [dropdownWidth, setDropdownWidth] = useState(0);
    const tabsFakeRef = useRef<HTMLDivElement>(null);
    const childrenCount = useRef(React.Children.count(children));

    const checkVisibleItems = () => {
        if (tabsFakeRef.current) {
            const {children} = tabsFakeRef.current;
            let {right: containerRight} = tabsFakeRef.current.getBoundingClientRect();
            const dropdownIds: string[] = [];
            let overflow = false;

            // Padding-right контейнера равен 2px и отступ между кнопками 2px. Правая граница таба не должна выходить за (граница контейнера - 4px).
            containerRight = containerRight - 4;

            Array.from(children).forEach((tab) => {
                const {right} = tab.getBoundingClientRect();

                if (containerRight - dropdownWidth < right) {
                    dropdownIds.push(tab.getAttribute('data-tab-item-id')!);
                    if (!overflow && containerRight < right) {
                        overflow = true;
                    }
                }
            });

            if (overflow) {
                setDropdownItemsIds(dropdownIds);
            } else {
                setDropdownItemsIds([]);
            }
        }
    };

    const setNewDropdownWidth = () => {
        if (dropdownRef.current) {
            const {width} = dropdownRef.current.getBoundingClientRect();

            if (width !== dropdownWidth) {
                setDropdownWidth(width);
            }
        }
    };

    const setNewChildrenCount = () => {
        const count = React.Children.count(children);

        if (childrenCount.current !== count) {
            childrenCount.current = count;
            checkVisibleItems();
        }
    };

    useLayoutEffect(() => {
        setNewDropdownWidth();
        setNewChildrenCount();
    });

    useLayoutEffect(checkVisibleItems, [dropdownWidth]);

    /** Возвращает children без `data-` атрибутов */
    const stripDataAttributes = (toProcess: React.ReactNode): React.ReactNode => {
        return React.Children.map(toProcess, (child) => {
            // Если не может иметь `data-` атрибутов, вернуть как есть
            if (typeof child !== 'object' || isEmpty(child)) {
                return child;
            }
            // Если массив нод, прогнать на каждой из них
            if (Array.isArray(child)) {
                return stripDataAttributes(child);
            }
            // Убрать типы, отброшенные проверкой isEmpty
            const castedChild = child as Exclude<typeof child, Record<string, unknown> | null>;
            // Оставить только пропы, не начинающиеся с `data-`
            const filteredProps = pickBy(castedChild.props, (_val, key) => !key.startsWith('data-'));
            return React.createElement(castedChild.type, filteredProps);
        });
    };

    return (
        <>
            <div className={classnames('cssClass[tabsReal]', {'cssClass[hidden]': !tabsFakeRef.current}, className)} {...htmlDivAttributes}>
                {children}
            </div>
            {/* Скрытый контейнер с дубликатом табов, для вычисления табов, передаваемых в Dropdown. */}
            <div className="cssClass[tabsFake]" ref={tabsFakeRef}>
                {dropdownRef.current && (
                    <ReactResizeDetector handleWidth onResize={checkVisibleItems} refreshMode="throttle" refreshRate={150} />
                )}
                {stripDataAttributes(children)}
            </div>
        </>
    );
};
