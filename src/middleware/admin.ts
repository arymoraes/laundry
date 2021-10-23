import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { User, UserRole } from '../entities/User';
import errorHandler from '../utils/errorHandler';
import jwt from 'jsonwebtoken';

dotenv.config();

export interface AuthRequest extends Request {
    user?: any,
}

const adminAuthMiddleware = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(404).json({ error: 'Header does not exist' });

    const [, token] = authHeader.split(' ');

    const jwtCheck: any = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({where: {id: jwtCheck.id, role: UserRole.ADMIN}});
    
    if (!user) {
        return errorHandler(res, 401, 'Unauthorized');
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(`Server Error: ${error}`);
    res.status(500).json({ error });
  }
};

export default adminAuthMiddleware;