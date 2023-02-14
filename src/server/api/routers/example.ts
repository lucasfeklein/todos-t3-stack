import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  //Todos
  getTodos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id
      }
    });
  }),

  postTodo: protectedProcedure
    .input(z.object({ desc: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          desc: input.desc,
          userId: ctx.session.user.id
        }
      })
    }),

  updateTodo: protectedProcedure
    .input(z.object({ id: z.string(), checked: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id
        },
        data: {
          isChecked: input.checked
        }
      })
    }),

  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUniqueOrThrow({
        where: {
          id: input.id
        }
      })

      if (todo.userId !== ctx.session.user.id) {
        throw new Error("Unauthorized")
      }

      return ctx.prisma.todo.delete({
        where: {
          id: input.id
        }
      })
    })

});
