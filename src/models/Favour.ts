import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { EmbeddedUserSchema } from "./User";

export type Rewards = { [key: string]: number };

export interface FavourSchema extends Base {}

@modelOptions({ options: { customName: "Favour", allowMixed: Severity.ALLOW } })
export class FavourSchema extends TimeStamps {
  @prop()
  public creator!: EmbeddedUserSchema;

  @prop()
  public debtor!: EmbeddedUserSchema;

  @prop()
  public recipient!: EmbeddedUserSchema;

  @prop()
  public rewards!: Rewards;

  @prop()
  public initialEvidence?: string;

  @prop()
  public evidence?: string;
}

const Favour = getModelForClass(FavourSchema);

export default Favour;
