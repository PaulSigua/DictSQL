import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../layouts/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { NewConnectionModalComponent } from '../pages/new-connection-modal/new-connection-modal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, NewConnectionModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    LucideAngularModule
  ],
  exports: [HeaderComponent, NewConnectionModalComponent]
})
export class SharedModule {}
