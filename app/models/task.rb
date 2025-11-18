class Task < ApplicationRecord
  belongs_to :parent, class_name: "Task", optional: true
  has_many :subtasks, class_name: "Task", foreign_key: :parent_id

  validates :description, presence: true
  validates :user_id, presence: true
  validates :state, inclusion: { in: 0..2 }
  validates :pain, inclusion: { in: 0..10 }
  validates :desire, inclusion: { in: 0..10 }

  def salience
    (pain ** 2) + desire
  end
end

