export interface UserJwtPayload {
  first_name?: string;
  last_name?: string;
  email: string;
  password?: string;
  master_pin?: number;
}
