class Api::V1::LessonsController < ApplicationController
  before_action :authorized
  before_action :set_course

  before_action :set_lesson, only: [:update, :destroy]
  before_action :authorize_creator! # só o criador do curso pode mexer na lição

  def index
    render json: @course.lessons
  end

  def create
    lesson = @course.lessons.build(lesson_params)

    if course.save
      render json: course, status: :created
    else
      render json: { errors: course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @lesson.update(lesson_params)
      render json: @lesson
    else
      render json: { errors: @lesson.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @lesson.destroy
    head :no_content
  end

  private

  def set_course
    @course = Course.find(params[:course_id])
  end

  def set_lesson
    @lesson = @course.lessons.find(params[:id])
  end

  def authorize_creator!
    unless @course.user_id == @current_user.id
      render json: { error: 'Apenas o criador do curso pode gerenciar aulas' }, status: :forbidden
    end
  end

  def lesson_params
    params.require(:lesson).permit(:title, :status, :video_url)
  end
end
