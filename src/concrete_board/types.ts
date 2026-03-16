export type AddTaskToBoardDTO = {
    task_id: number;
}

export type GetTaskOnBoardByTagDTO = {
    tag: string;
}

export type GetTaskOnBoardByStatusDTO = {
    status: string;
}

export type UpdateTaskTagOnBoardDTO = {
    board_tasks_id: number;
    tag: string;
}

export type UpdateTaskStatusOnBoardDTO = {
    board_tasks_id: number;
    status: string;
}

export type DeleteTakOnBoardDTO = {
    board_tasks_id: number;
}
