import { IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';

export enum ModalMode {
    None, Apply, Form, Appendix, Record, Document
}

export const DayPickerStrings: IDatePickerStrings = {
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],

    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
};

export const WorkflowStatus = {
    "": "所有",
    "In progress": "进行中",
    Returned: "已退回",
    Rejected: "已拒绝",
    Completed: "已完成",
    Draft:"草稿"
}


export const ApplicationType = {
    NewApplication: "新建申请",
    RevisionApplication: "修订申请",
    InvalidApplication: "作废申请",
    ReviewApplication: "复审申请",
    PermissionApplication: "权限申请"
}

export const TabItems = [
    {
        ID: "NewApplication",
        Name: "新建记录"
    },
    {
        ID: "RevisionApplication",
        Name: "修订记录"
    },
    {
        ID: "ReviewApplication",
        Name: "复审记录"
    },
    {
        ID: "InvalidApplication",
        Name: "作废记录"
    },
];

// export const DocumentTab = [
//     {
//         ID: "Form",
//         Name: "相关表单"
//     },
//     {
//         ID: "Enclosure",
//         Name: "相关附录"
//     },
// ];

export const DocumentTab = [
    {
        ID: "form",
        Name: "相关表单"
    },
    {
        ID: "attachment",
        Name: "相关附录"
    },
];
export const WDocumentTab = [
    {
        ID: "form",
        Name: "相关表单"
    },
    {
        ID: "attachment",
        Name: "相关附录"
    },
];