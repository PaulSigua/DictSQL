import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DbTab } from '../../interfaces/db-tab.model';

@Injectable({
  providedIn: 'root',
})
export class TabManagerService {
  private tabs: DbTab[] = [];
  private tabsSubject = new BehaviorSubject<DbTab[]>([]);
  tabs$ = this.tabsSubject.asObservable();

  openTab(tab: DbTab) {
    const exists = this.tabs.find(t => t.id === tab.id);
    if (!exists) {
      this.tabs.forEach(t => (t.active = false));
      tab.active = true;
      this.tabs.push(tab);
    } else {
      this.setActiveTab(tab.id);
    }
    this.tabsSubject.next(this.tabs);
  }

  setActiveTab(id: string) {
    this.tabs = this.tabs.map(t => ({ ...t, active: t.id === id }));
    this.tabsSubject.next(this.tabs);
  }

  closeTab(id: string) {
    const i = this.tabs.findIndex(t => t.id === id);
    if (i > -1) this.tabs.splice(i, 1);
    if (this.tabs.length) this.tabs[this.tabs.length - 1].active = true;
    this.tabsSubject.next(this.tabs);
  }

  getActiveTab() {
    return this.tabs.find(t => t.active);
  }
}