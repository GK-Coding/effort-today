class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.text :description, null: false
      t.integer :parent_id
      t.datetime :deadline
      t.integer :state, default: 0, null: false
      t.integer :pain, default: 0, null: false
      t.integer :desire, default: 0, null: false
      t.boolean :is_stuck, default: false, null: false
      t.integer :deferred_count, default: 0, null: false
      t.string :user_id, null: false

      t.timestamps
    end

    add_foreign_key :tasks, :tasks, column: :parent_id
    add_index :tasks, :user_id
    add_index :tasks, :parent_id
    add_index :tasks, :state
  end
end
