import { Response, Request } from 'express';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import errorHandler from '../utils/errorHandler';
import { User, UserRole } from '../entities/User';
import { AuthRequest } from '../middleware/admin';

dotenv.config();

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const {
            username, email, password
        } = req.body;

        if (!email || !username || !password || typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string') {
            return errorHandler(res, 400, 'Missing or incorrect parameters');
        }

        if (password.length < 7 || password.length > 16) {
            return errorHandler(res, 400, 'Password should be between 8 and 16 characters');
        }

        const userExists = await User.findOne({ where: { username, email } });

        if (userExists) {
            return errorHandler(res, 400, 'Username or Email already exists');
        }

        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
                return errorHandler(res, 401, 'There was some error with your password. Please, try again');
            }

            const user = User.create({
                username,
                email,
                password: hashedPassword,
                isActive: true,
                role: UserRole.ADMIN
            });
            await user.save();

            // // Either way
            // const user: any = await getConnection()
            // .createQueryBuilder()
            // .insert()
            // .into(User)
            // .values([
            //   {
            //     username,
            //     email,
            //     password: hashedPassword,
            //     gender,
            //     resetPassword: null,
            //     isActive: true,
            //   },
            // ])
            // .execute();

            return res.status(200).json({
                user: {
                    username,
                    email,
                    role: user.role,
                }
            });
        });

    } catch (error) {
        return errorHandler(res, 500, 'Server error');
    }
}

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({where: {username: username, role: UserRole.ADMIN}});

        if (!user) return errorHandler(res, 401, 'Unauthorized.');

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return errorHandler(res, 401, 'Invalid password');

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: 1000 * 60 * 60 * 24 * 7,
        });

        return res.status(200).json({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
                user: user.role,
            },
            token,
        })

    } catch (error) {
        return errorHandler(res, 500, 'Server error');
    }
}

export const adminProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { user } = req;

        // Just refreshes the duration of the token
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: 1000 * 60 * 60 * 24 * 7,
        });

        return res.status(200).json({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role,
            },
            token,
        })

    } catch (error) {
        return errorHandler(res, 500, 'Server error');
    }
}