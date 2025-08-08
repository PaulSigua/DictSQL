import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  isOpen = false;

  database = {
    name: 'DemoDB',
    schemas: [
      {
        name: 'public',
        categories: [
          {
            name: 'database.tables',
            icon: 'folder',
            count: 2,
            isOpen: true,
            items: [
              { name: 'Users', description: 'database.basicUserInfo' },
              { name: 'Posts', description: 'database.userGeneratedPosts' },
            ],
          },
          {
            name: 'database.views',
            icon: 'folder',
            count: 1,
            isOpen: false,
            items: [{ name: 'ActiveUsers', description: 'database.onlyActiveUsers' }],
          },
          {
            name: 'database.storedProcedures',
            icon: 'folder',
            count: 1,
            isOpen: false,
            items: [
              { name: 'sp_UpdateUser', description: 'database.updatesUserData' },
            ],
          },
          {
            name: 'database.functions',
            icon: 'folder',
            count: 1,
            isOpen: false,
            items: [
              { name: 'fn_GetUserName', description: 'database.returnsFullName' },
            ],
          },
        ],
      },
    ],
  };
}
