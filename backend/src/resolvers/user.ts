import { Users } from '../entities/Users';
import { Resolver, Ctx, Query, Mutation, ObjectType, Field, Arg, InputType } from 'type-graphql';
import type { MyContext } from '../types'; 
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Users, { nullable: true })
    user?: Users;
}

@Resolver()
export class UserResolver {
    // get the user object from the session
    @Query(() => UserResolver, { nullable: true })
    async me(
        @Ctx() { em, req }: MyContext
    ) {
        if (!req.session.userId) return null;

        const user = await em.findOne(Users, req.session.userId);
        return user;
    }

    // register a new user
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 4) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Username must be at least 4 characters"
                    }
                ]
            }
        }
        if (options.password.length <= 5) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Password must be at least 5 characters"
                    }
                ]
            }
        }

        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(Users, {
            username: options.username,
            password: hashedPassword
        });
        await em.persistAndFlush(user);

        return { user };
    }

    // login a user
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(Users, { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "That username doesn't exist"
                    }
                ]
            }
        }

        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password"
                    }
                ]
            }
        }

        req.session.userId = user.id;

        return { user };
    }
}