import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-new-connection-modal',
  standalone: false,
  templateUrl: './new-connection-modal.component.html',
  styleUrl: './new-connection-modal.component.css'
})
export class NewConnectionModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<{
    projectName: string;
    type: 'PostgreSQL' | 'SQLServer' | string;
    connection: any;
  }>();

  model = {
    projectName: '',
    type: 'PostgreSQL' as 'PostgreSQL' | 'SQLServer' | string,
    host: 'localhost',
    port: 5432,
    database: '',
    user: '',
    password: '',
  };

  submit() {
    if (!this.model.projectName || !this.model.database) return;
    this.create.emit({
      projectName: this.model.projectName.trim(),
      type: this.model.type,
      connection: {
        host: this.model.host,
        port: this.model.port,
        database: this.model.database,
        user: this.model.user,
        password: this.model.password,
      },
    });
  }
}
