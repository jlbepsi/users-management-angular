import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Label, SingleDataSet} from 'ng2-charts';

import {UsersService} from '../../service/users-service.service';
import {BtsInfo, ClassesInfo} from '../../model/ClasseInfo';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    usersTotal = '-';
  barChartOptions: ChartOptions = {
    responsive: true,
    scales : {
      yAxes: [{
        ticks: {
          min : 0,
        }
      }],
    },
  };

  // Toutes les classes
  barChartLabelsUsers: Label[] = [];
  barChartDataUsers: ChartDataSets[] = [
    { data: [], label: 'Répartition des étudiants' }
  ];

  // Pour le BTS
  barChartLabelsBts: Label[] = ['B1', 'B2'];
  barChartDataBts: ChartDataSets[] = [
    { data: [], label: 'Sans option' },
    { data: [], label: 'Option BTS' }
  ];
  /*pieChartLabelsBts: Label[] = ['Non-BTS', 'BTS'];
  pieChartDataBts1: SingleDataSet = [];
  pieChartDataBts2: SingleDataSet = [];*/

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.getClassesInfos();
  }

  private getClassesInfos() {
    this.usersService.getClassInfos().subscribe(
        (classesInfo: ClassesInfo) => {
        const classes: string[] = [];
        const effectifs: number[] = [];

        // Toutes les classes
        // On trie avant d'afficher
        classesInfo.allClasses.sort( ((a, b) => a.nom < b.nom ? -1 : 1));

        let total = 0;
        classesInfo.allClasses.forEach( (classeInfo) => {
          classes.push(classeInfo.nom);
          effectifs.push(classeInfo.effectif);
          total += classeInfo.effectif;
        });
        this.usersTotal = total.toString();
        this.barChartLabelsUsers = classes;
        this.barChartDataUsers[0].data = effectifs;

        // Le BTS
        const b1: BtsInfo = classesInfo.bts.find(ci => ci.nom === 'B1');
        const b2: BtsInfo = classesInfo.bts.find(ci => ci.nom === 'B2');
        this.barChartDataBts[0].data = [
          b1.effectif - b1.bts,
          b2.effectif - b2.bts
        ];
        this.barChartDataBts[1].data = [
          b1.bts,
          b2.bts
        ];
      }
    );
  }
}
