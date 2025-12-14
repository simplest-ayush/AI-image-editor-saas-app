import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Polar } from "@polar-sh/sdk";
import {checkout, polar, portal, webhooks} from "@polar-sh/better-auth";
import { env } from "~/env";
import { db } from "~/server/db";

const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: 'sandbox'
});

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "c545ae84-627c-4b45-a094-bf6adf918d7d",
              slug: "small",
            },
            {
              productId: "558adbdf-2c33-4b31-a1fd-372ba5d46885",
              slug: "medium",
            },
            {
              productId: "74b48df5-5a46-4289-a036-69794f8ac4c0",
              slug: "large",
            }, 
          ],
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => { 
          console.log("POLAR webhook received:", JSON.stringify(order, null, 2));
          const externalCustomerId = order.data.customer.externalId;
          console.log("externalCustomerId: ", externalCustomerId);
          console.log("productId:", order.data.productId);

            if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;

            switch (productId) {
              case "c545ae84-627c-4b45-a094-bf6adf918d7d":
                creditsToAdd = 50;
                break;
              case "558adbdf-2c33-4b31-a1fd-372ba5d46885":
                creditsToAdd = 200;
                break;
              case "74b48df5-5a46-4289-a036-69794f8ac4c0":
                creditsToAdd = 500;
                break;
            }

            await db.user.update({
              where: { id: externalCustomerId },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });
          },
        }),
      ],
    }),
  ],
});