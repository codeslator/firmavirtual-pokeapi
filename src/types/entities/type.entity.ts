import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity({ name:  'types' })
export class Type {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  key: string;


  @Column({ type: 'varchar', length: 50 })
  name: string;
  
}
