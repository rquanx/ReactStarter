class XmlBuilder {
    /**
     * Xml操作对象
     * @param {string} tagName
     * @param {Object} property
     * @param {any} children
     */
    constructor(tagName, property, children) {
        this.tagName = tagName;
        this.property = property;
        this.children = children;
    }

    /**
     * 创建字符串
     */
    CreateElement() {
        return XmlBuilder.CreateElement(this.tagName, this.property, this.children);
    }
}


/**
 * 创建xml标签
 * @param {string} tagName  标签名
 * @param {string | {Object} property  标签属性 "" / {} /false 都是代表为空
 * @param {any} children     子内容
 */
XmlBuilder.CreateElement = function (tagName, property, children) {
    let result = "";
    let propertyStr = XmlBuilder.RenderProps(property);
    if (children || children === 0) {
        let childrenStr = XmlBuilder.RenderChildren(children);
        result = XmlBuilder.Tag(tagName, propertyStr, childrenStr);
    } else {
        result = XmlBuilder.AutoCloseTag(tagName, propertyStr);
    }
    return result;
};

/**
 * 拼接属性字符串
 * @param {string | {Object} property
 */
XmlBuilder.RenderProps = function (property) {
    let propertyStr = "";
    if (property) {
        if (typeof (property) === "string") {
            propertyStr = property;
        } else {
            Object.keys(property).forEach(key => {
                propertyStr += XmlBuilder.Value(key, property[key]);
            });
        }
    }
    return propertyStr;
};

/**
 * 递归拼接子元素
 * @param {any} children
 */
XmlBuilder.RenderChildren = function (children) {
    let childrenStr = "";
    if (Array.isArray(children)) {
        children.forEach((item) => {
            if (Array.isArray(item)) {
                childrenStr += XmlBuilder.RenderChildren(item);
            } else if (typeof (item) === "object") {
                childrenStr += XmlBuilder.CreateElement(item.tagName, item.property, item.children);
            } else if (typeof (item) === "string") {
                childrenStr += item;
            }
        });
    } else if (typeof (children) === "object") {
        childrenStr = children.CreateElement();
    } else {
        childrenStr = children;
    }
    return childrenStr;
};

/**
 * 自闭标签
 * @param {string} tagName 
 * @param {string} propertyStr
 */
XmlBuilder.AutoCloseTag = function (tagName, propertyStr) {
    if (tagName) {
        return `<${tagName}${propertyStr}/>`;
    } else {
        return "";
    }
};

/**
 * 普通标签
 * @param {string} tagName 
 * @param {string} propertyStr 
 * @param {string} childrenStr 
 */
XmlBuilder.Tag = function (tagName, propertyStr, childrenStr) {
    if (tagName) {
        return `<${tagName}${propertyStr}>${childrenStr}</${tagName}>`;
    } else {
        return childrenStr;
    }
};

/**
 * 标签属性
 * @param {string} key 
 * @param {string} value 
 */
XmlBuilder.Value = function (key, value) {
    return ` ${key}='${value}' `;
};

let CamlEnum = {};

/** 逻辑选项 */
CamlEnum.LogicType = {
    And: "And",
    Or: "Or"
};

/** 关系选项 */
CamlEnum.RelationType = {
    In: "In",
    Eq: "Eq",
    Gt: "Gt",
    Lt: "Lt",
    Geq: "Geq",
    Leq: "Leq",
    Neq: "Neq",
    Contains: "Contains",
    BeginsWith: "BeginsWith",
    IsNull: "IsNull",
    IsNotNull: "IsNotNull",
    DateRangesOverlap: "DateRangesOverlap",

    Includes: "Includes",
    NotIncludes: "NotIncludes",
    /**
     * 查阅项数组使用？ 
     *  <Includes>
            <FieldRef    Name = "Field_Name"/>
            <Value    Type = "Field_Type"/>
            <XML />
        </Includes> 
    */

    Membership: "Membership"
};

/** 数据类型选项 */
CamlEnum.ValueType = {
    Text: "Text",
    Number: "Number",
    DateTime: "DateTime", // yyyy-MM-ddTHH:mm:ss
    Date: "Date",
    LookupId: "LookupId",
    LookupValue: "LookupValue",
    Boolean: "Boolean",
    Integer: "Integer",
    Url: "Url", // 检查
    FSObjType: "FSObjType", //文件夹
    Boolean: "Boolean"
};

