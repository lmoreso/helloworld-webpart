import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClientResponse, SPHttpClient } from "@microsoft/sp-http";
import { sp, ItemAddResult } from "@pnp/sp";
import { IIncidencia } from "../webparts/incidencias/IncidenciasWebPart";

export default class SPServices {

    public static updateItemFromSPList(listName: string, item: IIncidencia): any {
        let list = sp.web.lists.getByTitle(listName);
        let laIncidencia = list.items.getById(item.Id);
        return (laIncidencia.update({
            mango_descripcionIncidencia: item.mango_descripcionIncidencia
        }).then((result) => {
            return result;
        }) as Promise<any>);
    }

    public static getListData(listName: string, context: WebPartContext): Promise<any> {
        return context.spHttpClient.get(context.pageContext.web.absoluteUrl + '/_api/lists/getbytitle(\'' + listName + '\')/items?$select=*, TaxCatchAll/Id, TaxCatchAll/Term&$expand=TaxCatchAll', SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            });
    }

    public static deleteItemFromSPList(listName: string, itemId: number, context: WebPartContext): Promise<any> {
        sp.setup({spfxContext: context});
        let list = sp.web.lists.getByTitle(listName);
        return (list.items.getById(itemId).delete().then((result) => {
            return result;
        }) as Promise<any>);


    }

    public static insertItemToSPList(listName: string, item: IIncidencia, context: WebPartContext): Promise<any> {
        sp.setup({spfxContext: context});
        let list = sp.web.lists.getByTitle(listName);

        return (list.items.add(item).then((iar: ItemAddResult) => {
            return iar.data.ID;
        }) as Promise<any>);



    }

}