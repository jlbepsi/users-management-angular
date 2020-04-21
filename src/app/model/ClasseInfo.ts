
export interface ClasseInfo {
  nom: string;
  effectif: number;
}
export interface BtsInfo {
  nom: string;
  effectif: number;
  bts: number;
}

export interface ClassesInfo {
  allClasses: ClasseInfo[];
  bts: BtsInfo[];
}
