import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';

export default class Utiles {
    public static parseFechas(unaFecha: any): string {
        var sFecha = "";
        if (unaFecha.toDateString) {
            sFecha = unaFecha.toDateString();
        } else {
            sFecha = unaFecha.toString();
        }

        return (sFecha);

    }
}

export interface IMessageBoxProps {
    Titulo: string;
    Texto: string;
}

export interface IMessageBoxState {
    showDialog: boolean;
}

export class MessageBox extends React.Component<IMessageBoxProps, IMessageBoxState> {
    constructor(props: IMessageBoxProps) {
        super(props);
        this.state = {
            showDialog: false,
        };
    }
    public render(): React.ReactElement<IMessageBoxProps> {
      if (this.state.showDialog) {
        return (
            null
            );
      } else {
        return (null);
      }

    }
}
  

