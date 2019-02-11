import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'HelloWorldWebPartStrings';
import HelloWorld from './components/HelloWorld';
import { IHelloWorldProps } from './components/IHelloWorldProps';
import MockHttpClient from './MockHttpClient'; 
import {
  SPHttpClient,
  SPHttpClientResponse   
 } from '@microsoft/sp-http';
 import {
  Environment,
  EnvironmentType
 } from '@microsoft/sp-core-library';
import SPServices from '../../services/SPServices';

export interface IHelloWorldWebPartProps {
  description: string;
  test: string;
  test1: boolean;
  test2: string;
  test3: boolean;
}

export interface ITiendaCollection {
  value: ITienda[];
 }
 
 export interface ITienda {
  Title: string;
  key: number;
  Id: number;
  mango_fechaApertura: Date;
  mango_tipoTienda: string;
  mango_usuarioResponsableId: string;
  Created: Date;
 }

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  private _getMockListData(): Promise<ITiendaCollection> {
    return MockHttpClient.get()
      .then((data: ITienda[]) => {
        var listData: ITiendaCollection = { value: data };
        return listData;
      }) as Promise<ITiendaCollection>;
  }

  public render(): void {
    
    if (Environment.type === EnvironmentType.Local) {

      this._getMockListData().then((response)=> {

        const element: React.ReactElement<IHelloWorldProps > = React.createElement(
          HelloWorld,
          {
            description: this.properties.description,
            test: this.properties.test,
            test1: this.properties.test1,
            test2: this.properties.test2,
            test3: this.properties.test3,
            context: this.context,
            tiendas: response.value
          }
    
        );
    
        ReactDom.render(element, this.domElement);
        
      });
    } else {
      //this._getListData().then((response)=> {
      SPServices.getListData("Tiendas", this.context).then((response)=> {

        const element: React.ReactElement<IHelloWorldProps > = React.createElement(
          HelloWorld,
          {
            description: this.properties.description,
            test: this.properties.test,
            test1: this.properties.test1,
            test2: this.properties.test2,
            test3: this.properties.test3,
            context: this.context,
            tiendas: response.value
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
                label: 'Description'
              }),
              PropertyPaneTextField('test', {
                label: 'Multi-line Text Field',
                multiline: true
              }),
              PropertyPaneCheckbox('test1', {
                text: 'Checkbox'
              }),
              PropertyPaneDropdown('test2', {
                label: 'Dropdown',
                options: [
                  { key: '1', text: 'One' },
                  { key: '2', text: 'Two' },
                  { key: '3', text: 'Three' },
                  { key: '4', text: 'Four' }
                ]}),
              PropertyPaneToggle('test3', {
                label: 'Toggle',
                onText: 'On',
                offText: 'Off'
              })
            ]
            }
          ]
        }
      ]
    };
   }
   }
