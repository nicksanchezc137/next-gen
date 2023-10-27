import { FIELD_TYPES, FIELD_TYPE_MAPPING } from "../constants";
import { FieldImplementation } from "../types";

function getFieldTypeName(type: string, implementation: FieldImplementation) {
  type = type.toUpperCase();
  switch (type) {
    case FIELD_TYPES.BOOLEAN:
      return FIELD_TYPE_MAPPING.BOOLEAN[implementation];

    case FIELD_TYPES.DOUBLE:
      return FIELD_TYPE_MAPPING.DOUBLE[implementation];

    case FIELD_TYPES.NUMBER:
      return FIELD_TYPE_MAPPING.NUMBER[implementation];

    case FIELD_TYPES.TEXT:
      return FIELD_TYPE_MAPPING.TEXT[implementation];
      
    case FIELD_TYPES.LONG_TEXT:
      return FIELD_TYPE_MAPPING.TEXT[implementation];
  }
}

export { getFieldTypeName };
