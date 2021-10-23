import {
    Entity, PrimaryGeneratedColumn, Column, BaseEntity,
} from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user'
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    username: string;

    @Column()
    password: string;

    @Column({
        nullable: true,
    })
    resetPassword: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    isActive: boolean;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole
}