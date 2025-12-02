import {
  obligatoryRequredFields,
  obligatoryFieldsSchema,
} from "../core.schema";

export const loginSchema = {
  type: "object",
  properties: {
    ...obligatoryFieldsSchema,
  },
  required: [...obligatoryRequredFields],
};
