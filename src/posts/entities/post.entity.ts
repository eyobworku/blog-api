import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { MaxLength } from 'class-validator';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @MaxLength(255, { message: 'Title must be shorter than 255 characters' })
  title: string;

  @Column({ type: 'text' })
  @MaxLength(1000, { message: 'Content must be shorter than 1000 characters' })
  content: string;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
