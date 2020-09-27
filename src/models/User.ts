import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

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
