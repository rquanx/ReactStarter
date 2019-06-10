import {
    T
} from "@services/translation";

export function GetColumns(columnsKeys, columnsNames, columnsClass) {
    return columnsKeys.map((item, i) => {
        return {
            name: T(columnsNames[i]),
            className: columnsClass[i],
            key: "column" + i
        }
    });
}

export function GetDropDownOptions(enumItem) {
    return Object.keys(enumItem).map((key) => {
        return {
            key: key,
            text: T(enumItem[key])
        }
    })
}

export function GetDocumentTypeOptions(documentTypes) {
    return documentTypes && documentTypes.length > 0 ? documentTypes.map((document) => {
        return {
            key: document.ID,
            text: document.Name
        }
    }) : undefined;
}

export function checkData(data, value = "") {
    let v = value ? value : "";
    return data ? data : v;
}

export function dateFormat(time) {
    return time ? new Date(time).format("yyyy-MM-dd HH:mm:ss") : "";
}

/**
 * @param {[]} data 
 */
export function hasArrayData(data) {
    return data && data.length > 0;
}