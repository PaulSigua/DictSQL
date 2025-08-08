import { Component } from '@angular/core';

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
            name: 'Tables',
            icon: 'folder',
            count: 2,
            isOpen: true,
            items: [
              { name: 'Users', description: 'Basic user info' },
              { name: 'Posts', description: 'User-generated posts' },
            ],
          },
          {
            name: 'Views',
            icon: 'folder',
            count: 1,
            isOpen: false,
            items: [{ name: 'ActiveUsers', description: 'Only active users' }],
          },
          {
            name: 'Stored Procedures',
            icon: 'folder',
            count: 1,
            isOpen: false,
            items: [
              { name: 'sp_UpdateUser', description: 'Updates user data' },
            ],
          },
          {
            name: 'Functions',
            icon: 'folder',
            count: 1,
            isOpen: false,
            items: [
              { name: 'fn_GetUserName', description: 'Returns full name' },
            ],
          },
        ],
      },
    ],
  };
}
