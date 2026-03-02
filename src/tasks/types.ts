export type AddTaskDTO = {
    title: string;
    description: string;
}

export type DeleteTaskDTO = {
    task_id: number;
}


export type UpdateTaskTitleDTO = {
    task_id: number;
    title: string;
}

export type UpdateTaskDescriptionDTO = {
    task_id: number;
    description: string;
}

export type UpdateTaskDedlineDTO = {
    task_id: number;
    due_date: string;
}

export type UpdateTaskPriorityDTO = {
    task_id: number;
    priority: string;
}


export type GetTaskByTitleDTO = {
    title: string;
}

export type GetTaskByPriorityDTO = {
    priority: string;
}

