import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material';
import { StringifyOptions } from 'querystring';
import { Observable } from 'rxjs/Observable';
import { PaginationModel } from '../models/pagination.model';
import { WorkItemCommentModel } from '../models/work-item-comment.model';
import { WorkItemFilterModel } from '../models/work-item-filter-model';
import { WorkItemMetaDataModel } from '../models/work-item-metadata.model';
import { WorkItemModel } from '../models/work-item.model';
import { Constants } from '../shared/constants';

@Injectable({
    providedIn: 'root'
})
export class TaskManagementService {

    constructor(private httpClient: HttpClient) { }

    /**
     * @description Gets work items for user
     * @param isWatchedWorkItems items in watch list
     * @param filters filters for work item list
     * @param [page] contains pagination information
     * @returns work items for user logged in
     */
    getWorkItemsForUser(isWatchedWorkItems: boolean, filters: WorkItemFilterModel, page?: PageEvent): Observable<PaginationModel> {
        const userId = localStorage.getItem(Constants.localstorageKeys.ID);
        const userGuid = localStorage.getItem(Constants.localstorageKeys.GUID);
        const { WORK_ITEM, USERS } = Constants.endPoints;

        let params: HttpParams = new HttpParams()
            .set(Constants.queryParameters.IS_WATCHED_WORK_ITEMS, `${isWatchedWorkItems}`);
        if (filters) {
            for (const key in filters) {
                if (filters[key]) {
                    params = params.set(key, filters[key]);
                }
            }
        }
        if (page) {
            params = params.append(Constants.queryParameters.PAGE, `${page.pageIndex + 1}`)
                .append(Constants.queryParameters.PAGE_SIZE, `${page.pageSize}`);
        }
        return this.httpClient.get<PaginationModel>(`${WORK_ITEM}/${USERS}/${userId}/${userGuid}`, { params });
    }

    /**
     * @description Gets work item by id
     * @param workItemId of the work item to be fetched
     * @param workItemGuid of the work item to be fetched
     * @returns work item by id from the server
     */
    getWorkItemById(workItemId: number, workItemGuid: string): Observable<WorkItemModel> {
        return this.httpClient.get<any>(`${Constants.endPoints.WORK_ITEM}/${workItemId}/${workItemGuid}`);
    }

    /**
     * @description Gets watchers for work item
     * @param workItemId of the current work item
     * @param workItemGuid of the current work item
     * @returns watchers for work item selected
     */
    getWatchersForWorkItem(workItemId: number, workItemGuid: string): Observable<PaginationModel> {
        const { WORK_ITEM, WORK_ITEM_WATCHERS } = Constants.endPoints;
        return this.httpClient.get<any>(`${WORK_ITEM}/${WORK_ITEM_WATCHERS}/${workItemId}/${workItemGuid}`);
    }

    /**
     * @description Gets children for work item
     * @param workItemId of the current work item
     * @param workItemGuid of the current work item
     * @returns children for work item selected
     */
    getChildrenForWorkItem(workItemId: number, workItemGuid: string): Observable<PaginationModel> {
        const { WORK_ITEM, WORK_ITEM_CHILDREN } = Constants.endPoints;
        const { USER_ID, USER_GUID } = Constants.queryParameters;
        const userId = localStorage.getItem(Constants.localstorageKeys.ID);
        const userGuid = localStorage.getItem(Constants.localstorageKeys.GUID);
        const params: HttpParams = new HttpParams()
            .set(USER_ID, `${userId}`)
            .set(USER_GUID, `${userGuid}`);
        return this.httpClient.get<any>(`${WORK_ITEM}/${WORK_ITEM_CHILDREN}/${workItemId}/${workItemGuid}`, { params });
    }

    /**
     * @description Gets attachments for work item
     * @param workItemId of the current work item
     * @param workItemGuid of the current work item
     * @returns attachments for work item selected
     */
    getAttachmentsForWorkItem(workItemId: number, workItemGuid: string): Observable<PaginationModel> {
        const { WORK_ITEM_ATTACHMENT, WORK_ITEM } = Constants.endPoints;
        return this.httpClient.get<any>(
            `${WORK_ITEM_ATTACHMENT}/${WORK_ITEM}/${workItemId}/${workItemGuid}`);
    }

