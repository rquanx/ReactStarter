import Cookies from "./cookies";
const key = "sr-language";
export const Type = {
    zh: "zh",
    en: "en",
    jp: "jp"
}

/**
 * 获取语言类型
 */
export function get() {
    let result = Type.zh;
    try {
        result = Cookies.getCookie(key) || localStorage.getItem(key);
        if (!result || !Type[result]) {
            result = Type.zh;
        }
    } catch (e) {
        result = Type.zh;
    }
    return result;
}

export function set(type) {
    try {
        Cookies.setCookie(key, type, 7);
        localStorage.setItem(key, type);
    } catch (e) {

    }
}

export default {
    set,
    get,
    Type
}