import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import { NextApiRequest } from "next";

// =================== Assign custom validators =====================

declare module "yup" {
  interface Schema<T> {
    formLabel(label: string): this;
  }

  interface StringSchema<T> {
    isMongoID(): this;
  }
}

yup.addMethod(yup.mixed, "formLabel", function (this: yup.Schema<any>, label: string) {
  return this.when("$form", (form: boolean, schema: yup.Schema<any>) => {
    return form ? schema.label(label) : schema;
  });
});

yup.addMethod(yup.string, "isMongoID", function (this: yup.StringSchema) {
  return this.test("isMongoID", "${path} is not a valid Object ID", function (val) {
    return isValidObjectId(val);
  });
});

// =================== Validator HOF =====================

type ValidatorActions = "create" | "updateFavour";

export default function createValidator<T>(schema: yup.Schema<T>) {
  return function (req: NextApiRequest, action?: ValidatorActions) {
    return schema.validate(
      { ...req.query, ...req.body },
      { abortEarly: false, stripUnknown: true, context: { [action]: true } }
    );
  };
}

// Re-export yup and use this reference to ensure custom validators are assigned
export { yup };
