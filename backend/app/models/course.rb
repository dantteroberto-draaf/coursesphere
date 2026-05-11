class Course < ApplicationRecord
  belongs_to :user

  has_many :lessons, dependent: :destroy

  validates :name, presence: true, length: { minimum: 3 }
  validates :start_date, presence: true
  validates :end_date, presence: true
  validate :end_date_must_be_after_start_date

  private

  def end_date_must_be_after_start_date
    if start_date.present && end_date.present && end_date < start_date
      errors.add(:end_date, "deve ser igual ou posterior à data de início")
    end
  end
end
