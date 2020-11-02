import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { UserSchema } from "./User";

export type Rewards = { [key: string]: number };

export interface FavourSchema extends Base {}

@modelOptions({ options: { customName: "Favour", allowMixed: Severity.ALLOW } })
export class FavourSchema extends TimeStamps {
  @prop()
  public creator!: UserSchema;

  @prop()
  public debtor!: UserSchema;

  @prop()
  public recipient!: UserSchema;

  @prop()
  public rewards!: Rewards;

  @prop()
  public initialEvidence?: string;

  @prop()
  public evidence?: string;
}

const Favour = getModelForClass(FavourSchema);

export default Favour;
