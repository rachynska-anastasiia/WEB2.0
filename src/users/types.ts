export type AddUserDTO = {
    name: string;
    email: string;
}

export type DeleteUserDTO = {
    userId: number;
}

export type UpdateUserNameDTO = {
    //userId: number;
    name: string;
}

export type UpdateUserEmailDTO = {
    //userId: number;
    email: string;
}

export type GetUserByEmailDTO = {
    email: string;
}