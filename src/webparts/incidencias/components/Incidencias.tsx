import * as React from 'react';
import styles from './Incidencias.module.scss';
import { IIncidenciasProps, IIncidenciasState } from './IIncidenciasProps';
import { escape, times } from '@microsoft/sp-lodash-subset';
import Utiles from '../../../services/utiles';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { DisplayMode } from '@microsoft/sp-core-library';
import { FieldDateRenderer } from "@pnp/spfx-controls-react/lib/FieldDateRenderer";
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { IIncidencia } from '../IncidenciasWebPart';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import SPServices from '../../../services/SPServices';
import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import Dialog, { DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';


export default class Incidencias extends React.Component<IIncidenciasProps, IIncidenciasState> {
  private nuevoTitulo: string;
  private nuevaDescripcion: string;

  private _dlgBorrar(titulo: string, texto: string): void {
    this.setState({
      dlgTexto: texto,
      dlgTitulo: titulo,
      dlgShow: true,
      dlgShowBtnBorrar: true,
      dlgLitBtnCerrar: "Cancelar"
    });

  }

  private _messageBox(titulo: string, texto: string): void {
    this.setState({
      dlgTexto: texto,
      dlgTitulo: titulo,
      dlgShow: true,
      dlgShowBtnBorrar: false,
      dlgLitBtnCerrar: "Cerrar"
    });
  }

  private _getNewId(): number {
    let newID = 0;
    this.state.incidencias.forEach((laIncidecia) => {
      if (laIncidecia.Id > newID) newID = laIncidecia.Id;
    });
    return (newID + 1);
  }

  private _guardarIncidencia(): any {
    // recuperamos el Id. seleccionado
    let laIncidencia = this._getSelectionDetails();
    if (laIncidencia) {
      var indiceIncidencia = this.state.incidencias.indexOf(laIncidencia);
      if (Environment.type != EnvironmentType.Local) {
        SPServices.updateItemFromSPList("Listado de Incidencias", laIncidencia)
          .then((result) => {
            // reenumeramos la colección
            this._actualizarElemento(indiceIncidencia);
          });
      } else {
        this._actualizarElemento(indiceIncidencia);
      }

    } else {
      this._messageBox("ATENCION", "No hay ningún registro seleccionado, no puidor actualizar nada.");
    }
    this._onClosePanelEdit();
  }

  private _BorrarIncidencia(): any {
    let laIncidencia = this._getSelectionDetails();
    if (laIncidencia) {
      if (Environment.type != EnvironmentType.Local) {
        SPServices.deleteItemFromSPList("Listado de Incidencias", laIncidencia.Id, this.context)
          .then((result) => {
            // reenumeramos la colección
            this._borrarElemento(laIncidencia);
          });
      } else {
        this._borrarElemento(laIncidencia);
      }

    }
    this.setState({ dlgShow: false });
  }
  private _menuBorrarIncidencia(): any {
    // recuperamos el Id. seleccionado
    let incidenciaABorrar = this._getSelectionDetails();
    if (incidenciaABorrar) {
      this._dlgBorrar("Atención", "Quieres borrar la incidencia con Id=[" + incidenciaABorrar.Id + "]?");
    } else {
      this._messageBox("Atención", "No hay ningún registro seleccionado, no puidor borrar nada.");
    }


  }

  private _borrarElemento(incidenciaABorrar: IIncidencia) {
    const index: number = this.state.incidencias.indexOf(incidenciaABorrar);
    //let miNuevoArray = this.state.incidencias.slice();
    let miNuevoArray = [...this.state.incidencias];
    miNuevoArray.splice(index, 1);
    this.setState({ incidencias: miNuevoArray });
  }

  private _insertarElemento(nuevaIncidencia: IIncidencia) {
    let miNuevoArray = this.state.incidencias.slice();
    //let miNuevoArray = [...this.state.incidencias];
    miNuevoArray.push(nuevaIncidencia);
    this.setState({ incidencias: miNuevoArray });
  }

  private _actualizarElemento(indiceIncidencia: number) {
    let miNuevoArray = this.state.incidencias.slice();
    miNuevoArray[indiceIncidencia].mango_descripcionIncidencia = this.nuevaDescripcion;
    this.setState({ incidencias: miNuevoArray });
  }


  private _guardarNuevaIncidencia(): any {
    let nuevoID = this._getNewId();
    let miNuevaIncidencia = {
      key: undefined,
      Title: this.nuevoTitulo,
      Id: undefined,
      Created: new Date,
      mango_descripcionIncidencia: this.nuevaDescripcion,
      mango_estadoIncidencia: "Abierta",
      mango_fecCierre: undefined,
      mango_usuSolicitante: undefined,
    } as IIncidencia;

    if (Environment.type != EnvironmentType.Local) {
      SPServices.insertItemToSPList("Listado de Incidencias", miNuevaIncidencia, this.context).then((result) => {
        miNuevaIncidencia.Id = result;
        miNuevaIncidencia.key = result;
        this._insertarElemento(miNuevaIncidencia);
      });
    } else {
      miNuevaIncidencia.Id = nuevoID;
      miNuevaIncidencia.key = nuevoID;
      this._insertarElemento(miNuevaIncidencia);
    }


    this._onClosePanelNew();
  }

  private _getSelectionDetails(): IIncidencia {
    if (this._selection.getSelectedCount() > 0) {
      return (this._selection.getSelection()[0] as IIncidencia);
    } else {
      return (undefined);
    }

  }
  private _selection: Selection;

  constructor(props: IIncidenciasProps) {
    super(props);


    this.state = {
      showPanelNew: false,
      showPanelEdit: false,
      showPanelDelete: false,
      incidenciaSelected: undefined,
      dlgShow: false,
      incidencias: props.incidencias,
    };

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          incidenciaSelected: this._getSelectionDetails()
        });
      }
    });

    this._onClosePanelNew = this._onClosePanelNew.bind(this);
    this._onShowPanelNew = this._onShowPanelNew.bind(this);
    this._onClosePanelEdit = this._onClosePanelEdit.bind(this);
    this._onShowPanelEdit = this._onShowPanelEdit.bind(this);
    this._menuBorrarIncidencia = this._menuBorrarIncidencia.bind(this);
    this._guardarIncidencia = this._guardarIncidencia.bind(this);
    this._guardarNuevaIncidencia = this._guardarNuevaIncidencia.bind(this);
    this._BorrarIncidencia = this._BorrarIncidencia.bind(this);
    this._onBtnCloseDlg = this._onBtnCloseDlg.bind(this);
    

  }


  private static columns = [
    { key: 'clave', name: 'Clave', fieldName: 'key', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'titulo', name: 'Título', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'id', name: 'Id', fieldName: 'Id', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'creado', name: 'Fecha Creación', fieldName: 'Created', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'estado', name: 'Estado', fieldName: 'mango_estadoIncidencia', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'cerrado', name: 'Fecha Cierre', fieldName: 'mango_fecCierre', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'usuario', name: 'Usuario', fieldName: 'mango_usuSolicitante', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'descripcion', name: 'Descripción de la Incidencia', fieldName: 'mango_descripcionIncidencia', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'provincia', name: 'Provincia', fieldName: 'mango_PaisProvinciaLabel', minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  private _renderItemColumn(item: any, index: number, column: IColumn) {
    const fieldContent = item[column.fieldName] as string;

    switch (column.key) {
      case 'clave':
        return <span>{"[" + fieldContent.toString() + "]"}</span>;


      case 'creado':
        var dtFecha = Utiles.parseFechas(item[column.fieldName]);
        // return <span><FieldDateRenderer text={((Date) item[column.fieldName]).toString() /></span>;
        return <span><FieldDateRenderer text={dtFecha} /></span>;

      default:
        return <span>{fieldContent.toString()}</span>;
    }
  }

  public render(): React.ReactElement<IIncidenciasProps> {
    return (
      <div>
        <Dialog
          hidden={!this.state.dlgShow}
          dialogContentProps={{
            type: DialogType.normal,
            title: this.state.dlgTitulo,
            subText: this.state.dlgTexto
          }}
          modalProps={{
            titleAriaId: 'myLabelId',
            subtitleAriaId: 'mySubTextId',
            isBlocking: true,
            containerClassName: 'ms-dialogMainOverride'
          }}
        >
          <DialogFooter>
            {(this.state.dlgShowBtnBorrar) && (<PrimaryButton onClick={this._BorrarIncidencia} text="Borrar" />)}
            <DefaultButton onClick={this._onBtnCloseDlg} text={this.state.dlgLitBtnCerrar} />
          </DialogFooter>
        </Dialog>

        <WebPartTitle
          displayMode={DisplayMode.Read}
          title={"Listado de Incidencias (versión " + Utiles.webPartVersion + ")"}
          updateProperty={null}
        />
        <CommandBar
          items={this.getItems()}
          overflowItems={this.getOverlflowItems()}
          farItems={this.getFarItems()}

        />
        <Panel
          isOpen={this.state.showPanelNew}
          type={PanelType.smallFixedFar}
          onDismiss={this._onClosePanelNew}
          headerText="Abre una nueva incidencia"
          closeButtonAriaLabel="Close"
          onRenderFooterContent={this._onRenderFooterContentNew}
          onRenderBody={this._onRenderBodyContentNew}
        />
        <Panel
          isOpen={this.state.showPanelEdit}
          type={PanelType.smallFixedFar}
          onDismiss={this._onClosePanelEdit}
          headerText="Modifica la descripción de la incidencia"
          closeButtonAriaLabel="Close"
          onRenderFooterContent={this._onRenderFooterContentEdit}
          onRenderBody={this._onRenderBodyContentEdit}
        />
        <TextField label="Elemento Seleccionado:" underlined readOnly={true} value={(this.state.incidenciaSelected) ? this.state.incidenciaSelected.Title : "No hay ningún elemento seleccionado"} />
        <DetailsList
          items={this.state.incidencias}
          columns={Incidencias.columns}
          onRenderItemColumn={this._renderItemColumn}
          selectionMode={SelectionMode.none}
          selection={this._selection}
          onItemInvoked={this._onShowPanelEdit}
        />
        <CommandBar
          items={this.getItems()}
        />
      </div>
    );
  }

  private _onClosePanelNew = (): void => {
    this.setState({ showPanelNew: false });
  }
  private _onClosePanelEdit = (): void => {
    this.setState({ showPanelEdit: false });
  }

  private _onRenderFooterContentNew = (): JSX.Element => {
    return (
      <div>
        <PrimaryButton onClick={this._guardarNuevaIncidencia} style={{ marginRight: '8px' }}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={this._onClosePanelNew}>Cancel</DefaultButton>
      </div>
    );
  }

  private _onRenderFooterContentEdit = (): JSX.Element => {
    return (
      <div>
        <PrimaryButton onClick={this._guardarIncidencia} style={{ marginRight: '8px' }}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={this._onClosePanelEdit}>Cancel</DefaultButton>
      </div>
    );
  }

  private _onRenderBodyContentNew = (): JSX.Element => {
    return (
      <div style={{ margin: '8px' }}>
        <TextField label="Titulo" required={true}
          ariaLabel="Escribe una breve descripción de la incidencia"
          description="Escribe una breve descripción de la incidencia"
          placeholder="Escribe una breve descripción de la incidencia"
          onChanged={(valor) => { this.nuevoTitulo = valor; }}

        />
        <TextField label="Descripción de la Incidencia" required={true}
          multiline rows={4}
          onChanged={(valor) => { this.nuevaDescripcion = valor; }}
        />
      </div>
    );
  }

  private _onRenderBodyContentEdit = (): JSX.Element => {
    return (
      <div style={{ margin: '8px' }}>
        <TextField label="Id. Incidencia:" disabled value={this.state.incidenciaSelected && this.state.incidenciaSelected.Id && this.state.incidenciaSelected.Id.toString()} />
        <TextField label="Fecha Apertura" disabled value={this.state.incidenciaSelected && this.state.incidenciaSelected.Created && this.state.incidenciaSelected.Created.toString()} />
        <TextField label="Estado" disabled value={this.state.incidenciaSelected && this.state.incidenciaSelected.mango_estadoIncidencia && this.state.incidenciaSelected.mango_estadoIncidencia.toString()} />
        <TextField label="Titulo" disabled value={this.state.incidenciaSelected && this.state.incidenciaSelected.Title && this.state.incidenciaSelected.Title.toString()}
          onChanged={(valor) => { this.nuevoTitulo = valor; }}
        />
        <TextField label="Descripción de la Incidencia" required={true}
          multiline rows={4}
          description="La vida es una tómbola, tom, tom, tómbola"
          value={this.state.incidenciaSelected && this.state.incidenciaSelected.mango_descripcionIncidencia && this.state.incidenciaSelected.mango_descripcionIncidencia.toString()}
          onChanged={(valor) => { this.nuevaDescripcion = valor; }}
        />
      </div>
    );
  }

  private _onShowPanelNew = (): void => {
    this.nuevaDescripcion = "";
    this.nuevoTitulo = "";
    this.setState({ showPanelNew: true });
  }

  private _onShowPanelEdit = (): void => {
    if (this._selection.getSelectedCount() > 0) {
      this.nuevaDescripcion = this.state.incidenciaSelected.Title;
      this.nuevoTitulo = this.state.incidenciaSelected.mango_descripcionIncidencia;
      this.setState({ showPanelEdit: true });
    } else {
      this.nuevaDescripcion = "";
      this.nuevoTitulo = "";
      this.setState({ showPanelNew: true });
    }
  }

  private getFarItems = () => {
    return [
      {
        key: 'sort',
        name: 'Sort',
        iconProps: {
          iconName: 'SortLines'
        },
        onClick: () => this._messageBox("ATENCION", 'Has clicado el menú Sort')
      },
      {
        key: 'info',
        name: 'Info',
        iconProps: {
          iconName: 'Info'
        },
        iconOnly: true,
        onClick: () => this._messageBox("ATENCION", 'Has clicado el menú Info')
      }
    ];
  }
  private getOverlflowItems = () => {
    return [
      {
        key: 'sort',
        name: 'Sort',
        iconProps: {
          iconName: 'SortLines'
        },
        onClick: () => this._messageBox("ATENCION", 'Has clicado el menú Sort')
      },
      {
        key: 'info',
        name: 'Info',
        iconProps: {
          iconName: 'Info'
        },
        iconOnly: true,
        onClick: () => this._messageBox("ATENCION", 'Has clicado el menú Info')
      }
    ];
  }
  private getItems = () => {
    return [
      {
        key: 'nuevo',
        name: 'Nuevo',
        iconProps: {
          iconName: 'Add'
        },
        onClick: () => this._onShowPanelNew()
      },
      {
        key: 'edit',
        name: 'Editar',
        iconProps: {
          iconName: 'Edit'
        },
        onClick: () => this._onShowPanelEdit()
      },
      {
        key: 'borrar',
        name: 'Borrar',
        iconProps: {
          iconName: 'Delete'
        },
        onClick: () => this._menuBorrarIncidencia()
      }
    ];
  }

  private _onBtnCloseDlg() {
    this.setState({ dlgShow: false });
  }
}
