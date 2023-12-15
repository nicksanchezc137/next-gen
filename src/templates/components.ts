import { FIELD_IMPLEMENTATION_TYPES } from "../constants";
import { Field, Model } from "../types";
import { getFieldTypeName } from "../utils/components.utils";
import { capitalizeFirstLetter } from "../utils/general.utils";
var pluralize = require("pluralize");

export const Input = {
  contents: `import React from "react";
  type InputProps = {
    onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
    inputPlaceholder?: string;
    inputName?: string;
    inputType?: string;
    inputClassName?: string;
    inputLabel?: string;
    inputId?: string | number;
    labelClassName?: string;
    inputContainerClassName?: string;
    inputRequired?: boolean;
    inputValue?: string | number;
  };
  export default function Input({
    onInputChange,
    inputPlaceholder,
    inputName,
    inputType,
    inputClassName,
    inputLabel,
    inputId,
    labelClassName,
    inputContainerClassName,
    inputRequired,
    inputValue,
    ...props
  }: InputProps) {
    return (
      <div className={inputContainerClassName}>
        <label className={\`text-white \${labelClassName || ""}\`}>
          {inputLabel || ""}
          {inputRequired ? "*" : ""}
        </label>
        <input
          onChange={onInputChange}
          placeholder={inputPlaceholder}
          name={inputName}
          type={inputType}
          className={\`\${inputClassName} \${
            inputType == "submit"
              ? "max-w-[13rem] bg-white text-black px-10 py-2 rounded-full font-semibold tracking-tight"
              : "border-b border-[#A3BEAE] outline-none bg-[#5B8B6C] text-white placeholder-[#A3BEAE]"
          }\`}
          value={inputValue}
          {...props}
        />
      </div>
    );
  }
  
`,
  instance: (field: Field) => {
    return ` 
  <Input
    inputContainerClassName="w-full mt-10"
    inputClassName="px-4 py-2 w-full text-[1.2rem]"
    labelClassName="font-bold"
    inputLabel="${field.name}"
    inputPlaceholder="${field.name}"
    inputType="${getFieldTypeName(field.type, FIELD_IMPLEMENTATION_TYPES.UI)}"
    inputRequired={${field.required}}
    inputName="${field.name.toLowerCase()}"
    onInputChange={handleChange}
    inputValue={formData["${field.name}"]}
  />`;
  },
  fileName: "Input.tsx",
};

