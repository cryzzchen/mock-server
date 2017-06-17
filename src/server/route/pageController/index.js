import docsRouter from './docs';
import swaggerRouter from './swagger';
import paramsRouter from './params';

const routers = [];
routers.push(docsRouter);
routers.push(swaggerRouter);
routers.push(paramsRouter);

export default routers;