import Axios from "axios";
import Config from "@config";
import {
    checkData
} from "@services/common/helper";
export async function GetRequest(path, params = undefined) {
    let errorMessage = "";
    let success = false;
    try {
        let queryResult = await Axios.get(path, {
            params
        });

        if (queryResult.data.StatusCode == 200) {
            return {
                success: true,
                data: queryResult.data.Data
            }
        } else {
            errorMessage = queryResult.data.ErrorMessage
        }
    } catch (e) {
        //errorMessage = e.message + e.stack;
        errorMessage = e.response.data.ErrorMessage;
    }
    return {
        success,
        errorMessage
    }
}

export async function PostRequest(path, params = undefined, header = undefined) {
    // Axios.post(path);

    let errorMessage = "";
    let success = false;
    try {
        let queryResult
        if (header) {
            queryResult = await Axios({ 
                method: 'post', 
                url: path, 
                data: params, 
                headers: { 
                    'Content-Type': header,
                    'X-Requested-With': 'XMLHttpRequest' 
                } 
            });
            //创建文档对象
            var parser=new DOMParser(); 
            var xmlDoc=parser.parseFromString(queryResult.data,"text/xml"); 
            //提取数据 
            var data = JSON.parse(xmlDoc.getElementsByTagName("GetMainLibraryFilesResult")[0].textContent);
            if(data.StatusCode == 200){
                return {
                    success: true,
                    data: data.Data 
                }
            }else {
                errorMessage = data.ErrorMessage
            }

        } else {
            queryResult = await Axios.post(path, params);
            if (queryResult.data.StatusCode == 200) {
                return {
                    success: true,
                    data: queryResult.data.Data
                }
            } else {
                errorMessage = queryResult.data.ErrorMessage
            }
        }
    } catch (e) {
        //errorMessage = e.message + e.stack;
        errorMessage = e.response.data.ErrorMessage;
    }
    return {
        success,
        errorMessage
    }

}

/**
 * 
 * @param {string} fileId 
 * @param {string} applicant 
 */
export async function DownloadFile(fileId, applicant) {
    let queryResult = await GetRequest(`${Config.Api.Base}${Config.Api.FileOperation.Path}${Config.Api.FileOperation.DownLoadFile}`, {
        fileId,
        applicant
    });
    if (queryResult.success) {
        window.open(queryResult.data);
        return queryResult.data;
    } else {
        throw (queryResult.errorMessage);
    }
}

/**
 * @param {{ fileID: string,mainFileType: string, subFileType: string,thirdFileType: string,fileName: string, applicantDepartment: string ,createDate: Date,isFavorite: 0/1}} info
 */
export async function CollectionFile(info = {}, userID) {
    let queryResult = await PostRequest(`${Config.Api.Base}${Config.Api.FileOperation.Path}${Config.Api.FileOperation.FavoriteFile}`, {
        FileId: info.UniqueId,
        UserId: userID,
        FileType: checkData(info.FileType),
        FileName: info.FileName,
        ApplicantDepartment: checkData(info.ApplicantDepartment),
        IsFavorite: !info.IsFavorite,
        EffectiveDate: info.EffectiveDate
    });
    if (queryResult.success) {
        return queryResult.data;
    } else {
        throw (queryResult.errorMessage);
    }
}