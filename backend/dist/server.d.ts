import { Pool } from 'pg';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
declare const pool: Pool;
declare const app: import("express-serve-static-core").Express;
export { app, pool };
//# sourceMappingURL=server.d.ts.map