export const Select = {
  contents: `import React from "react";

  type SelectOption = { value: number; label: string };
  export default function Select({
    options,
    label,
    selectContainerClassName,
    selectClassName,
    labelClassName,
    selectName,
    onSelectChange,
    selectValue
  }: {
    options: SelectOption[];
    label: string;
    selectContainerClassName?: string;
    selectClassName?: string;
    labelClassName?: string;
    selectName?: string;
    onSelectChange?: React.ChangeEventHandler<HTMLSelectElement>;
    selectValue?:string | number;
  }) {
    return (
      <div className={\`\${selectContainerClassName || ""}\`}>
        <label className={\`\${labelClassName || ""} text-white\`}>{label}</label>
        <select
          name={selectName}
          value={selectValue}
          onChange={onSelectChange}
          className={\`\${
            selectClassName || ""
          } outline-none bg-[#5B8B6C] text-white\`}
        >
          <option>Select</option>
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  
`,
  instance: (field: Field) => {
    return ``;
  },
  fileName: "Select.tsx",
};
export const DateTimePicker = {
  contents: `import React, { ChangeEvent, useEffect, useState } from "react";
  import {  formatServerDate } from "../utils/general.utils";
  
  export default function DateTimePicker({
    onValueChange,
    initialValue,
    dateTimeInputContainerClassName,
    labelClassName,
    dateTimeInputLabel,
    dateTimeInputRequired,
  }: {
    onValueChange: Function;
    initialValue: { date: string; time: string };
    dateTimeInputContainerClassName?: string;
    labelClassName?: string;
    dateTimeInputLabel?: string;
    dateTimeInputRequired?: boolean;
  }) {
    const [dateTime, setDateTime] = useState(initialValue);
  
    function onChange(event: ChangeEvent<HTMLInputElement>) {
      setDateTime({ ...dateTime, [event.target.name]: event.target.value });
    }
    useEffect(() => {
      const { date, time } = dateTime;
      onValueChange(formatServerDate(\`\${date} \${time}\`));
    }, [dateTime]);
  
    return (
      <div className={dateTimeInputContainerClassName}>
        <label className={\`w-full text-white \${labelClassName || ""}\`}>
          {dateTimeInputLabel || ""}
          {dateTimeInputRequired ? "*" : ""}
        </label>
        <div className="w-full">
        <input
          value={dateTime.date}
          onChange={onChange}
          name="date"
          className="w-1/2 border-b border-[#A3BEAE] outline-none bg-[#5B8B6C] text-white placeholder-[#A3BEAE]"
          type="date"
        />
        <input
          value={dateTime.time}
          onChange={onChange}
          name="time"
          className="w-1/2 border-b border-[#A3BEAE] outline-none bg-[#5B8B6C] text-white placeholder-[#A3BEAE]"
          type="time"
        />
        </div>
       
      </div>
    );
  }
  
`,
  instance: (field: Field, isCreate: boolean) => {
    return `  <DateTimePicker
    dateTimeInputLabel="${field.name}"
    dateTimeInputContainerClassName="w-full mt-10"
    initialValue={${
      isCreate ? "getCurrentDateTime()" : `formData["${field.name}"]`
    }}
    onValueChange={(value: any) => setFormData({ ...formData })}
  />`;
  },
  fileName: "DateTimePicker.tsx",
};
export const TextArea = {
  contents: `import React from "react";
  type TextareaProps = {
    onTextareaChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    textareaPlaceholder?: string;
    textareaName?: string;
    textareaType?: string;
    textareaClassName?: string;
    textareaLabel?: string;
    textareaId?: string | number;
    labelClassName?: string;
    textareaContainerClassName?: string;
    textareaRequired?: boolean;
    textareaValue?: string | number;
  };
  export default function Textarea({
    onTextareaChange,
    textareaPlaceholder,
    textareaName,
    textareaType,
    textareaClassName,
    textareaLabel,
    textareaId,
    labelClassName,
    textareaContainerClassName,
    textareaRequired,
    textareaValue,
    ...props
  }: TextareaProps) {
    return (
      <div className={textareaContainerClassName}>
        <label className={\`text-white \${labelClassName || ""}\`}>
          {textareaLabel || ""}
          {textareaRequired ? "*" : ""}
        </label>
        <textarea
          onChange={onTextareaChange}
          placeholder={textareaPlaceholder}
          name={textareaName}
          rows={5}
          className={\`\${textareaClassName} \${
            textareaType == "submit"
              ? "max-w-[13rem] bg-white text-black px-10 py-2 rounded-full font-semibold tracking-tight"
              : "border border-[#A3BEAE] outline-none bg-[#5B8B6C] text-white placeholder-[#A3BEAE]"
          }\`}
          value={textareaValue}
          {...props}
        />
      </div>
    );
  }
  

`,
  instance: (field: Field) => {
    return `   <Textarea
    textareaContainerClassName="w-full mt-10"
    textareaClassName="px-4 py-2 w-full text-[1.2rem]"
    labelClassName="font-bold"
    textareaLabel="${field.name}"
    textareaPlaceholder="${field.name}"
    textareaType="text"
    textareaRequired={true}
    textareaName="${field.name}"
    onTextareaChange={(event)=>setFormData({...formData,${field.name}:event.target.value})}
    textareaValue={formData["${field.name}"]}
  />`;
  },
  fileName: "TextArea.tsx",
};

//TODO:add 2 props to headers ie isVisibleOnList and idIdentifier
//TODO: add 2 props to rows ie isVisibleOnList and idIdentifier

