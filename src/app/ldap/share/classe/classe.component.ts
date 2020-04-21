import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {

  @Input() classe: string;
  @Output() classeChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onClasseChange(event) {
    this.classeChange.emit(this.classe);
  }

}