    /**
     * @description Gets comments for work item
     * @param workItemId of the current work item
     * @param workItemGuid of the current work item
     * @returns comments for work item selected
     */
    getCommentsForWorkItem(workItemId: number, workItemGuid: string): Observable<PaginationModel> {
        const { WORK_ITEM_COMMENTS, WORK_ITEM } = Constants.endPoints;
        return this.httpClient.get<any>(
            `${WORK_ITEM_COMMENTS}/${WORK_ITEM}/${workItemId}/${workItemGuid}`);
    }

    /**
     * @description Gets meta data for work item
     * @param workItemId of the selected work item
     * @param workItemGuid of the selected work item
     * @returns meta data for work item
     */
     getMetaDataForWorkItem(workItemId?: number, workItemGuid?: string): Observable<WorkItemMetaDataModel> {
        const { SUPPORT_TICKET_METADATA, WORK_ITEM } = Constants.endPoints;
        const { WORK_ITEM_ID, WORK_ITEM_GUID } = Constants.queryParameters;
        const userId = localStorage.getItem(Constants.localstorageKeys.ID);
        const userGuid = localStorage.getItem(Constants.localstorageKeys.GUID);
        let params: HttpParams = new HttpParams();
        if (workItemId) {
            params = params.append(WORK_ITEM_ID, `${workItemId}`),
                params = params.append(WORK_ITEM_GUID, `${workItemGuid}`);
        }
        return this.httpClient.get<any>(
            `${WORK_ITEM}/${SUPPORT_TICKET_METADATA}/${userId}/${userGuid}`, { params });
    }

    /**
     * @description Adds watchers for work item
     * @param watchers to be added
     * @returns watchers for work item selected
     */
    addWatchersForWorkItem(watchers: any): Observable<any> {
        const { WORK_ITEM, WORK_ITEM_WATCHERS } = Constants.endPoints;
        return this.httpClient.post<any>(`${WORK_ITEM}/${WORK_ITEM_WATCHERS}`, watchers);
    }

    /**
     * @description Adds comment for work item
     * @param newComment contains comment to be added
     * @returns comment for work item added
     */
    addCommentForWorkItem(newComment: WorkItemCommentModel): Observable<any> {
        return this.httpClient.post<any>(Constants.endPoints.WORK_ITEM_COMMENTS, newComment);
    }

    /**
     * @description Updates work item
     * @param workItem updated
     * @returns work item updated
     */
    updateWorkItem(workItem: WorkItemModel): Observable<any> {
        const { WORK_ITEM } = Constants.endPoints;
        return this.httpClient.put<any>(`${WORK_ITEM}`, workItem);
    }

    /**
     * @description Updates work item attachments
     * @param newWorkItem contains formData to be created
     * @returns work item created
     */
    uploadWorkItemAttachments(newWorkItem: FormData): Observable<any> {
        return this.httpClient.post<any>(Constants.endPoints.WORK_ITEM_ATTACHMENT, newWorkItem);
    }

    /**
     * @description Deletes work item watcher
     * @param watcherId of watcher to be removed
     * @param watcherGuid of watcher to be removed
     * @returns work item watcher removed
     */
    deleteWorkItemWatcher(watcherId: number, watcherGuid: string): Observable<any> {
        const { WORK_ITEM, WORK_ITEM_WATCHERS } = Constants.endPoints;
        return this.httpClient.delete<any>(`${WORK_ITEM}/${WORK_ITEM_WATCHERS}/${watcherId}/${watcherGuid}`);
    }

    /**
     * @description Deletes comment
     * @param commentId of comment to be deleted
     * @param commentGuid of comment to be deleted
     * @returns comment deleted
     */
    deleteComment(commentId: number, commentGuid: string): Observable<any> {
        const userGuid = localStorage.getItem(Constants.localstorageKeys.GUID);
        const params: HttpParams = new HttpParams()
            .set(Constants.queryParameters.USER_GUID, userGuid);
        return this.httpClient.delete<any>(`${Constants.endPoints.WORK_ITEM_COMMENTS}/${commentId}/${commentGuid}`, { params });
    }
}
