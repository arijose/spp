
import { Directive, ElementRef, HostListener, Input, Renderer, Output, EventEmitter } from '@angular/core';


/********************************
 * Component declaration
 *******************************/

@Directive({
  selector: '[droppable]'
})
export class DroppableDirective {

  @HostListener('drop', ['$event']) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.getImage(event);
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    event.dataTransfer.dropEffect = 'copy';

    this.elementRef.nativeElement.style.borderColor = '#00ed17';
  }

  @HostListener('dragleave', ['$event']) onDragOut() {
    this.elementRef.nativeElement.style.borderColor = '#eee';
  }

  @Output() avatar: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  private getImage(event: any): void {
    let file: File = event.dataTransfer.files[0];
    let reader: FileReader = new FileReader();
    let avatar: EventEmitter<any> = this.avatar;
    let elementRef: ElementRef = this.elementRef;

    // File reader is loaded; load image
    reader.onload = function (event: any) {
      avatar.emit(event.target.result);

      elementRef.nativeElement.classList.remove('well');
    }

    reader.readAsDataURL(file);

  }
}