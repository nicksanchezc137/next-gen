import { FIELD_IMPLEMENTATION_TYPES } from "../constants";
import { Field } from "../types";
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
    inputValue?:string | number;
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
        <label className={labelClassName || ""}>
          {inputLabel || ""}
          {inputRequired ? "*" : ""}
        </label>
        <input
          onChange={onInputChange}
          placeholder={inputPlaceholder}
          name={inputName}
          type={inputType}
          className={inputClassName}
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
    inputClassName="bg-gray-50 px-4 py-2 w-full text-[1.2rem]"
    labelClassName="font-bold"
    inputLabel="${field.name}"
    inputPlaceholder="${field.name}"
    inputType="${getFieldTypeName(field.type, FIELD_IMPLEMENTATION_TYPES.UI)}"
    inputRequired={${field.required}}
    inputName="${field.name.toLowerCase()}"
    onInputChange={handleInputChange}
    inputValue={formData?.${field.name}}
  />`;
  },
  fileName: "Input.tsx",
};

export const Table = {
  contents: `import { useRouter } from "next/router";
  import React from "react";
  import { handleRequest } from "../utils/api.utils";
  import TableHead from "./TableHead";
  import TableRow from "./TableRow";
  type GenericObject = { [key: string]: any };
  export default function Table({
    values,
    apiController,
  }: {
    values: GenericObject[];
    apiController: string;
  }) {
    const router = useRouter();
    const headProps = () => {
      if (!values[0]) {
        return null;
      }
      let tableHeadProps: GenericObject = {};
      Object.keys(values[0]).forEach((key, i) => {
        tableHeadProps[\`value\${i + 1}\`] = key;
      });
      return tableHeadProps;
    };
  
    const rowProps = (row: GenericObject) => {
      if (!row) {
        return null;
      }
      let tableRowProps: GenericObject = {};
      Object.keys(row).forEach((key, i) => {
        tableRowProps[\`value\${i + 1}\`] = row[key];
      });
      return tableRowProps;
    };
    function deleteRecord(id: number) {
      handleRequest(\`\${apiController}?id=\${id}\`, "DELETE", {}).then((user: any) => router.reload());
    }
    return (
      <table className="w-full text-sm text-left text-gray-500">
        <TableHead {...headProps()} />
        <tbody>
          {values.map((value) => (
            <TableRow
              onDelete={() => deleteRecord(value.id)}
              editRoute={\`/\${apiController}/edit?id=\${value.id}\`}
              {...rowProps(value)}
              id={value.id}
              key={value.id}
            />
          ))}
        </tbody>
      </table>
    );
  }
   
`,
  instance: (modelName: string) => {
    const apiController = pluralize.plural(modelName).toLowerCase();
    return ` 
    <Table values={${apiController}} apiController = "${apiController}" />
   `;
  },
  fileName: "Table.tsx",
};

export const TableHead = {
  contents: `import React from "react";

  export default function TableHead({
    value1,
    value2,
    value3,
    value4,
    value5,
  }: {
    value1?: string | number;
    value2?: string | number;
    value3?: string | number;
    value4?: string | number;
    value5?: string | number;
  }) {
    return (
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="py-3 px-6">
            {value1 || ""}
          </th>
          <th scope="col" className="py-3 px-6">
            {value2 || ""}
          </th>
          <th scope="col" className="py-3 px-6">
            {value3 || ""}
          </th>
          {value4 ? (
            <th scope="col" className="py-3 px-6">
              {value4}
            </th>
          ) : null}
          {value5 ? (
            <th scope="col" className="py-3 px-6">
              {value5}
            </th>
          ) : null}
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
  import React from "react";
  
  export default function TableRow({
    id,
    value1,
    value2,
    value3,
    value4,
    value5,
    editRoute,
    onDelete,
  }: {
    id: number;
    value1?: string | number;
    value2?: string | number;
    value3?: string | number;
    value4?: string | number;
    value5?: string | number;
    editRoute?: string;
    onDelete: Function;
  }) {
    return (
      <tr className="bg-white border-b">
        <th
          scope="row"
          className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
        >
          {value1 || ""}
        </th>
        <td className="py-4 px-6">{value2 || ""}</td>
        <td className="py-4 px-6">{value3}</td>
        {value4 ? <td className="py-4 px-6">{value4 || ""}</td> : null}
        {value5 ? <td className="py-4 px-6">{value5 || ""}</td> : null}
        <td className="py-4 px-6">
          <Link href={editRoute || ""} legacyBehavior>
            <a className="font-medium text-indigo-600 hover:underline cursor-pointer">Edit</a>
          </Link>
        </td>
        <td className="py-4 px-6">
          <a
            onClick={() => onDelete(id)}
            className="font-medium text-indigo-600 hover:underline cursor-pointer"
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
  }: {
    onButtonClick: MouseEventHandler<HTMLButtonElement>;
    caption: string;
  }) {
    return (
      <button
        onClick={onButtonClick}
        className="w-full mt-5 bg-indigo-600 text-white py-2 rounded-sm font-semibold tracking-tight"
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

export const COMPONENT_LIST = [Input, Table, TableHead, TableRow, Button, Tile];
