import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AddWorkItemsService {
  currentWorkItemId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentWorkItemGuid: BehaviorSubject<string> = new BehaviorSubject<string>('');
  workItemType: BehaviorSubject<string> = new BehaviorSubject<string>('');
  parentWorkItemGuid: BehaviorSubject<string> = new BehaviorSubject<string>('');
  saveWorkItem: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  updateWorkItemMetaData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
}
