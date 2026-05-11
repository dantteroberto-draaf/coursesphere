class CreateLessons < ActiveRecord::Migration[8.1]
  def change
    create_table :lessons do |t|
      t.string :title
      t.string :status
      t.string :video_url
      t.references :course, null: false, foreign_key: true

      t.timestamps
    end
  end
end
