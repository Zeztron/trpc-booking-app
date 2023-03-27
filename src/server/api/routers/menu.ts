import { s3 } from '~/lib/s3';
import { publicProcedure, createTRPCRouter } from '../trpc';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const menuRouter = createTRPCRouter({
  getMenuItems: publicProcedure.query(async ({ ctx }) => {
    const menuItems = await ctx.prisma.menuItem.findMany();

    const withUrls = await Promise.all(
      menuItems.map(async (menuItem) => ({
        ...menuItem,
        url: await s3.getSignedUrlPromise('getObject', {
          Bucket: 'restaurant-booking',
          Key: menuItem.imageKey,
        }),
      }))
    );

    return withUrls;
  }),

  checkMenuStatus: publicProcedure.mutation(async () => {
    await sleep(1000);

    return { success: true };
  }),
});
