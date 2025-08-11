import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { DbTabComponent } from './db-tab/db-tab.component';
import { NewConnectionModalComponent } from './new-connection-modal/new-connection-modal.component';
import { FormsModule } from '@angular/forms';
import {
  Database,
  LucideAngularModule
} from 'lucide-angular';


@NgModule({
  declarations: [
    DashboardComponent,
    DbTabComponent,
    NewConnectionModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule.pick({Database})
  ],
  exports: [
    RouterModule,
    DashboardComponent,
    NewConnectionModalComponent
  ]
})
export class PagesModule { }
