import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { NewConnectionModalComponent } from './new-connection-modal/new-connection-modal.component';
import { FormsModule } from '@angular/forms';
import {
  Database,
  LucideAngularModule,
  Info,
  X,
  User,
  Calendar,
  Download
} from 'lucide-angular';
import { DocumentationComponent } from './dashboard/documentation/documentation.component';
import { ObjectDetailsComponent } from './dashboard/object-details/object-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { TablesComponent } from './dashboard/documentation/tables/tables.component';
import { ColumnsComponent } from './dashboard/documentation/columns/columns.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from '../layouts/header/header.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    DocumentationComponent,
    ObjectDetailsComponent,
    TablesComponent,
    ColumnsComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule.pick({Database, Info, X, User, Calendar, Download}),
    TranslateModule,
    SharedModule
  ],
  exports: [
    RouterModule,
    DashboardComponent,
  ]
})
export class PagesModule { }
