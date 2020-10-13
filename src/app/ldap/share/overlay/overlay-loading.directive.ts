import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../loader/loader.component';
import {DynamicOverlay} from './DynamicOverlay';



// Lien :
//  https://itnext.io/a-loader-for-your-components-with-angular-cdk-overlay-ebf5a4962e4d

@Directive({
  selector: '[appOverlayLoading]'
})
export class OverlayLoadingDirective implements OnInit {
  @Input('appOverlayLoading') toggler: Observable<boolean>;

  private overlayRef: OverlayRef;

  constructor(
      private host: ElementRef,
      private dynamicOverlay: DynamicOverlay
  ) {}

  ngOnInit() {
    this.overlayRef = this.dynamicOverlay.createWithDefaultConfig(
        this.host.nativeElement
    );

    this.toggler.subscribe(show => {
      if (show) {
        this.overlayRef.attach(new ComponentPortal(LoaderComponent));
      } else {
        this.overlayRef.detach();
      }
    });
  }

}
