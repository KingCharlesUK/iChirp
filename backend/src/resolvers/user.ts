import { Users } from '../entities/Users';
import { Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType, Query } from 'type-graphql';
import type { MyContext } from '../types'; 

@Resolver()
export class UserResolver {
    @Query(() => UserResolver, { nullable: true })
    async me(
        @Ctx() { em, req }: MyContext
    ) {
        if (!req.session.userId) return null;

        const user = await em.findOne(Users, req.session.userId);
        return user;
    }
}