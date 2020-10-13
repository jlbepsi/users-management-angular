import {ComponentFactoryResolver, Inject, Injectable, Injector, NgZone, Renderer2, RendererFactory2} from '@angular/core';
import {Overlay, OverlayKeyboardDispatcher, OverlayPositionBuilder, OverlayRef, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {Directionality} from '@angular/cdk/bidi';
import {DynamicOverlayContainer} from './DynamicOverlayContainer';


@Injectable({
    providedIn: 'root'
})
export class DynamicOverlay extends Overlay {
    private readonly _dynamicOverlayContainer: DynamicOverlayContainer;
    private renderer: Renderer2;

    constructor(
        scrollStrategies: ScrollStrategyOptions,
        overlayContainer: DynamicOverlayContainer,
        componentFactoryResolver: ComponentFactoryResolver,
        positionBuilder: OverlayPositionBuilder,
        keyboardDispatcher: OverlayKeyboardDispatcher,
        injector: Injector,
        ngZone: NgZone,
        @Inject(DOCUMENT) document: any,
        directionality: Directionality,
        rendererFactory: RendererFactory2
    ) {
        super(
            scrollStrategies,
            overlayContainer,
            componentFactoryResolver,
            positionBuilder,
            keyboardDispatcher,
            injector,
            ngZone,
            document,
            directionality
        );
        this.renderer = rendererFactory.createRenderer(null, null);

        this._dynamicOverlayContainer = overlayContainer;
    }

    private setContainerElement(containerElement: HTMLElement): void {
        this.renderer.setStyle(containerElement, 'transform', 'translateZ(0)');
        this._dynamicOverlayContainer.setContainerElement(containerElement);
    }

    public createWithDefaultConfig(containerElement: HTMLElement): OverlayRef {
        this.setContainerElement(containerElement);
        return super.create({
            positionStrategy: this.position()
                .global()
                .centerHorizontally()
                .centerVertically(),
            hasBackdrop: true
        });
    }
}
