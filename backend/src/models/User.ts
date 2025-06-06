import { compare, hash } from "bcryptjs";
import {
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import Queue from "./Queue";
import Ticket from "./Ticket";
import UserQueue from "./UserQueue";
import UserWhatsapp from "./UserWhatsapp";
import Whatsapp from "./Whatsapp";

@Table
class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  email: string;

  @Column(DataType.VIRTUAL)
  password: string;

  @Column
  passwordHash: string;

  @Default("admin")
  @Column
  profile: string;

  @Default(true)
  @Column
  active: boolean;

  @Default(false)
  @Column
  online: boolean;

  @Default(false)
  @Column
  isTricked: boolean;

  @Default(0)
  @Column
  tokenVersion: number;

  @Default("00:00")
  @Column
  startWork: string;

  @Default("23:59")
  @Column
  endWork: string;

  @Column(DataType.STRING)
  passwordResetToken: string | null;

  @Column(DataType.DATE)
  passwordResetExpires: Date | null;

  @Column(DataType.STRING)
  currentSessionId: string;

  @Column(DataType.DATE)
  lastLoginAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Ticket)
  tickets: Ticket[];

  @BelongsToMany(() => Queue, () => UserQueue)
  queues: Queue[];

  @BelongsToMany(() => Whatsapp, () => UserWhatsapp)
  whatsapps: Whatsapp[];

  @BeforeUpdate
  @BeforeCreate
  static hashPassword = async (instance: User): Promise<void> => {
    if (instance.password) {
      instance.passwordHash = await hash(instance.password, 8);
    }
  };

  public checkPassword = async (password: string): Promise<boolean> => {
    return compare(password, this.passwordHash);
  };
}

export default User;