import { NgModule } from '@angular/core';

import { MatPaginatorModule } from '@angular/material';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';


@NgModule ({
  imports: [
    
  ],
  exports: [
    MatPaginatorModule,
    MatButtonModule,
    MatButtonToggleModule,
  ]
})
export class MaterialModule {}