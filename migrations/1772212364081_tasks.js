exports.up = (pgm) => {
    pgm.createType("priority", ["low", "medium", "high"]);
    pgm.createTable("tasks", {
        task_id: {type: "serial", primaryKey: true},
        title: {type: "text", notNull: true},
        description: {type: "text"},
        due_date: {type: "timestamp"},
        priority: {type:"priority", notNull: true, default: "low"},
        //created_at: {type: "timestamp", notNull: true, default: pgm.func("now()")},
        //updated_at: {type: "timestamp", notNull: true, default: pgm.func("now()")},
    });
};

exports.down = (pgm) => {
    pgm.dropTable("tasks");
    pgm.dropType("priority");
};