export const Table = {
  contents: `import { useRouter } from "next/router";
  import React, { useEffect, useState } from "react";
  import { handleRequest } from "../utils/api.utils";
  import TableHead from "./TableHead";
  import TableRow from "./TableRow";
  import {
    getFieldProperties,
    getHeaderProperties,
    getModel,
  } from "../utils/general.utils";
  import { TIME_STAMP_FIELDS } from "../constants/general.constants";
  import { Field } from "../types/general.types";
  type GenericObject = { [key: string]: any };
  const PAGE_LENGTH = 10;
  export default function Table({
    values,
    apiController,
    drillable,
  }: {
    values: GenericObject[];
    apiController: string;
    drillable?: boolean;
  }) {
    const router = useRouter();
    const [rows, setRows] = useState<GenericObject>([]);
    const [page, setPage] = useState(1);
  
    useEffect(() => {
      const end = PAGE_LENGTH * page;
      const start = end - PAGE_LENGTH;
      let currentRows = values.slice(start, end);
      setRows(currentRows);
    }, [page, values]);
    
    const headerProps = () => {
      if (values.length) {
        let headers: string[] = [];
        rowProps(values[0])
          .filter((field: Field) => field.visibleOnList)
          .forEach((field: Field) => {
            headers.push(field.name || "");
          });
        return headers;
      } else {
        //We don't have records at this point so we might as well return the headers from the config file
        return getHeaderProperties(apiController) || [];
      }
    };
  
    const rowProps = (row: GenericObject) => {
      if (!row) {
        return null;
      }
      let enhancedFields: any = [];
      Object.keys(row).forEach((key, i) => {
        const fieldInfo = getFieldProperties(key, apiController);
        console.log(key,fieldInfo )
        enhancedFields.push({
          name: key,
          value: row[key],
          isIdentifier: fieldInfo?.isIdentifier,
          visibleOnList:TIME_STAMP_FIELDS.includes(fieldInfo?.name  || "")? //TODO: merge label and name
            getModel(apiController)?.includeTimeStamps:fieldInfo?.visibleOnList,
          required: fieldInfo?.required,
        });
      });
      return enhancedFields;
    };
    function deleteRecord(id: number) {
      handleRequest(\`\${apiController}?id=\${id}\`, "DELETE", {}).then((user: any) =>
        router.reload()
      );
    }
    const isLastPage = () => page === Math.ceil(values.length / PAGE_LENGTH);
  
    const isFirstPage = () => page === 1;
  
    function nextPage() {
      const currentPage = isLastPage() ? page : page + 1;
      setPage(currentPage);
    }
    function prevPage() {
      const currentPage = isFirstPage() ? page : page - 1;
      setPage(currentPage);
    }
    return (
      <div>
      <table className="w-full text-sm text-left text-gray-500">
      <TableHead headers={headerProps()} />
        <tbody>
        {rows?.map((value: GenericObject) => (
            <TableRow
              drillable={drillable}
              apiController={apiController}
              onDelete={() => deleteRecord(value.id)}
              editRoute={\`/\${apiController}/edit?id=\${value.id}\`}
              fields={rowProps(value)}
              id={value.id}
              key={value.id}
            />
          ))}
        </tbody>
      </table>
      <div className="text-white font-bold w-full flex justify-between">
        <span
          onClick={prevPage}
          className={\`\${isFirstPage() ? "text-[#A3BEAE]" : "cursor-pointer"}\`}
        >
          {"<"}{" "}
        </span>
        <span
          onClick={nextPage}
          className={\`\${isLastPage() ? "text-[#A3BEAE]" : "cursor-pointer"}\`}
        >
          {">"}{" "}
        </span>
      </div>
    </div>
    );
  }
   
`,
  instance: (modelName: string, hasChildren: boolean) => {
    const apiController = pluralize.plural(modelName).toLowerCase();
    return ` 
    <Table ${
      hasChildren ? "drillable" : ""
    } values={${apiController}} apiController = "${apiController}" />
   `;
  },
  fileName: "Table.tsx",
};

export const TableHead = {
  contents: `import React from "react";
  export default function TableHead({ headers }: { headers: string[] }) {
    return (
      <thead className="text-xs text-white uppercase">
        <tr>
          {headers
            .map((name) => (
              <th scope="col" className="py-3 px-6">
                {name || ""}
              </th>
            ))}
  
          <th scope="col" className="py-3 px-6">
            Action
          </th>
          <th scope="col" className="py-3 px-6">
            Action
          </th>
        </tr>
      </thead>
    );
  }
`,
  instance: () => {
    return ``;
  },
  fileName: "TableHead.tsx",
};

export const TableRow = {
  contents: `import Link from "next/link";
  import { useRouter } from "next/router";
  import React from "react";
  import { formatDate, isDateTime } from "../utils/general.utils";
  import { Field } from "../types/general.types";
  
  export default function TableRow({
    id,
    fields,
    editRoute,
    onDelete,
    drillable,
    apiController,
  }: {
    id: number;
    fields: Field[];
    editRoute?: string;
    drillable?: boolean;
    onDelete: Function;
    apiController: string;
  }) {
    const router = useRouter();
    const infoPath = \`/\${apiController}/info\`;
  
    function formatValue(value: string | number | undefined) {
      if (value && isDateTime(value)) {
        return formatDate(value);
      }
      return value;
    }
    function renderFields() {
      return fields
        .filter((field) => field.visibleOnList)
        .map(({ isIdentifier, value }) => {
          return drillable && isIdentifier ? (
            <td
              onClick={() =>
                router.push({
                  pathname: infoPath,
                  query: {
                    id,
                  },
                })
              }
              className="py-4 px-6 text-[#FFEECC] hover:underline cursor-pointer"
            >
              {formatValue(value) || ""}
            </td>
          ) : (
            <td className="py-4 px-6">{formatValue(value) || ""}</td>
          );
        });
    }
    return (
      <tr className="border-b text-white">
        {renderFields()}
        <td className="py-4 px-6">
          <Link
            href={editRoute || ""}
            legacyBehavior
            className="border border-white"
          >
            <a className="font-medium text-[#FFEECC] hover:underline cursor-pointer">
              Edit
            </a>
          </Link>
        </td>
        <td className="py-4 px-6">
          <a
            onClick={() => onDelete(id)}
            className="font-medium text-[#FFEECC] hover:underline cursor-pointer"
          >
            Delete
          </a>
        </td>
      </tr>
    );
  }
  
`,
  instance: () => {
    return ``;
  },
  fileName: "TableRow.tsx",
};

