import { IIncidencia } from './IncidenciasWebPart';

export default class MockHttpClient  {

    private static _items: IIncidencia[] = [
        { Title: 'Incidencia 1', Id: 1, key: 1, mango_fecCierre: new Date(2019, 1, 1), mango_estadoIncidencia:  "Abierta", 
        mango_usuSolicitante: "Responsable 1", Created: new Date(1900, 1, 1),
        mango_descripcionIncidencia: "Vaya coñazo de incidencia", 
        mango_PaisProvinciaLabel: "Portugal", mango_PaisProvincia: {}},
        { Title: 'Incidencia 2', Id: 2, key: 2, mango_fecCierre: new Date(2019, 1, 2), mango_estadoIncidencia:  "Abierta", 
        mango_usuSolicitante: "Responsable 2", Created: new Date(1900, 1, 2),
        mango_descripcionIncidencia: "Estoy a sta los mismisimos", 
        mango_PaisProvinciaLabel: "España", mango_PaisProvincia: {}},
        { Title: 'Incidencia 3', Id: 3, key: 3, mango_fecCierre: new Date(2019, 1, 3), mango_estadoIncidencia:  "Cerrada", 
        mango_usuSolicitante: "Responsable 3", Created: new Date(1900, 1, 3),
        mango_descripcionIncidencia: "Que os den a todos, cabrones", 
        mango_PaisProvinciaLabel: "Alava", mango_PaisProvincia: {}},
        { Title: 'Incidencia 4', Id: 4, key: 4, mango_fecCierre: new Date(2019, 1, 4), mango_estadoIncidencia:  "Abierta", 
        mango_usuSolicitante: "Responsable 3", Created: new Date(1900, 1, 3),
        mango_descripcionIncidencia: "Que os den a todos, cabrones", 
        mango_PaisProvinciaLabel: "Barcelona", mango_PaisProvincia: {}},
    ];                                    

   public static get(): Promise<IIncidencia[]> {
   return new Promise<IIncidencia[]>((resolve) => {
           resolve(MockHttpClient._items);
       });
   }
}
