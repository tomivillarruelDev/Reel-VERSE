import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosterPipe } from './poster.pipe';
import { CutPipe } from './cut.pipe';
import { HoursMinutesPipe } from './hours-minutes.pipe';



@NgModule({
  declarations: [
    PosterPipe,
    CutPipe,
    HoursMinutesPipe
  ],
  exports: [
    PosterPipe,
    CutPipe,
    HoursMinutesPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
