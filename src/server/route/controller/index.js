import docsRouter from './docs';
import paramsRouter from './params';
import userRouter from './user';

const routers = [];
routers.push(docsRouter);
routers.push(paramsRouter);
routers.push(userRouter);

export default routers;