import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { MemberWhereUniqueInput } from "../../../inputs/MemberWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteMemberArgs {
  @TypeGraphQL.Field(_type => MemberWhereUniqueInput, { nullable: false })
  where!: MemberWhereUniqueInput;
}
