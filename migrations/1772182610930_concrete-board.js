exports.up = (pgm) => {
    pgm.createType("priority", ["low", "medium", "high"]);
    pgm.createType("status", ["to_do", "in_progress", "completed"]);
    //зберігає інформацію про завдання на дошці
    pgm.createTable("concrete_board", {
        board_tasks_id: {type: "serial", primaryKey: true},
        user_id: {type: "integer", notNull: true, references: '"users"', onDelete: "CASCADE"},
        task_id: {type: "integer", notNull: true, references: '"tasks"', onDelete: "CASCADE"},
        tag: {type: "text", notNull: true, default: "personal"},
        priority: {type:"priority", notNull: true, default: "low"}, 
    });
};

exports.down = (pgm) => {
    pgm.dropTable("concrete_board");
    pgm.dropType("priority");
    pgm.dropType("status");
};