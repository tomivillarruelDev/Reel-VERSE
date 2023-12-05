import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosterPipe } from './poster.pipe';
import { CutPipe } from './cut.pipe';



@NgModule({
  declarations: [
    PosterPipe,
    CutPipe
  ],
  exports: [
    PosterPipe,
    CutPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
