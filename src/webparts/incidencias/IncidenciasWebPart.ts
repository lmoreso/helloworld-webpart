import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IncidenciasWebPartStrings';
import Incidencias from './components/Incidencias';
import { IIncidenciasProps } from './components/IIncidenciasProps';
import { SPHttpClientResponse, SPHttpClient } from '@microsoft/sp-http';
import MockHttpClient from './MockHttpClient';
import SPServices from '../../services/SPServices';

export interface IIncidenciasWebPartProps {
  description: string;
}

export interface IIncidenciaCollection {
  value: IIncidencia[];
 }
 
 export interface IIncidencia {
  key: number;
  Title: string;
  Id: number;
  Created: Date;
  mango_descripcionIncidencia: string;
  // mango_comentariosIncidencia: string;
  mango_estadoIncidencia: string;
  mango_fecCierre: Date;
  // mango_asignadoA: string;
  mango_usuSolicitante: string;
  mango_PaisProvincia: any;  // campo de tipo taxonomia
  mango_PaisProvinciaLabel: string;
 }


export default class IncidenciasWebPart extends BaseClientSideWebPart<IIncidenciasWebPartProps> {
  private _getMockListData(): Promise<IIncidenciaCollection> {
    return MockHttpClient.get()
      .then((data: IIncidencia[]) => {
        var listData: IIncidenciaCollection = { value: data };
        return listData;
      }) as Promise<IIncidenciaCollection>;
  }

  public render(): void {
    if (Environment.type === EnvironmentType.Local) {

      this._getMockListData().then((response)=> {

        const element: React.ReactElement<IIncidenciasProps > = React.createElement(
          Incidencias,
          {
            incidencias: response.value,
            context: this.context
          }
    
        );
    
        ReactDom.render(element, this.domElement);
        
      });
    } else {
      //this._getListData().then((response)=> {
      SPServices.getListData("Listado de Incidencias", this.context).then((response)=> {

        response.value.map((item) => {
          if (item.mango_PaisProvincia) {
            var idPais = item.mango_PaisProvincia.Label;
            //Itera el TaxCatchAll y busca aquel termino cuyo Id = a item.mango_PaisProvincia.Label y devielves el term.Term
            item.mango_PaisProvinciaLabel = item.TaxCatchAll.find((aux) => { return aux.Id == idPais; }).Term;

          } 
          //item.mango_PaisProvinciaLabel = item.mango_PaisProvincia.Label;
          return item;
        });

        const element: React.ReactElement<IIncidenciasProps > = React.createElement(
          Incidencias,
          {
            incidencias: response.value,
            context: this.context
          }
    
        );
    
        ReactDom.render(element, this.domElement);
        
      });
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
