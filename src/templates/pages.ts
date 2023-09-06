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
    import MainLayout from "../../components/MainLayout";
    import Button from "../../components/Button";
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
        <MainLayout>
        <div className="w-full min-h-[100vh] flex items-start justify-center">
        <form
          onSubmit={onSubmit}
          className="w-[30rem] flex items-center flex-col px-4 text-black"
        >
            <h1 className="font-bold text-white text-[2.5rem]">Create ${modelName}</h1>
    
             ${fieldsMarkUp}
    
            <div className="flex mt-10 justify-between w-full">
            <Button
              isLight
              caption="Back"
              onButtonClick={() => router.back()}
            />
            <Input inputType="submit" inputClassName="w-full cursor-pointer" />
          </div>
          </form>
        </div>
        </MainLayout>
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
    import MainLayout from "../../components/MainLayout";
    import Button from "../../components/Button";

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
        <MainLayout>
        <div className="w-full min-h-[100vh] flex items-start justify-center">
          <form
            onSubmit={onSubmit}
            className="w-[30rem] flex items-start flex-col px-4 text-black"
          >
          <h1 className="text-white text-[2.5rem] font-bold">Edit ${modelName}</h1>
    
             ${fieldsMarkUp}
    
            <div className="flex mt-10 justify-between w-full">
            <Button
              isLight
              caption="Back"
              onButtonClick={() => router.back()}
            />

            <Input inputType="submit" inputClassName="w-full cursor-pointer" />
          </div>
          </form>
        </div>
        </MainLayout>
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
    import MainLayout from "../../components/MainLayout";
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
        <MainLayout>
        <div className="w-full min-h-[100vh] ml-[10rem] flex flex-col items-start justify-start p-4 mt-[1.5rem]">
        <div className="w-full flex items-center justify-between w-full">
          <h1 className="text-white text-[2.5rem] font-bold">${controllerName}</h1>
          <Button caption="Add ${modelName}" onButtonClick={()=>router.push("/${controllerName}/create")}/>
        </div>
        <div className="overflow-x-auto relative sm:rounded-lg w-full">
        ${Table.instance(modelName)}
        </div>
        </div>

        </MainLayout>
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

const HOME_PAGE = () => {
  return {
    fileName: "index.tsx",
    contents: `import React from 'react'
    import MainLayout from "../components/MainLayout";
    
    export default function Home() {
      return (
        <MainLayout>
        <></>
        </MainLayout>
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
  HOME_PAGE,
};