/** 标签选项 */
CamlEnum.TagType = {
    Aggregations: "Aggregations",
    Field: "Field",
    FieldRef: "FieldRef",
    Join: "Join",
    Joins: "Joins",
    Values: "Values",
    Value: "Value",
    And: "And",
    Or: "Or",
    OrderBy: "OrderBy",
    ViewFields: "ViewFields",
    RowLimit: "RowLimit",
    View: "View",
    Query: "Query",
    Where: "Where",
    GroupBy: "GroupBy",
    ProjectedFields: "ProjectedFields",
    Eq: "Eq",
    Lt: "Lt",
    Gt: "Gt",
    Geq: "Geq",
    Leq: "Leq",
    In: "In",
    Neq: "Neq",
    Contains: "Contains",
    BeginsWith: "BeginsWith",
    IsNull: "IsNull",
    IsNotNull: "IsNotNull",
    DateRangesOverlap: "DateRangesOverlap",
};

/** 处理函数选项 */
CamlEnum.AggregationsType = {
    Count: "COUNT", // 计数
    Average: "AVG", // 取平均值
    Maximum: "MAX", // 取最大值
    Minimum: "MIN", // 最小值
    Sum: "SUM", // 总计
    StdDeviation: "STDEV", // 开方?
    Variance: "VAR"
};

/** 范围选项 */
CamlEnum.ScopeType = {
    FilesOnly: "FilesOnly",
    Recursive: "Recursive",
    RecursiveAll: "RecursiveAll"
};

class CamlInfo {
    /** @constructor 
     * caml数据存储对象
     * @param {CamllInfo} camllInfo
     */
    constructor(camlInfo = undefined) {
        if (camlInfo) {
            this.Condition = camlInfo.Condition;
            this.Count = camlInfo.Count;
            this.Orderby = camlInfo.Orderby;
            this.RowLimit = camlInfo.RowLimit;
            this.ViewFields = camlInfo.ViewFields;
            this.GroupBy = camlInfo.GroupBy;
            this.ProjectedFields = camlInfo.ProjectedFields;
            this.Joins = camlInfo.Joins;
            this.Aggregations = camlInfo.Aggregations;
            this.FolderStr = camlInfo.FolderStr;
            this.View = camlInfo.View;
        } else {
            this.Condition = "";
            this.Count = 0;
            this.Orderby = "";
            this.RowLimit = "";
            this.ViewFields = "";
            this.GroupBy = "";
            this.ProjectedFields = "";
            this.Joins = "";
            this.Aggregations = "";
            this.FolderStr = "";
            this.View = new XmlBuilder(CamlEnum.TagType.View, "", "");
        }
    }

    /**增加嵌套层数 */
    AddCount(count = 0) {
        if (count > 0) {
            this.Count += count;
        } else {
            this.Count++;
        }

        if (this.Count > CamlInfo.Options.MaxNested) {
            throw Error(CamlInfo.ErrorType.NestedLimit);
        }
    }
}

/** 限制选项 */
CamlInfo.Options = {
    MaxIn: 500,
    MaxNested: 160
};

/**错误类型和信息 */
CamlInfo.ErrorType = {
    NestedLimit: `Error, Number of nesting layers is over ${CamlInfo.Options.MaxNested}`
};

