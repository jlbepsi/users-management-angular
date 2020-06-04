import {UserImport} from './UserImport';


export class UserExport {

    constructor(public login: string, public nom: string, public prenom: string,
                public classe: string, public mail: string,
                public bts: boolean, public btsParcours: string, public btsNumero: string) {
    }
}
