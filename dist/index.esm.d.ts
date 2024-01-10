import React from "react";
import { ReactElement, ReactNode } from "react";
interface DropdownItem<TValue = undefined> {
    label: string;
    iconBefore?: ReactNode;
    iconAfter?: ReactNode;
    items?: DropdownItem<TValue>[];
    itemsContainerWidth?: number | string;
    value?: TValue;
    onSelect?: () => void;
    disabled?: boolean;
    className?: string;
}
interface DropdownProps<TValue> {
    items: DropdownItem<TValue>[];
    containerWidth?: number | string;
    onSelect?: (value: TValue, option: DropdownItem<TValue>) => void;
    onHover?: () => void;
    children: (params: {
        onHover: () => void;
        onClick: () => void;
        isOpen: boolean;
    }) => ReactElement;
    className?: string;
    renderOption?: (option: DropdownItem<TValue>) => ReactNode;
    closeOnScroll?: boolean;
}
declare const Dropdown: <TValue>({ items, containerWidth, onSelect, onHover, children, className, renderOption, closeOnScroll }: DropdownProps<TValue>) => React.ReactElement;
export { DropdownItem, DropdownProps, Dropdown };