export const Button = {
  contents: `import React, { MouseEventHandler } from "react";

  export default function Button({
    onButtonClick,
    caption,
    isLight,
  }: {
    onButtonClick: MouseEventHandler<HTMLButtonElement>;
    caption: string;
    isLight?: boolean;
  }) {
    return (
      <button
        onClick={onButtonClick}
        className={\`\${
          isLight ? "border border-white bg-[#5B8B6C] text-white" : "bg-white"
        } max-w-[13rem] text-black px-10 py-2 rounded-full font-semibold tracking-tight\`}
      >
        {caption}
      </button>
    );
  }  
`,
  instance: () => {
    return ``;
  },
  fileName: "Button.tsx",
};

export const Tile = {
  contents: `import Link from "next/link";
  import React, { useEffect, useState } from "react";
  import { handleRequest } from "../utils/api.utils";
  
  export default function Tile({
    name,
    controllerName,
  }: {
    name: string;
    controllerName: string;
  }) {
    type GenericObject = { [key: string]: any };
    const [count, setCount] = useState<number>(0);
    useEffect(() => {
      handleRequest(\`/\${controllerName}\`, "GET", {}).then((resp: any) => {
        setCount(resp.length);
      });
    }, []);
    return (
      <Link href={\`/\${controllerName}/\`} legacyBehavior>
        <div className="bg-indigo-600 w-[10rem] h-[10rem] rounded-md flex items-center justify-center flex-col cursor-pointer">
          <span className="text-white font-bold text-[1.5rem]">{name}</span>
          <span className="text-white font-bold text-[1.2rem]">{count}</span>
        </div>
      </Link>
    );
  }
   
`,
  instance: (modelName: string) => {
    const apiController = pluralize.plural(modelName).toLowerCase();
    return ` <Tile controllerName='${apiController}' name='${capitalizeFirstLetter(
      apiController
    )}'/>`;
  },
  fileName: "Tile.tsx",
};
function getModelMenus(models: Model[]) {
  return models
    .map((model) => {
      return `{ label: "${pluralize.plural(
        model.name
      )}", destination: "/${pluralize.plural(model.name).toLowerCase()}" }`;
    })
    .join(",");
}
export const MainLayout = (models: Model[]) => {
  return {
    contents: `import React, { ReactHTML } from "react";
  import SideMenu from "./SideMenu";
  
  export default function MainLayout({
    children,
  }: {
    children: JSX.Element | JSX.Element[];
  }) {
    return (
      <div className="bg-[#5B8B6C] w-full flex items-center justify-center">
        <div className="xl:max-w-[75rem] md:w-[75%] w-full flex items-start mt-[4rem] mb-10">
          <SideMenu
            menus={[
              ${getModelMenus(models)}
            ]}
          />
          {children}
        </div>
      </div>
    );
  }
  
   
`,
    instance: "",
    fileName: "MainLayout.tsx",
  };
};

export const SideMenu = {
  contents: `import React, { useEffect, useState } from "react";
  import { Menu } from "../types/general.types";
  import Link from "next/link";
  import { useRouter } from "next/router";
  
  export default function SideMenu({ menus }: { menus: Menu[] }) {
    const [currentRoute, setCurrentRoute] = useState("");
    const router = useRouter();
    useEffect(() => {
      if (router.isReady) {
        setCurrentRoute(router.pathname);
      }
    }, []);
    return (
      <ul className="top-[15%] left-[8%] absolute">
        {menus.map(({ destination, label }, i) => (
          <li key={\`\${i}-\${label}\`}>
            <Link
              href={destination}
              className={\`font-bold  text-[1.5rem] \${
                currentRoute == destination ? "text-white" : "text-[#A3BEAE]"
              }\`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
    
`,
  instance: "",
  fileName: "SideMenu.tsx",
};

export const COMPONENT_LIST = (models: Model[]) => [
  Input,
  Table,
  TableHead,
  TableRow,
  Button,
  Tile,
  MainLayout(models),
  SideMenu,
  Select,
  DateTimePicker,
  TextArea,
];
