import { Model } from "../types";
import { capitalizeFirstLetter } from "../utils/general.utils";
import { Table } from "./components";

var pluralize = require("pluralize");

const CREATE_PAGE_TEMPLATE = (
  fieldsMarkUp: string,
  pageType: string,
  modelName: string,
  parentModels?: string[]
) => {
  const componentName = "create";
  const controllerName = pluralize.plural(modelName).toLowerCase();
  const parentModelMarkUp =
    parentModels && parentModels?.length
      ? `["${parentModels
          ?.map(
            (parentModel) => `${pluralize.plural(parentModel).toLowerCase()}`
          )
          .join('","')}"]`
      : "[]";
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
    import Select from "../../components/Select";
    import DateTimePicker from "../../components/DateTimePicker";
    import { getCurrentDateTime, validateForm } from "../../utils/general.utils";
    import Textarea from "../../components/TextArea";
    var pluralize = require("pluralize"); 
    type GenericObject = { [key: string]: any };
    const PARENT_MODELS:string[] = ${parentModelMarkUp};
    const ${componentName}: NextPage = () => {
      const router = useRouter();
      const [formData, setFormData] = useState<GenericObject>({});
      const [parentModelOptions, setParentModelOptions] = useState<GenericObject>(
        {}
      );
      const [validationError, setValidationError] = useState("");
      const handleChange = (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
      ) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      };
      function onSubmit(formEvent: FormEvent) {
        formEvent.preventDefault();
        validateFields();
      }
      useEffect(() => {
        Promise.all(
          PARENT_MODELS.map((model) => fetchParentModelOptions(model))
        ).then((resp) => {
          let modelOptionsObj = {}
          resp.forEach((modelOptions: any, i) => {
            modelOptionsObj = {
              ...modelOptionsObj,
              [PARENT_MODELS[i]]: modelOptions?.map(
                ({ id, name }: { id: number; name: string }) => {
                  return {
                    value: id,
                    label: name,
                  };
                }
              ),
            }
            setParentModelOptions(modelOptionsObj);
          });
        });
      }, []);
    
      function fetchParentModelOptions(parentModelName: string) {
        return new Promise((resolve, reject) => {
          handleRequest(parentModelName, "GET", formData)
            .then((resp) => {
              resolve(resp);
            })
            .catch((err) => reject(err));
        });
      }
      function saveData() {
        handleRequest("${controllerName}", "POST", formData)
        .then((resp) => {
          router.push("/${controllerName}");
        })
        .catch((err) => alert(err));
      }
      function onBack(e: FormEvent) {
        e.preventDefault();
        router.back();
      }
      function validateFields() {
        let formErrors = validateForm("applications", formData);
        if (formErrors.length) {
          setValidationError(\`Missing value(s):\${formErrors.join(",")}.\`);
        } else {
          saveData();
        }
      }
    
      return (
        <MainLayout hideSideMenu>
        <div className="w-full min-h-[100vh] flex items-start justify-center">
        <form
          onSubmit={onSubmit}
          className="w-[30rem] flex items-start flex-col px-4 text-black"
        >
            <h1 className="font-bold text-white text-[2.5rem]">Create ${pluralize.singular(modelName)}</h1>
            <div className="text-[#FF6347] mt-3">{validationError}</div>

          {PARENT_MODELS.map((parentModel, i) => {
            const selectKey = \`\${pluralize.singular(parentModel)}_id\`;

            return (
              <Select
                key={\`\${parentModel}-\${i}\`}
                labelClassName="font-bold"
                selectContainerClassName="w-full mt-10"
                selectClassName="px-4 py-2 w-full text-[1.2rem]"
                label={pluralize.singular(parentModel)}
                selectValue={formData[selectKey]}
                onSelectChange={handleChange}
                selectName={selectKey}
                options={parentModelOptions[parentModel] || []}
              />
            );
          })}
    
             ${fieldsMarkUp}
    
            <div className="flex mt-10 justify-between w-full">
            <Button
              isLight
              caption="Back"
              onButtonClick={onBack}
            />
            <Input inputValue="Submit" inputType="submit" inputClassName="w-full cursor-pointer" />
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
  modelName: string,
  parentModels?: string[]
) => {
  const componentName = "edit";
  const controllerName = pluralize.plural(modelName).toLowerCase();
  const parentModelMarkUp =
    parentModels && parentModels?.length
      ? `["${parentModels
          ?.map(
            (parentModel) => `${pluralize.plural(parentModel).toLowerCase()}`
          )
          .join('","')}"]`
      : "[]";
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
    import Select from "../../components/Select";
    import DateTimePicker from "../../components/DateTimePicker";
    import { getCurrentDateTime, validateForm } from "../../utils/general.utils";
    import Textarea from "../../components/TextArea";  
    var pluralize = require("pluralize");

    type GenericObject = { [key: string]: any };
    const PARENT_MODELS:string[] = ${parentModelMarkUp};

    const ${componentName}: NextPage = () => {
      const router = useRouter();
      const { id } = router.query;
      const [formData, setFormData] = useState<GenericObject>({});
      const [parentModelOptions, setParentModelOptions] = useState<GenericObject>(
        {}
      );
      const [validationError, setValidationError] = useState("");
      useEffect(() => {
        if (router.isReady) {
          handleRequest(\`${controllerName}?id=\${id}\`, "GET", {}).then((resp: any) => {
            setFormData(resp);
          });
        }
      }, [router.isReady]);
      useEffect(() => {
        Promise.all(
          PARENT_MODELS.map((model) => fetchParentModelOptions(model))
        ).then((resp) => {
          let modelOptionsObj = {}
          resp.forEach((modelOptions: any, i) => {
            modelOptionsObj = {
              ...modelOptionsObj,
              [PARENT_MODELS[i]]: modelOptions?.map(
                ({ id, name }: { id: number; name: string }) => {
                  return {
                    value: id,
                    label: name,
                  };
                }
              ),
            }
            setParentModelOptions(modelOptionsObj);
          });
        });
      }, []);
      function fetchParentModelOptions(parentModelName: string) {
        return new Promise((resolve, reject) => {
          handleRequest(parentModelName, "GET", formData)
            .then((resp) => {
              resolve(resp);
            })
            .catch((err) => reject(err));
        });
      }
    
     const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
       setFormData({ ...formData, [event.target.name]: event.target.value });
      };
      function onSubmit(formEvent: FormEvent) {
        formEvent.preventDefault();
        validateFields();
      }
      function saveData(){
        handleRequest(\`${controllerName}?id=\${id}\`, "PUT", formData)
          .then((resp) => {
            router.push("/${controllerName}");
          })
          .catch((err) => alert(err));
      }
      function onBack(e: FormEvent) {
        e.preventDefault();
        router.back();
      }
      function validateFields() {
        let formErrors = validateForm("applications", formData);
        if (formErrors.length) {
          setValidationError(\`Missing value(s):\${formErrors.join(",")}.\`);
        } else {
          saveData();
        }
      }
    
      return (
        <MainLayout hideSideMenu>
        <div className="w-full min-h-[100vh] flex items-start justify-center">
          <form
            onSubmit={onSubmit}
            className="w-[30rem] flex items-start flex-col px-4 text-black"
          >
          <h1 className="text-white text-[2.5rem] font-bold">Edit ${modelName}</h1>
          <div className="text-[#FF6347] mt-3">{validationError}</div>
          

          {PARENT_MODELS.map((parentModel, i) => {
            const selectKey = \`\${pluralize.singular(parentModel)}_id\`;
            return (
              <Select
                key={\`\${parentModel}-\${i}\`}
                labelClassName="font-bold"
                selectContainerClassName="w-full mt-10"
                selectClassName="px-4 py-2 w-full text-[1.2rem]"
                label={pluralize.singular(parentModel)}
                onSelectChange={handleChange}
                selectValue={formData[selectKey]}
                selectName={selectKey}
                options={parentModelOptions[parentModel] || []}
              />
            );
          })}

    
             ${fieldsMarkUp}
    
            <div className="flex mt-10 justify-between w-full">
            <Button isLight caption="Back" onButtonClick={onBack} />

            <Input inputType="submit" inputValue="Submit" inputClassName="w-full cursor-pointer" />
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

const READ_PAGE_TEMPLATE = (modelName: string, childModels?: string[]) => {
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
        <div className="w-full ml-7 flex flex-col items-start justify-start">
        <div className="w-full flex items-center justify-between w-full">
          <h1 className="text-white text-[2.5rem] font-bold">${controllerName}</h1>
          <Button caption="Add ${modelName}" onButtonClick={()=>router.push("/${controllerName}/create")}/>
        </div>
        <div className="overflow-x-auto relative sm:rounded-lg w-full">
        ${Table.instance(
          modelName,
          childModels != undefined && childModels?.length > 0
        )}
        </div>
        </div>

        </MainLayout>
      );
    };
    
    export default ${componentName};
    `,
  };
};
function childMenus(childModels: string[]) {
  return childModels.map((childModel) => {
    let childMenuName = pluralize.plural(childModel).toLocaleLowerCase();
    return `<h1
    onClick={() => setActiveModel("${childMenuName}")}
    className={\`cursor-pointer text-[2.5rem] font-bold \${
      activeModel == "${childMenuName}" ? "" : "text-[#A3BEAE]"
    }\`}
  >
    ${capitalizeFirstLetter(childMenuName)}
  </h1>`;
  }).join("");
}
const INFO_PAGE_TEMPLATE = (modelName: string, childModels: string[]) => {
  const defaultChildModel = pluralize
    .plural(childModels.length ? childModels[0] : "")
    .toLowerCase();

  return {
    fileName: "info.tsx",
    contents: `import type { NextPage } from "next";
    import { useEffect, useState } from "react";
    import { useRouter } from "next/router";
    import Table from "../../components/Table";
    import { handleRequest } from "../../utils/api.utils";
    import MainLayout from "../../components/MainLayout";
    import Button from "../../components/Button";
    var pluralize = require("pluralize");
    type GenericObject = { [key: string]: any };
    const Info: NextPage = () => {
      const router = useRouter();
      const [data, setData] = useState<GenericObject[]>([]);
      const [activeModel, setActiveModel] = useState("${defaultChildModel}");
      const [parentModel, setParentModel] = useState("");
    
      useEffect(() => {
        if (router.isReady) {
          const parentModel = router.pathname.split("/")[1];
          setParentModel(pluralize.singular(parentModel));
        }
      }, [router.isReady]);
    
      useEffect(() => {
        if (parentModel) {
          handleRequest(
            \`\${activeModel}?\${parentModel}_id=\${router.query.id}\`,
            "GET",
            {}
          ).then((data: any) => {
            setData(data);
          });
        }
      }, [activeModel, parentModel]);
    
      return (
        <MainLayout>
          <div className="w-full ml-7 flex flex-col items-start justify-start">
            <div className="w-full flex items-start justify-between text-[#FFEECC]">
              ${childMenus(childModels)}
            </div>
            <div className="w-full flex justify-end">
            <Button
                caption={\`Add \${pluralize.singular(activeModel)}\`}
                onButtonClick={() => router.push(\`/\${activeModel}/create\`)}
              />
            </div>
          
            <div className="overflow-x-auto relative sm:rounded-lg w-full">
              <Table values={data} apiController={activeModel} />
            </div>
          </div>
        </MainLayout>
      );
    };
    
    export default Info;
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
function getModelEntities(models: Model[]) {
  return models
    .map((model) => {
      return `{ name: "${pluralize.plural(
        model.name
      )}", controllerName: "/${pluralize.plural(model.name).toLowerCase()}" }`;
    })
    .join(",");
}
const HOME_PAGE = (models:Model[]) => {
  return {
    fileName: "index.tsx",
    contents: `import React from 'react'
    import MainLayout from "../components/MainLayout";
    import Tile from "../components/Tile";
    import { PROJECT_NAME } from "../constants/general.constants";

    const entities = [
      ${getModelEntities(models)}
    ];

    export default function Home() {
      return (
        <MainLayout hideSideMenu>
        <section className="w-full flex flex-col">
        <h1 className="text-white font-bold text-[2rem] text-center">
          welcome to <span className="text-[#FFEECC]">{PROJECT_NAME}</span>
        </h1>
        <div className="flex justify-between w-full flex-wrap mt-[2rem]">
          {entities.map((entity) => (
            <Tile key ={entity.name} {...entity} />
          ))}
        </div>
        </section>
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
  INFO_PAGE_TEMPLATE,
};
