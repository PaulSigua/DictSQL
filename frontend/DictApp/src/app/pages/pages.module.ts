import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { DbTabComponent } from './db-tab/db-tab.component';
import { NewConnectionModalComponent } from './new-connection-modal/new-connection-modal.component';
import { FormsModule } from '@angular/forms';
import {
  Database,
  LucideAngularModule,
  Info
} from 'lucide-angular';
import { DocumentationComponent } from './dashboard/documentation/documentation.component';
import { ObjectDetailsComponent } from './dashboard/object-details/object-details.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DashboardComponent,
    DbTabComponent,
    NewConnectionModalComponent,
    DocumentationComponent,
    ObjectDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule.pick({Database, Info}),
    TranslateModule,
  ],
  exports: [
    RouterModule,
    DashboardComponent,
    NewConnectionModalComponent
  ]
})
export class PagesModule { }
