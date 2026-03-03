export interface Board {
  id: number;
  name: string;
  user_id: number;
  created_at: Date;
}

export interface CreateBoardDto {
  name: string;
  user_id: number;
}

export interface UpdateBoardDto {
  name?: string;
}