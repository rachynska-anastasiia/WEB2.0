exports.up = (pgm) => {
    pgm.createTable("jobs", {
        id: 'id',
        user_id: {type: "integer", notNull: true, references: '"users"', onDelete: "CASCADE"},
        title: { type: "text", notNull: true },
        status: {type: 'varchar(20)', notNull: true, default:'CREATED', check: "status IN ('CREATED', 'PROCESSING', 'DONE', 'ERROR')"},
        idempotency_key: { type: 'varchar(255)', notNull: true },
        result: { type: 'text' },
        error: { type: 'text' },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp'), },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp'),
        },
    });
    pgm.addConstraint('jobs', 'unique_user', {unique: ['user_id', 'idempotency_key']});
    pgm.createIndex('jobs', 'user_id')
};

exports.down = (pgm) => {
    pgm.dropTable("jobs");
};