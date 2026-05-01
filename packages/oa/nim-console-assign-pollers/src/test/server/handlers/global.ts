export const globalHandlers = [
   /**
    * Set up your mock handlers here.
    * These are provided for example only.
    * For more information, check out @mswjs library.
    *
    * 🚨 Make sure to mock your server as close to reality as possible, this will save you a lot of time down the track.
    */
   // rest.post(routes.TEST_CONNECTION, (_, res, ctx) => {
   //    return res(
   //       ctx.status(200),
   //       ctx.json({
   //          networks: db.network.getAll(),
   //          organisations: db.organisation.getAll(),
   //       })
   //    );
   // }),
   // rest.get(routes.GET_GLOBAL_CONFIG, (_, res, ctx) => {
   //    const response: APIGlobalSchema = {
   //       ...db.config.getAll()[0],
   //       organisations: db.organisation.getAll() as Organisation[],
   //       networks: db.network.getAll() as Network[],
   //    };
   //    return res(ctx.status(200), ctx.json(response));
   // }),
   // rest.post(routes.UPDATE_GLOBAL_CONFIG, async (req, res, ctx) => {
   //    try {
   //       const data = await req.json();
   //       await db.config.update({
   //          where: { id: { equals: 1 } },
   //          data,
   //       });
   //       return res(ctx.status(200), ctx.json(db.config.getAll()[0]));
   //    }
   //    catch (e) {
   //       return res(
   //          ctx.status(400),
   //          ctx.json({
   //             error: 'Something went wrong when trying to update the mock database with a new config',
   //          })
   //       );
   //    }
   // }),
];

/**
 * Failed handlers
 * Very useful for testing, since you can quickly replace existing handlers with fail calls to test your code
 *
 * `server.use(...failedHandlers);`
 */
export const failedHandlers = [
   // rest.post(routes.TEST_CONNECTION, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
   // rest.get(routes.GET_GLOBAL_CONFIG, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
   // rest.post(routes.UPDATE_GLOBAL_CONFIG, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
   // rest.post(routes.GET_ORGANISATIONS, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
   // rest.post(routes.GET_NETWORKS, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
];
