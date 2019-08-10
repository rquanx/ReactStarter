const PathType = {
    string: "string",
    regexp: "regexp"
}

/**
 * 
 * @param {string | RegExp} path  请求关键字符串或正则对象
 * @param {string} type get/post,为空则同时对所有符合规则的链接拦截
 * @param {({type: string,body: any,url: string}) => any | {}} template 模板对象或返回自定义数据的函数（函数返回模板不会解析）
 * @param {{path: string}} option path:路径类型设置,默认为regexp会强制转化为regex,默认正则`${path}.*`
 */
export function mock(path, type, template,option = {
    path: PathType.regexp,
}) {
    path = option.path === PathType.regexp && path === "string" ? RegExp(`${path}.*`) : path;
    return {
        path,
        type,
        template
    }
}

export default mock;