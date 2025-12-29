interface Task {
    task_id: number;
    user_id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    due_date: string | Date;
    is_completed: boolean;
    tags?: Tag[];
}