import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Users {

    [OptionalProps]?: 0 | 'createdAt' | 'updatedAt';

    @Field()
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({ type: 'date' })
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({ type: 'string', unique: true })
    username!: string;

    @Property({ type: 'string'})
    password!: string;
}