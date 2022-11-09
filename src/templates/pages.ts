import { capitalizeFirstLetter } from "../utils/general.utils";
import { Table } from "./components";

var pluralize = require("pluralize");

const CREATE_PAGE_TEMPLATE = (
  fieldsMarkUp: string,
  pageType: string,
  modelName: string
) => {
  const componentName = "create";
  const controllerName = pluralize.plural(modelName).toLowerCase();
  return {
    fileName: `${componentName}.tsx`,
    contents: `
    import type { NextPage } from "next";
    import { useRouter } from "next/router";
    import { ChangeEvent, FormEvent, useState } from "react";
    import Input from "../../components/Input";
    import { handleRequest } from "../../utils/api.utils";
    type GenericObject = { [key: string]: any };
    const ${componentName}: NextPage = () => {
      const router = useRouter();
      const [formData, setFormData] = useState<GenericObject>({});
    
      const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      };
      function onSubmit(formEvent: FormEvent) {
        formEvent.preventDefault();
        handleRequest("${controllerName}", "POST", formData)
        .then((resp) => {
          router.push("/${controllerName}");
        })
        .catch((err) => alert(err));
      }
    
      return (
        <div className="w-full min-h-[100vh] bg-gray-100 flex items-start justify-center">
          <form
            onSubmit={onSubmit}
            className="bg-white w-[30rem] mt-[10rem] flex items-center flex-col p-4 text-black"
          >
            <h1 className="font-bold uppercase">Create ${modelName}</h1>
    
             ${fieldsMarkUp}
    
            <Input
              inputType="submit"
              inputContainerClassName="w-full mt-5 bg-indigo-600 text-white py-2 rounded-sm font-semibold tracking-tight"
              inputClassName="w-full cursor-pointer"
            />
          </form>
        </div>
      );
    };
    
    export default ${componentName};    
`,
  };
};
const UPDATE_PAGE_TEMPLATE = (
  fieldsMarkUp: string,
  pageType: string,
  modelName: string
) => {
  const componentName = "edit";
  const controllerName = pluralize.plural(modelName).toLowerCase();
  return {
    fileName: `${componentName}.tsx`,
    contents: `
    import type { NextPage } from "next";
    import { useRouter } from "next/router";
    import { ChangeEvent, FormEvent, useState, useEffect } from "react";
    import Input from "../../components/Input";
    import { handleRequest } from "../../utils/api.utils";
    type GenericObject = { [key: string]: any };
    const ${componentName}: NextPage = () => {
      const router = useRouter();
      const { id } = router.query;
      const [formData, setFormData] = useState<GenericObject>({});
      useEffect(() => {
        if (router.isReady) {
          handleRequest(\`${controllerName}?id=\${id}\`, "GET", {}).then((resp: any) => {
            setFormData(resp);
          });
        }
      }, [router.isReady]);
    
      const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      };
      function onSubmit(formEvent: FormEvent) {
        formEvent.preventDefault();
        handleRequest(\`${controllerName}?id=\${id}\`, "PUT", formData)
          .then((resp) => {
            router.push("/${controllerName}");
          })
          .catch((err) => alert(err));
      }
    
      return (
        <div className="w-full min-h-[100vh] bg-gray-100 flex items-start justify-center">
          <form
            onSubmit={onSubmit}
            className="bg-white w-[30rem] mt-[10rem] flex items-center flex-col p-4 text-black"
          >
            <h1 className="font-bold uppercase">Edit ${modelName}</h1>
    
             ${fieldsMarkUp}
    
            <Input
              inputType="submit"
              inputContainerClassName="w-full mt-5 bg-indigo-600 text-white py-2 rounded-sm font-semibold tracking-tight"
              inputClassName="w-full cursor-pointer"
            />
          </form>
        </div>
      );
    };
    
    export default ${componentName};    
`,
  };
};

const READ_PAGE_TEMPLATE = (modelName: string) => {
  const componentName = "Show";
  const controllerName = pluralize.plural(modelName).toLowerCase();
  return {
    fileName: "index.tsx",
    contents: `import type { NextPage } from "next";
    import { useEffect, useState } from "react";
    import { useRouter } from "next/router";
    import Table from "../../components/Table";
    import { handleRequest } from "../../utils/api.utils";
    import Button from "../../components/Button";
    type GenericObject = { [key: string]: any };
    const ${componentName}: NextPage = () => {
      const router = useRouter();
      const [${controllerName}, set${capitalizeFirstLetter(
      controllerName
    )}] = useState<GenericObject[]>([]);
         
      useEffect(() => {
        handleRequest("${controllerName}","GET",{}).then((${controllerName}:any)=>{
          set${capitalizeFirstLetter(controllerName)}(${controllerName});
        });
      }, []);
    
      return (
        <div className="w-full min-h-[100vh] bg-gray-100 flex items-start justify-center p-4">
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
          <Button caption="New" onButtonClick={()=>router.push("/${controllerName}/create")}/>
           ${Table.instance(modelName)}
          </div>
        </div>
      );
    };
    
    export default ${componentName};
    `,
  };
};

const MAIN_APP = () => {
  return {
    fileName: "_app.tsx",
    contents: `import '../styles/globals.css'
    import type { AppProps } from 'next/app'
    
    function MyApp({ Component, pageProps }: AppProps) {
      return <Component {...pageProps} />
    }
    
    export default MyApp;
    `,
    modelName: "",
  };
};

const HOME_PAGE = (instances: string) => {
  return {
    fileName: "index.tsx",
    contents: `import React from 'react'
    import Tile from '../components/Tile'
    
    export default function Home() {
      return (
        <div className='flex flex-wrap w-full p-[5rem] space-x-1'>
            ${instances}
        </div>
      )
    }
    
    `,
    modelName: "",
  };
};

export {
  CREATE_PAGE_TEMPLATE,
  UPDATE_PAGE_TEMPLATE,
  READ_PAGE_TEMPLATE,
  MAIN_APP,
  HOME_PAGE
};
