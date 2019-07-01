import {
    dateFormat
} from "@services/common/helper";
export class News {
    Title: string;
    Label: string;
    Abstract: string;
    IsPublish: boolean;
    PublishTime: string;
    Author: string;
    Body: string;
    ClassName: string;
    constructor(data) {
        this.Title = data.Title;
        this.Label = data.Label;
        this.Abstract = data.Abstract;
        this.IsPublish = data.IsPublish;
        this.PublishTime = dateFormat(data.PublishTime);
        this.Author = data.Author ? data.Author.get_lookupValue() : '';
        this.Body = data.Body;
        this.ClassName = data.ClassName ? data.ClassName.get_lookupValue() : '';

    };
}
export interface INews {
    Title: string;
    Label: string;
    Abstract: string;
    IsPublish: boolean;
    PublishTime: string;
    Author: string;
    Body: string;
    ClassName: string;
}