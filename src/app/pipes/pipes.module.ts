import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosterPipe } from './poster.pipe';
import { CutPipe } from './cut.pipe';
import { HoursMinutesPipe } from './hours-minutes.pipe';
import { TrackByPipe } from './track-by.pipe';

@NgModule({
  declarations: [PosterPipe, CutPipe, HoursMinutesPipe, TrackByPipe],
  exports: [PosterPipe, CutPipe, HoursMinutesPipe, TrackByPipe],
  imports: [CommonModule],
})
export class PipesModule {}
