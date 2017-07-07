import docsRouter from './docs';
import swaggerRouter from './swagger';
import paramsRouter from './params';
import userRouter from './user';

const routers = [];
routers.push(docsRouter);
routers.push(swaggerRouter);
routers.push(paramsRouter);
routers.push(userRouter);

export default routers;