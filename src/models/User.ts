import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import * as yup from "yup";

// ==================== User Model ====================

@modelOptions({
  options: { customName: "User" },
})
export class UserSchema extends TimeStamps {
  @prop()
  public _id!: string;

  @prop({ unique: true })
  public email!: string;

  @prop()
  public displayName!: string;

  @prop()
  public photoURL?: string;

  public asEmbedded(this: DocumentType<UserSchema>): EmbeddedUserSchema {
    const { _id, email, displayName, photoURL } = this;

    return {
      _id,
      email,
      displayName,
      photoURL,
    };
  }
}

const User = getModelForClass(UserSchema);

// ==================== Embedded User ====================

export class EmbeddedUserSchema {
  @prop()
  public _id!: string;

  @prop()
  public email!: string;

  @prop()
  public displayName!: string;

  @prop()
  public photoURL?: string;
}

export default User;

// ==================== Embedded User ====================

export const updateUserValidation = yup.object({
  email: yup.string().email().optional(),
  displayName: yup.string().min(4).max(30).optional(),
  password: yup.string().min(8).optional(),
});