function getCamlDateTime(date) {
  if (date) {
    return `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  } else {
    return "";
  }
}

/** @constructor */
let CamlBuilder = function () {
    this.CamlInfo = new CamlInfo();
};

/**
 * 返回一个内容完全相同的全新caml对象
 * @param {CamlBuilder} caml 
 */
CamlBuilder.Copy = function (caml) {
    let newCaml = new CamlBuilder();
    newCaml.CamlInfo = new CamlInfo(caml.CamlInfo);
    return newCaml;
};


/**
 * 创建纯表达式的caml，用于合并
 */
CamlBuilder.Express = function () {
    return new CamlBuilder();
};

/** 
 * 根据值的关系进行值标签生成的选择
 * @param {string} relation
 * @param {string} valueType
 * @param {string} value
 */
CamlBuilder.Value = function (relation, valueType, value) {
    let values = "";
    switch (relation) {
        case CamlEnum.RelationType.In:
            {
                let valueLength = value.length;
                values = [];
                for (let i = 0; i < valueLength; i++) {
                    values.push(CamlBuilder.CaseValueType(valueType, value[i]));
                }
                values = new XmlBuilder(CamlEnum.TagType.Values, {}, values);
                break;
            }
        case CamlEnum.RelationType.IsNotNull:
            {
                values = "";
                break;
            }

        case CamlEnum.RelationType.IsNull:
            {
                values = "";
                break;
            }

        default:
            values = CamlBuilder.CaseValueType(valueType, value);
            break;
    }
    return values;
};

/** 
 * 根据值类型返回值标签的字符串
 * @param {string} valueType
 * @param {string} value
 */
CamlBuilder.CaseValueType = function (valueType, value) {
    let property = {
        Type: valueType
    };
    switch (valueType) {
        case CamlEnum.ValueType.DateTime:
            {
                property.IncludeTimeValue = "TRUE";
                if (typeof value === "object") {
                    value = getCamlDateTime(value);
                }
                break;
            }
        case CamlEnum.ValueType.Date:
            {
                property.Type = CamlEnum.ValueType.DateTime;
                if (typeof value === "object") {
                    value = getCamlDateTime(value);
                }
                break;
            }
        case CamlEnum.ValueType.Boolean:
            {
                value = (Number(value) ? 1 : 0);
                break;
            }
        case CamlEnum.ValueType.LookupId:
            {
                property.Type = CamlEnum.ValueType.Integer;
                if (typeof value === "object") {
                    if (value.id) {
                        value = value.id;
                    } else if (value.get_lookupId) {
                        value = value.get_lookupId();
                    }
                }
                break;
            }
        case CamlEnum.ValueType.LookupValue:
            {
                property.Type = CamlEnum.ValueType.Text;
                if (typeof value === "object") {
                    if (value.value) {
                        value = value.value;
                    } else if (value.get_lookupId) {
                        value = value.get_lookupValue();
                    }
                }
                break;
            }
        default:
            {
                break;
            }
    }

    let valueStr = new XmlBuilder(CamlEnum.TagType.Value, property, value);
    return valueStr;
};

/**
 * 将全部的camlList用logic合并起来,两两进行递归合并
 * @param {string} logic
 * @param {CamlBuilder[]} camlList
 */
CamlBuilder.MergeList = function (logic, camlList) {
    let result;
    let newCamlList = [];
    for (let i = 0; i < camlList.length - 1; i += 2) {
        newCamlList.push(CamlBuilder.Merge(logic, camlList[i], camlList[i + 1]));
    }
    if (camlList.length % 2 !== 0) {
        newCamlList.push(camlList[camlList.length - 1]);
    }

    if (newCamlList.length > 1) {
        result = CamlBuilder.MergeList(logic, newCamlList);
    } else {
        result = newCamlList.length > 0 ? newCamlList[0] : new CamlBuilder();
    }
    return result;
};

/**
 * 将两个caml合并
 * <logic> c1 + c2 </logic>
 * @param {string} logic 
 * @param {CamlBuilder} camlFirst
 * @param {CamlBuilder} camlSecond
 */
CamlBuilder.Merge = function (logic, camlFirst, camlSecond) {
    let caml = new CamlBuilder();
    let camlInfo = caml.CamlInfo;
    let firstCamlInfo = camlFirst.CamlInfo;
    let secondCamlInfo = camlSecond.CamlInfo;

    if (firstCamlInfo.Condition && secondCamlInfo.Condition) {
        camlInfo.Condition = new XmlBuilder(logic, {}, [firstCamlInfo.Condition, secondCamlInfo.Condition]);
        camlInfo.AddCount((firstCamlInfo.Count > secondCamlInfo.Count ? firstCamlInfo.Count : secondCamlInfo.Count) + 1);
    } else if (firstCamlInfo.Condition || secondCamlInfo.Condition) {
        camlInfo.Condition = new XmlBuilder("", {}, [firstCamlInfo.Condition, secondCamlInfo.Condition]);
        camlInfo.AddCount(firstCamlInfo.Count + secondCamlInfo.Count + 1);
    }
    return caml;
};

/**
 * 最外层增加一个And条件
 * <And><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </And>
 * 传入数组会使用<In></In>处理 
 * @param {string} relation   Eq,Neq,Leq,Geq,Contains,In....
 * @param {string} fieldName 字段内部名称
 * @param {string} valueType Text,LookupId,LookupValue,DateTime,Date
 * @param {string | number | string[] | number[]} value 可以是数组或字符串
 */
CamlBuilder.prototype.And = function (relation, fieldName, valueType, value) {
    let camlList = [];
    let property = {
        Name: fieldName
    };

    if (valueType === CamlEnum.ValueType.LookupId) {
        property.LookupId = "True";
    }

    let fieldRef = new XmlBuilder(CamlEnum.TagType.FieldRef, property, "");

    if (relation === CamlEnum.RelationType.In) {
        for (let i = 0; i < value.length; i += CamlInfo.Options.MaxIn) {
            let temCaml = new CamlBuilder();
            let valueList = value.slice(i, i + CamlInfo.Options.MaxIn);
            temCaml.Merge(CamlEnum.LogicType.Or, new XmlBuilder(relation, {}, [fieldRef, CamlBuilder.Value(relation, valueType, valueList)]));
            camlList.push(temCaml);
        }
        this.Merge(CamlEnum.LogicType.And, CamlBuilder.MergeList(CamlEnum.LogicType.Or, camlList));
    } else {
        this.CamlInfo.Condition = new XmlBuilder("", {}, [this.CamlInfo.Condition, new XmlBuilder(relation, {}, [fieldRef, CamlBuilder.Value(relation, valueType, value)])]);
        if (this.CamlInfo.Count >= 1) {
            this.CamlInfo.Condition = new XmlBuilder(CamlEnum.TagType.And, {}, this.CamlInfo.Condition);
        }
    }
    this.CamlInfo.AddCount();
    return this;
};

/**
 * 最外层增加一个Or条件
 * <Or><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </Or>
 * 传入数组会使用<In></In>处理 
 * @param {string} relation   Eq,Neq,Leq,Geq,Contains,In....
 * @param {string} fieldName 字段内部名称
 * @param {string} valueType Text,LookupId,LookupValue,DateTime,Date
 * @param {string | number | string[] | number[]} value 可以是数组或字符串
 */
CamlBuilder.prototype.Or = function (relation, fieldName, valueType, value) {
    let camlList = [];
    let property = {
        Name: fieldName
    };

    if (valueType === CamlEnum.ValueType.LookupId) {
        property.LookupId = "True";
    }
    let fieldRef = new XmlBuilder(CamlEnum.TagType.FieldRef, property, "");
    if (relation === CamlEnum.RelationType.In) {
        for (let i = 0; i < value.length; i += CamlInfo.Options.MaxIn) {
            let temCaml = new CamlBuilder();
            let valueList = value.slice(i, i + CamlInfo.Options.MaxIn);
            temCaml.Merge(CamlEnum.LogicType.Or, new XmlBuilder(relation, {}, [fieldRef, CamlBuilder.Value(relation, valueType, valueList)]));
            camlList.push(temCaml);
        }
        this.Merge(CamlEnum.LogicType.Or, CamlBuilder.MergeList(CamlEnum.LogicType.Or, camlList));
    } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            let temCaml = new CamlBuilder();
            camlList.push(temCaml.Or(relation, fieldName, valueType, value[i]));
        }
        this.Merge(CamlEnum.LogicType.Or, CamlBuilder.MergeList(CamlEnum.LogicType.Or, camlList));
    } else {
        this.CamlInfo.Condition = new XmlBuilder("", {}, [this.CamlInfo.Condition, new XmlBuilder(relation, {}, [fieldRef, CamlBuilder.Value(relation, valueType, value)])]);
        if (this.CamlInfo.Count >= 1) {
            this.CamlInfo.Condition = new XmlBuilder(CamlEnum.TagType.Or, {}, this.CamlInfo.Condition);
        }
    }
    this.CamlInfo.AddCount();
    return this;
};

/**
 * 设置排序,不设置按默认排序,
 * @param { [{field: string, ascend: boolean}] } orderByList
 */
CamlBuilder.prototype.OrderBy = function (orderByList) {
    // false 从小到大倒序
    let ascend;
    let orderByArray = [];
    this.CamlInfo.Orderby = "";
    orderByList.forEach((item) => {
        if (item.ascend) {
            ascend = "True";
        } else {
            ascend = "False";
        }
        orderByArray.push(new XmlBuilder(CamlEnum.TagType.FieldRef, {
            Name: item.field,
            Ascending: ascend
        }, ""));
    });
    this.CamlInfo.Orderby = new XmlBuilder(CamlEnum.TagType.OrderBy, {}, orderByArray);
    return this;
};

/**
 * 设置搜索范围,默认值设置为RecursiveAll，不调用此函数为默认搜索最顶层
 * @param {string} scope 
 */
CamlBuilder.prototype.Scope = function (scope = CamlEnum.ScopeType.RecursiveAll) {
    this.CamlInfo.View.property = {
        Scope: scope
    };
    return this;
};

/**
 * 设置搜索条数,不调用此函数默认搜索100条,搜索全部设置为0，参数默认为0
 * @param {number | string} rowLimit 
 */
CamlBuilder.prototype.RowLimit = function (rowLimit = 0) {
    this.CamlInfo.RowLimit = new XmlBuilder(CamlEnum.TagType.RowLimit, {}, rowLimit);
    return this;
};

/**
 * 结束caml拼接，追加Query、Where、View...
 */
CamlBuilder.prototype.End = function () {
    if (this.CamlInfo.Joins) {
        this.CamlInfo.Joins = new XmlBuilder(CamlEnum.TagType.Joins, {}, this.CamlInfo.Joins);
    }
    if (this.CamlInfo.ProjectedFields) {
        this.CamlInfo.ProjectedFields = new XmlBuilder(CamlEnum.TagType.ProjectedFields, {}, this.CamlInfo.ProjectedFields);
    }
    let where = new XmlBuilder(CamlEnum.TagType.Where, {}, this.CamlInfo.Condition);
    let queryChildren = [where, this.CamlInfo.GroupBy, this.CamlInfo.Orderby];
    let query = new XmlBuilder(CamlEnum.TagType.Query, {}, queryChildren);

    this.CamlInfo.View.children = [this.CamlInfo.ViewFields,
        this.CamlInfo.Aggregations,
        query,
        this.CamlInfo.Joins,
        this.CamlInfo.ProjectedFields,
        this.CamlInfo.RowLimit,
    ];

    this.CamlInfo.Condition = this.CamlInfo.View;
    return this;
};


/**
 * 输出caml字符串
 * @return {string} caml字符串
 */
CamlBuilder.prototype.ToString = function () {
    if (this.CamlInfo.Condition.CreateElement) {
        return this.CamlInfo.Condition.CreateElement();
    } else {
        return XmlBuilder.RenderChildren(this.CamlInfo.Condition);
    }
};

/**
 * 清空条件设置
 */
CamlBuilder.prototype.Clear = function () {
    this.CamlInfo = new CamlInfo();
    return this;
};

/**
 * 合并两个caml对象 "<logic> Condition + camlStr</logic>"
 * @param {string} logic And/Or 
 * @param {string | CamlBuilder | XmlBuilder} caml caml对象或string没有end的
 */
CamlBuilder.prototype.Merge = function (logic, caml) {
    let camlStr = "";
    let count = 0;
    if (typeof (caml) === "string") {
        camlStr = caml;
    } else if (caml.CamlInfo) {
        camlStr = caml.CamlInfo.Condition;
        count = caml.CamlInfo.Count;
    } else {
        camlStr = caml;
    }
    if (camlStr) {
        this.CamlInfo.AddCount(count);
        if (this.CamlInfo.Condition) {
            this.CamlInfo.Condition = new XmlBuilder(logic, {}, [this.CamlInfo.Condition, camlStr]);
        } else {
            this.CamlInfo.Condition = new XmlBuilder("", {}, [camlStr]);
        }
    }

    return this;
};

/**
 * 需要使用 RenderListData api
 * 合并两个caml对象 "<logic> Condition + camlStr</logic>"
 * @param {boolean} collapse   是否聚合,聚合时按分组返回部分相关数据，不聚合时按item项返回全部字段数据，配合ViewFields可以限制返回的字段,
 * @param {number} groupLimit 返回的视图Row数量
 * @param {string} fieldName     分组字段
 */
CamlBuilder.prototype.GroupBy = function (collapse, groupLimit, fieldName) {
    let fieldRef = new XmlBuilder(CamlEnum.TagType.FieldRef, {
        Name: fieldName
    });

    this.CamlInfo.GroupBy = new XmlBuilder(CamlEnum.TagType.GroupBy, {
        Collapse: collapse.toString(),
        GroupLimit: groupLimit
    }, fieldRef);
    return this;
};


/**
 * 设置返回的字段
 * @param {string | string[]} fieldNames 
 */
CamlBuilder.prototype.ViewFields = function (fieldNames) {
    let viewFields;
    if (Array.isArray(fieldNames)) {
        viewFields = fieldNames.map(
            (item) => (
                new XmlBuilder(CamlEnum.TagType.FieldRef, {
                    Name: item
                }, "")
            )
        );
    } else {
        viewFields = new XmlBuilder(CamlEnum.TagType.FieldRef, {
            Name: fieldNames
        }, "");
    }

    this.CamlInfo.ViewFields = new XmlBuilder(CamlEnum.TagType.ViewFields, {}, viewFields);
    return this;
};

/**
 * 待完善
 * @param {string} type 
 * @param {string} listAlias 
 * @param {string} field 
 * @param {string} showField 
 * @param {string} fieldName 
 */
CamlBuilder.prototype.Joins = function (type, listAlias, field, showField, fieldName) {
    let fieldList = [new XmlBuilder(CamlEnum.TagType.FieldRef, {
            Name: field,
            RefType: "ID"
        }, ""),
        new XmlBuilder(CamlEnum.TagType.FieldRef, {
            Name: "ID",
            List: listAlias
        }, "")
    ];

    let eq = new XmlBuilder(CamlEnum.TagType.Eq, {}, fieldList);

    if (!this.CamlInfo.Joins) {
        this.CamlInfo.Joins = [];
    }
    this.CamlInfo.Joins.push(new XmlBuilder(CamlEnum.TagType.Join, {
        Type: type,
        ListAlias: listAlias
    }, eq));

    if (this.CamlInfo.ProjectedFields) {
        this.CamlInfo.ProjectedFields = [];
    }
    this.CamlInfo.ProjectedFields.push(ProjectedFields(showField, fieldName, listAlias));

    /**
     * 待完善
     * @param {string} fieldName  
     * @param {string} name 
     * @param {string} listName 
     */
    function ProjectedFields(fieldName, name, listName) {
        // <Field ShowField="titel111" Type="Lookup" Name="test1" List="test1" />
        let projectedFields = new XmlBuilder(CamlEnum.TagType.Field, {
            Name: name,
            ShowField: fieldName,
            Type: "Lookup",
            List: listName
        });

        return projectedFields;
    }
    return this;
};

/**
 * 需要使用 RenderListData api
 * 对字段进行函数计算，返回 field.[type.agg] => 当前分组的函数计算值   field.[type] => 总的值
 * @param {[ { field: string, type: string } ] } aggregationList  field应用的列, type引用的函数
 */
CamlBuilder.prototype.Aggregations = function (aggregationList) {
    let childrenList = aggregationList.map((item) => (
        new XmlBuilder(CamlEnum.TagType.FieldRef, {
                Name: item.field,
                Type: item.type
            },
            "")
    ));

    this.CamlInfo.Aggregations = new XmlBuilder(CamlEnum.TagType.Aggregations, {
        Value: "On"
    }, childrenList);

    return this;
};

/** 
 * 设置路径
 * @param {string} folderPath  文件夹相对路径，
 * 顶层站点 /list/folder
 * 子站点/site/list/folder
 */
CamlBuilder.prototype.SetFolder = function (folderPath) {
    this.CamlInfo.FolderStr = folderPath;
    return this;
};

/** 
 * 读取文件夹路径
 */
CamlBuilder.prototype.GetFolder = function () {
    return this.CamlInfo.FolderStr;
};

var CamlBuilder$1 = CamlBuilder;
var CamlEnum$1 = CamlEnum;

export default CamlBuilder$1;
export { CamlBuilder$1 as CamlBuilder, CamlEnum$1 as CamlEnum };
