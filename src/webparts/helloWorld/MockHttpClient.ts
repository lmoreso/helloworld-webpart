import { ITienda } from './HelloWorldWebPart';

export default class MockHttpClient  {

    private static _items: ITienda[] = [
        { Title: 'Mock List 1', Id: 1, key: 1, mango_fechaApertura: new Date(1900, 1, 1), mango_tipoTienda:  "Tipo tienda 1", 
            mango_usuarioResponsableId: "Responsable 1", Created: new Date(1900, 1, 1)},
        { Title: 'Mock List 2', Id: 2, key: 2, mango_fechaApertura: new Date(1900, 1, 2), mango_tipoTienda:  "Tipo tienda 2", 
            mango_usuarioResponsableId: "Responsable 2", Created: new Date(1900, 1, 2)},
        { Title: 'Mock List 3', Id: 2, key: 3, mango_fechaApertura: new Date(1900, 1, 3), mango_tipoTienda:  "Tipo tienda 3", 
            mango_usuarioResponsableId: "Responsable 3", Created: new Date(1900, 1, 3)}
    ];                                    

   public static get(): Promise<ITienda[]> {
   return new Promise<ITienda[]>((resolve) => {
           resolve(MockHttpClient._items);
       });
   }
}
