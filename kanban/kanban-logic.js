// Пример структуры данных задачи
let tasks = [
    {
        id: 1,
        title: "Подготовить отчет для клиента X",
        description: "Собрать аналитику за май",
        assignee: "emp1",
        priority: "priority-high",
        status: "backlog",
        timeStarted: null,
        timeToReview: null,
        reportData: null // Сюда упадут ссылки и резюме
    }
];

// Функция старта работы
function takeIntoWork(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.status = "in-progress";
    task.timeStarted = new Date(); // Фиксируем время начала
    renderBoard();
}

// Защита: Переход на проверку только через отчет
function moveToReview(taskId) {
    // Открываем HTML модалку (report-modal)
    document.getElementById('report-modal').style.display = 'block';
    
    // При сохранении отчета:
    document.getElementById('submit-review').onclick = function() {
        const task = tasks.find(t => t.id === taskId);
        task.status = "review";
        task.timeToReview = new Date(); // Фиксируем время сдачи
        
        // Считаем затраченное время
        const timeDiff = Math.abs(task.timeToReview - task.timeStarted);
        const hoursSpent = Math.ceil(timeDiff / (1000 * 60 * 60));
        console.log(`Затрачено времени: ${hoursSpent} ч.`);
        
        document.getElementById('report-modal').style.display = 'none';
        renderBoard();
    };
}

// Руководитель принимает или отклоняет задачу
function reviewTask(taskId, isAccepted, comment = "") {
    const task = tasks.find(t => t.id === taskId);
    if (isAccepted) {
        task.status = "done";
        // Карточка окрасится в зеленый благодаря классу .task-done
    } else {
        task.status = "in-progress";
        task.comments = comment; // Возврат в работу с комментарием
    }
    renderBoard();
}
