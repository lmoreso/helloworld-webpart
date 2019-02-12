import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';

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



