import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ unique: true })
  username!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  headline?: string;

  @Column({ nullable: true })
  skills?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  socialLinks?: { platform: string; url: string }[];

  @Column()
  isVerified!: boolean;

  @Column()
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
