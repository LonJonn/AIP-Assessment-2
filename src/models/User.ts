import { DocumentType, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
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

  @prop()
  public points!: number;

  public asEmbedded(this: DocumentType<UserSchema>): EmbeddedUserSchema {
    return this.toJSON();
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

  @prop()
  public points!: number;
}

export default User;
