export type AddTaskDTO = {
    title: string;
    description: string;
}

export type DeleteTaskDTO = {
    task_id: BigInt;
}


export type UpdateTaskTitleDTO = {
    task_id: BigInt;
    title: string;
}

export type UpdateTaskDescriptionDTO = {
    task_id: BigInt;
    description: string;
}

export type UpdateTaskDedlineDTO = {
    task_id: BigInt;
    due_date: string;
}

export type UpdateTaskPriorityDTO = {
    task_id: BigInt;
    priority: string;
}


export type GetTaskByTitleDTO = {
    title: string;
}

export type GetTaskByPriorityDTO = {
    priority: string;
}

