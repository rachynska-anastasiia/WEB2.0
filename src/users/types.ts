export type AddUserDTO = {
    name: string;
    email: string;
}

export type DeleteUserDTO = {
    id: number;
}

export type UpdateUserNameDTO = {
    id: number;
    name: string;
}

export type UpdateUserEmailDTO = {
    id: number;
    email: string;
}

export type GetUserByEmailDTO = {
    email: string;
}