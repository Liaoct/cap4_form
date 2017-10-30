/* eslint-disable */
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

function extend(to, _from) {
    for (const key in _from) {
        to[key] = _from[key];
    }
    return to;
}

export function toObject(arr) {
    const res = {};
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            extend(res, arr[i]);
        }
    }
    return res;
}

export const getValueByPath = function (object, prop) {
    prop = prop || '';
    const paths = prop.split('.');
    let current = object;
    let result = null;
    for (let i = 0, j = paths.length; i < j; i++) {
        const path = paths[i];
        if (!current) break;

        if (i === j - 1) {
            result = current[path];
            break;
        }
        current = current[path];
    }
    return result;
};

export const getValByPath = p => o =>
    p.split('.').reduce((xs, x) =>
        (xs && xs[x]) ? xs[x] : null, o)

export function isArray(val) {
    return typeof Array.isArray === 'function' ? Array.isArray(val) : Object.prototype.toString.call(val) === '[Object Array]';
}

export function isFunction(fn) {
    return Object.prototype.toString.call(fn)=== '[object Function]';
}

export function isObject(obj) {
    return obj && Object.prototype.toString.call(obj)=== '[object Object]';
}

export function deepClone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

export const getUrlParam = name => {
    const reg = new RegExp("(^|&|#|/?)" + name + "=([^&]*)(&|$)", "i");
    const r = window.location.href.substr(1).match(reg);
    if (r != null) {
        let result = unescape(r[2]);
        if (result.indexOf('#') > 0) {
            result = result.slice(0, result.indexOf('#'));
        };
        return result;
    }
    return null;
}
