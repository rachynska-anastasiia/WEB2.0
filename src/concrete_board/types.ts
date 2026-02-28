export type AddTaskToBoardDTO = {
    user_id: BigInt;
    task_id: BigInt;
}

export type GetTaskOnBoardByTagDTO = {
    tag: string;
}

export type GetTaskOnBoardByStatusDTO = {
    status: string;
}

export type UpdateTaskTagOnBoardDTO = {
    board_tasks_id: BigInt;
    tag: string;
}

export type UpdateTaskStatusOnBoardDTO = {
    board_tasks_id: BigInt;
    status: string;
}

export type DeleteTakOnBoardDTO = {
    board_tasks_id: BigInt;
}
