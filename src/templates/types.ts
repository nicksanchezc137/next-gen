export const GENERAL_TYPES = () => {
  return {
    contents: `
    export type Menu = {
      destination: string;
      label: string;
    };
    export type Field = {
      name:string;
      isIdentifier: boolean;
      visibleOnList: boolean;
      required: boolean;
      type:string;
      value?:string | number;
    };
    export type Header = {
        label:string;
        visibleOnList:boolean;
    }
    export type GeneralObject ={
      [key:string]:any
    }
    
      `,
    fileName: "general.types.ts",
    path: "path",
  };
};
