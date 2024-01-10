import React, { useRef, useEffect, useState, useCallback, useMemo, useLayoutEffect } from 'react';

function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);else for(t in e)e[t]&&(n&&(n+=" "),n+=t);return n}function clsx(){for(var e,t,f=0,n="";f<arguments.length;)(e=arguments[f++])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

var defaultEvents = ['mousedown', 'touchstart'];
function useClickAway(ref, onClickAway, events) {
    if (events === void 0) { events = defaultEvents; }
    var savedCallback = useRef(onClickAway);
    useEffect(function () {
        savedCallback.current = onClickAway;
    }, [onClickAway]);
    useEffect(function () {
        function handler(event) {
            var el = ref.current;
            if (el && !el.contains(event.target)) {
                savedCallback.current(event);
            }
        }
        events.forEach(function (eventName) {
            document.addEventListener(eventName, handler);
        });
        return function () {
            events.forEach(function (eventName) {
                document.removeEventListener(eventName, handler);
            });
        };
    }, [events, ref]);
}

function getMenuPositionClassName(element) {
    var rect = element.getBoundingClientRect();
    var isBottomOverflow = rect.bottom > window.innerHeight && rect.top > rect.height;
    var isLeftOverflow = rect.left < 0;
    var isRightOverflow = rect.right > window.innerWidth;
    var isTopOverflow = rect.top < 0;
    var className = clsx({
        'rnd__menu--top': isBottomOverflow,
        'rnd__menu--bottom': isTopOverflow,
        'rnd__menu--right': isLeftOverflow,
        'rnd__menu--left': isRightOverflow,
    });
    return className;
}

var Dropdown = function (_a) {
    var items = _a.items, _b = _a.containerWidth, containerWidth = _b === void 0 ? 300 : _b, onSelect = _a.onSelect; _a.onHover; var children = _a.children, className = _a.className, renderOption = _a.renderOption, _c = _a.closeOnScroll, closeOnScroll = _c === void 0 ? true : _c;
    var containerRef = useRef(null);
    var rootMenuRef = useRef(null);
    var _d = useState(''), menuPositionClassName = _d[0], setMenuPositionClassName = _d[1];
    var _e = useState(false), dropdownIsOpen = _e[0], setDropdownOpen = _e[1];
    var _f = useState(false), dropdownMainClose = _f[0], setDropdownMainClose = _f[1];
    var _g = useState(false), dropdownChildClose = _g[0], setDropdownChildClose = _g[1];
    var handleMouseOver = function () {
    };
    var handleMouseOutMain = function () {
        var _a, _b;
        setDropdownMainClose(function (state) { return true; });
        if (!((_b = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('ul')) === null || _b === void 0 ? void 0 : _b.classList.contains('hovered'))) {
            setDropdownChildClose(function (state) { return true; });
        }
    };
    var handleMouseOutChild = function () {
        setDropdownChildClose(function (state) { return true; });
    };
    var handleMouseOverChild = function () {
        var _a, _b;
        (_b = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('ul')) === null || _b === void 0 ? void 0 : _b.classList.add('hovered');
    };
    var toggleDropdown = useCallback(function () {
        var _a, _b, _c, _d;
        if (!((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.classList.contains('hovered'))) {
            (_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseover', handleMouseOver);
            (_c = containerRef.current) === null || _c === void 0 ? void 0 : _c.classList.add('hovered');
            (_d = containerRef.current) === null || _d === void 0 ? void 0 : _d.addEventListener('mouseleave', handleMouseOutMain);
            setTimeout(function () {
                var _a, _b, _c, _d;
                (_b = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('ul')) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseover', handleMouseOverChild);
                (_d = (_c = containerRef.current) === null || _c === void 0 ? void 0 : _c.querySelector('ul')) === null || _d === void 0 ? void 0 : _d.addEventListener('mouseleave', handleMouseOutChild);
            }, 200);
        }
        setDropdownOpen(function (state) { return true; });
    }, []);
    var closeDropdown = useCallback(function () {
        var _a, _b;
        (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.classList.remove('hovered');
        (_b = rootMenuRef.current) === null || _b === void 0 ? void 0 : _b.classList.remove('hovered');
        setDropdownOpen(false);
        setDropdownMainClose(false);
        setDropdownChildClose(false);
    }, []);
    var childrenProps = useMemo(function () {
        return {
            isOpen: dropdownIsOpen,
            onClick: toggleDropdown,
            onHover: toggleDropdown
        };
    }, [dropdownIsOpen, toggleDropdown]);
    var handleSelect = React.useCallback(function (item) {
        if (item.disabled) {
            return;
        }
        if (item.onSelect) {
            item.onSelect();
        }
        else if (item.value !== undefined && onSelect) {
            onSelect(item.value, item);
        }
        closeDropdown();
    }, [closeDropdown, onSelect]);
    useClickAway(containerRef, closeDropdown);
    var scrollListener = React.useCallback(function (e) {
        var _a;
        var el = e.target;
        if (!((_a = el === null || el === void 0 ? void 0 : el.classList) === null || _a === void 0 ? void 0 : _a.contains('rnd__menu'))) {
            closeDropdown();
        }
    }, [closeDropdown]);
    useEffect(function () {
        if (dropdownIsOpen && closeOnScroll) {
            document.addEventListener('scroll', scrollListener, true);
        }
        return function () {
            document.removeEventListener('scroll', scrollListener, true);
        };
    }, [dropdownIsOpen]);
    useEffect(function () {
        if (dropdownMainClose && dropdownChildClose) {
            closeDropdown();
        }
    }, [dropdownMainClose, dropdownChildClose]);
    useLayoutEffect(function () {
        if (dropdownIsOpen && rootMenuRef.current) {
            setMenuPositionClassName(getMenuPositionClassName(rootMenuRef.current));
        }
        return function () {
            if (dropdownIsOpen) {
                setMenuPositionClassName('');
            }
        };
    }, [dropdownIsOpen]);
    return (React.createElement("div", { className: clsx('rnd', className), ref: containerRef },
        children(childrenProps),
        dropdownIsOpen && (React.createElement("div", { className: 'rnd-overlay' },
            React.createElement("ul", { className: "rnd__root-menu rnd__menu ".concat(menuPositionClassName), style: { width: containerWidth }, ref: rootMenuRef }, items.map(function (item, index) { return (React.createElement(Option, { key: index, option: item, onSelect: handleSelect, renderOption: renderOption })); }))))));
};
var Option = function (_a) {
    var _b;
    var option = _a.option, onSelect = _a.onSelect, renderOption = _a.renderOption;
    var items = option.items;
    var hasSubmenu = !!items;
    var itemsContainerWidth = (_b = option.itemsContainerWidth) !== null && _b !== void 0 ? _b : 150;
    var _c = useState(''), menuPositionClassName = _c[0], setMenuPositionClassName = _c[1];
    var _d = useState(false), submenuIsOpen = _d[0], setSubmenuOpen = _d[1];
    var handleClick = React.useCallback(function (e) {
        e.stopPropagation();
        onSelect(option);
    }, [hasSubmenu, onSelect, option]);
    var submenuRef = useRef(null);
    useEffect(function () {
        var submenuElement = submenuRef.current;
        var observer = new ResizeObserver(function (entries) {
            entries.forEach(function (entry) {
                var isHTMLElement = entry.target instanceof HTMLElement;
                if (isHTMLElement) {
                    setSubmenuOpen(entry.target.offsetWidth > 0);
                    setMenuPositionClassName(getMenuPositionClassName(entry.target));
                }
            });
        });
        if (submenuElement) {
            observer.observe(submenuElement);
        }
        return function () {
            if (submenuElement) {
                observer.unobserve(submenuElement);
            }
        };
    }, []);
    var iconAfter = hasSubmenu ? chevronNode : option.iconAfter;
    return (React.createElement("li", { className: clsx('rnd__option', option.className, {
            'rnd__option--disabled': option.disabled,
            'rnd__option--with-menu': hasSubmenu,
        }), onMouseDown: handleClick, onKeyUp: handleClick },
        hasSubmenu && (React.createElement("ul", { className: clsx("rnd__menu rnd__submenu ".concat(menuPositionClassName), {
                'rnd__submenu--opened': submenuIsOpen,
            }), ref: submenuRef, style: { width: itemsContainerWidth } },
            React.createElement("div", { className: 'rnd-overlay-submenu' }, items.map(function (item, index) { return (React.createElement(Option, { key: index, option: item, onSelect: onSelect, renderOption: renderOption })); })))),
        renderOption && renderOption(option),
        !renderOption && (React.createElement(React.Fragment, null,
            option.iconBefore && (React.createElement("div", { className: "rnd__option-icon rnd__option-icon--left" }, option.iconBefore)),
            React.createElement("p", { className: "rnd__option-label" }, option.label),
            iconAfter && React.createElement("div", { className: "rnd__option-icon rnd__option-icon--right" }, iconAfter)))));
};
var chevronNode = (React.createElement("div", { style: {
        border: '5px solid currentColor',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        width: 0,
        height: 0,
    } }));

export { Dropdown };
//# sourceMappingURL=index.esm.js.map
