class Lesson < ApplicationRecord
  belongs_to :course

  validates :title, presence: true, length: { minimum: 3 }
  validates :status, inclusion: { in: %w[draft_published] }
end
