import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DocumentationComponent } from './pages/dashboard/documentation/documentation.component';
import { ObjectDetailsComponent } from './pages/dashboard/object-details/object-details.component';
import { TablesComponent } from './pages/dashboard/documentation/tables/tables.component';
import { ColumnsComponent } from './pages/dashboard/documentation/columns/columns.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'documentation'
          },
          {
            path: 'documentation',
            component: DocumentationComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'tables'
              },
              {
                path: 'tables',
                component: TablesComponent
              },
              {
                path: 'columns',
                component: ColumnsComponent
              }
            ]
          },
          {
            path: 'object-details',
            component: ObjectDetailsComponent
          }
        ]
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
