export const up = (pgm) => {
  pgm.createTable("boards", {
    id: "id",
    name: { type: "varchar(100)", notNull: true },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("boards");
};