import { TableNames } from "../../helpers/TableNames";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export type UserData = {
  id?: number;
  username: string;
  email: string;
  password: string;
  role_id?: number;
  created_at?: Date;
  updated_at?: Date;
};

export interface UserDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.User;
  updatePassword: (
    newPassword: string,
    emailCookie: string
  ) => Promise<UserData>;
  updateRole: (userId: number, roleId: number) => Promise<UserData>;
  update(data: UserData, email: string): Promise<UserData>;
}
