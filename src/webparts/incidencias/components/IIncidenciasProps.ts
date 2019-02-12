import { IIncidencia } from "../IncidenciasWebPart";
import { BaseComponentContext } from "@microsoft/sp-component-base";

export interface IIncidenciasProps {
  context: BaseComponentContext;
  incidencias: IIncidencia[];
}

export interface IIncidenciasState {
  showPanelNew: boolean;
  showPanelEdit: boolean;
  showPanelDelete: boolean;
  incidenciaSelected: IIncidencia;
  dlgShow: boolean;
  dlgTitulo?: string;
  dlgTexto?: string;
  dlgShowBtnBorrar?: boolean;
  incidencias: IIncidencia[];
}