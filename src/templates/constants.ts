export const GENERAL_CONSTANTS = () => {
    return {
      contents: `
      export const MODEL_SETUP = [
        {
          name: "cars",
          operations: {
            CREATE: true,
            READ: true,
            UPDATE: true,
            DELETE: true,
          },
          fields: [
            {
              name: "price",
              required: true,
              visibleOnList: true,
              type: "number",
              isIdentifier: false,
            },
            {
              name: "year",
              required: true,
              visibleOnList: true,
              type: "number",
              isIdentifier: false,
            },
          ],
          includeTimeStamps: true,
          belongsTo: ["models", "makes"],
        },
        {
          name: "models",
          operations: {
            CREATE: true,
            READ: true,
            UPDATE: true,
            DELETE: true,
          },
          fields: [
            {
              name: "name",
              required: true,
              visibleOnList: true,
              type: "text",
              isIdentifier: true,
            },
            {
              name: "description",
              required: true,
              visibleOnList: true,
              type: "long_text",
              isIdentifier: false,
            },
          ],
          includeTimeStamps: true,
          belongsTo: [],
        },
        {
          name: "makes",
          operations: {
            CREATE: true,
            READ: true,
            UPDATE: true,
            DELETE: true,
          },
          fields: [
            {
              name: "name",
              required: true,
              visibleOnList: true,
              type: "text",
              isIdentifier: true,
            },
            {
              name: "description",
              required: true,
              visibleOnList: true,
              type: "long_text",
              isIdentifier: false,
            },
          ],
          includeTimeStamps: true,
          belongsTo: [],
        },
      ];
      
      export const TIME_STAMP_FIELDS = ["updated_at", "deleted_at", "created_at"];
      
      `,
      fileName: "general.constants.ts",
      path: "path",
    };
  };