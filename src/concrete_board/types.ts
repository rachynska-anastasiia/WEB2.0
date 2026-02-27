export type AddTaskToBoardDTO = {
    user_id: BigInt;
    task_id: BigInt;
}

export type GetTaskOnBoardByTagDTO = {
    tag: string;
}

export type GetTaskOnBoardByPriorityDTO = {
    priority: string;
}

export type UpdateTaskTagOnBoardDTO = {
    board_tasks_id: BigInt;
    tag: string;
}

export type UpdateTaskPriorityOnBoardDTO = {
    board_tasks_id: BigInt;
    priority: string;
}

export type DeleteTakOnBoardDTO = {
    board_tasks_id: BigInt;
}
