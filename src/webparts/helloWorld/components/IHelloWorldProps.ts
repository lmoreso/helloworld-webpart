import { BaseComponentContext } from "@microsoft/sp-component-base";
import { ITienda } from "../HelloWorldWebPart";

export interface IHelloWorldProps {
  description: string;
  test: string;
  test1: boolean;
  test2: string;
  test3: boolean;
  context: BaseComponentContext;
  tiendas: ITienda[];
}
