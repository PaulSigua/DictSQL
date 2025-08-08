import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Moon } from 'lucide-angular';
import {
  Plus,
  Folder,
  Save,
  Settings,
  SunMoon
} from 'lucide-angular';


@NgModule({
  declarations: [
    MainLayoutComponent,
    SidenavComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule.pick({ Plus, Folder, Save, Settings, SunMoon })
  ],
  exports: [
    RouterModule,
    MainLayoutComponent,
    SidenavComponent,
    HeaderComponent
  ]
})
export class LayoutsModule { }
