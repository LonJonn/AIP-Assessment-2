import { yup } from ".";

// =================== Shared =====================

const rewardSchema = yup.lazy((val) => {
  if (typeof val === "object") {
    const shape = {};

    for (const key in val) {
      shape[key] = yup.number().required().min(1);
    }

    return yup
      .object(shape)
      .formLabel("Rewards")
      .test("notEmpty", "${path} must not be empty", (val) => {
        const rewards = Object.keys(val);
        return rewards.length !== 0;
      });
  } else {
    return yup
      .object()
      .formLabel("Rewards")
      .when(["$create", "$updateFavour"], {
        is: (...params) => params.some((val) => val), // Either create or favour update action
        then: yup.object().required(),
      });
  }
});

// =================== User =====================

export const userValidation = yup.object({
  displayName: yup
    .string()
    .formLabel("Display Name")
    .when("$create", {
      is: true,
      then: yup.string().required().trim().min(4).max(30),
    }),
  email: yup.string().formLabel("Email").email().required().trim(),
  password: yup.string().formLabel("Password").trim().required().min(4),
  passwordRepeat: yup
    .string()
    .formLabel("Password Repeat")
    .when("$create", {
      is: true,
      then: yup
        .string()
        .required()
        .equals([yup.ref("password")], "Passwords do not match"),
    }),
  photoURL: yup.string().url().optional().trim(),
});

// ==================== Request ====================

export const requestValidation = yup.object({
  id: yup.string().when("$create", (create: boolean, schema: yup.StringSchema) => {
    return create ? schema : schema.trim().required().isMongoID();
  }),
  title: yup.string().formLabel("Title").strict(true).trim().min(10).max(90).when("$create", {
    is: true,
    then: yup.string().required(),
  }),
  description: yup
    .string()
    .formLabel("Description")
    .strict(true)
    .trim()
    .min(20)
    .max(500)
    .when("$create", {
      is: true,
      then: yup.string().required(),
    }),
  rewards: yup.lazy((val) => {
    if (typeof val === "object") {
      const shape = {};

      for (const key in val) {
        shape[key] = yup.number().required().min(1);
      }

      return yup.object(shape).test("notEmpty", "${path} must not be empty", (val) => {
        const rewards = Object.keys(val);
        return rewards.length !== 0;
      });
    } else {
      return yup.object().when("$create", {
        is: true,
        then: yup.object().required(),
      });
    }
  }),
});

// ==================== Evidence  ====================

export const evidenceSchema = yup.object({
  evidence: yup.mixed().required("Please provide a file."),
});

// ==================== Favour ====================

export const favourValidation = yup.object({
  id: yup.string().when("$create", {
    is: false,
    then: yup.string().required().trim().isMongoID(),
  }),
  debtor: yup.string().formLabel("Debtor").when("$create", {
    is: true,
    then: yup.string().required(),
  }),
  recipient: yup.string().formLabel("Recipient").when("$create", {
    is: true,
    then: yup.string().required(),
  }),
  rewards: rewardSchema,
  initialEvidence: yup.string(), // todo
  evidence: yup.string(), // todo
});
