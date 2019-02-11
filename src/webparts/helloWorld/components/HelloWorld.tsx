import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Utiles from '../../../services/utiles';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { DisplayMode } from '@microsoft/sp-core-library';


export default class HelloWorld extends React.Component<IHelloWorldProps, {}> {
  public render(): React.ReactElement<IHelloWorldProps> {
    // console.log(escape(this.props.description));
    // console.log(escape(this.props.context.pageContext.web.title));
    // console.log(this.props.tiendas);
    //var tiendasrender = this.props.tiendas.forEach((unaTienda)=> {return(<li>{unaTienda.Descipcion}</li>);});

    return (

      
      <ul>
        <WebPartTitle
          displayMode={DisplayMode.Read}
          title={"Listado de Tiendas"}
          updateProperty={ null} 
        />      
      {this.props.tiendas.map((unaTienda) => {
        return(<li>Key: {unaTienda.key} - Titulo: {unaTienda.Title} - Id: {unaTienda.Id} - Resp: {unaTienda.mango_usuarioResponsableId} - Creado: {Utiles.parseFechas(unaTienda.Created)}</li>);
      })}</ul>





  /*       
      <div className={ styles.helloWorld }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Bienvenido al SharePoint, so pringao!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>Descripción: {escape(this.props.description)}</p>
              <p className={ styles.description }>Test: {escape(this.props.test)}</p>
              <p className={ styles.description }>Test1: {this.props.test1.valueOf().toString()}</p>
              <p className={ styles.description }>Test2: {escape(this.props.test2)}</p>
              <p className={ styles.description }>Test3: {this.props.test3.valueOf().toString()}</p>
              <p className={ styles.description }>Contexto: {escape(this.props.context.pageContext.web.title)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
              <img src="https://media2.giphy.com/media/xUPGcxtF0XweuykLVS/giphy.gif?cid=3640f6095c542e8f6e6f6f7677e5d80f" alt=""/>
            </div>
          </div>
        </div>
      </div>
 */    );
  }
}
