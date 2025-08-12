import { Component, EventEmitter, Output, HostListener } from '@angular/core';

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
    type: 'PostgreSQL' as const,
    host: 'localhost',
    port: 5432,
    database: '',
    user: '',
    password: '',
  };

  @HostListener('document:keydown.escape')
  onEsc() { this.close.emit(); }

  submit() {
    if (!this.model.projectName?.trim() || !this.model.database?.trim()) return;

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

    this.close.emit();
  }
}
