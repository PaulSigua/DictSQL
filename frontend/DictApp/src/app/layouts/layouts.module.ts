import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  Plus,
  Folder,
  Save,
  Settings,
  SunMoon,
  Search,
  ChevronRight,
  ChevronDown,
  Database, 
  Table,
  FileText,
  PlugZap,
  Sun,
  Moon,
  Monitor
} from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PagesModule } from '../pages/pages.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MainLayoutComponent,
    SidenavComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule.pick({ Plus, Folder, Save, Settings, SunMoon, Search, ChevronRight, ChevronDown, Database, Table, FileText, PlugZap, Sun, Moon, Monitor }),
    TranslateModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    RouterModule,
    MainLayoutComponent,
    SidenavComponent,
  ]
})
export class LayoutsModule { }
