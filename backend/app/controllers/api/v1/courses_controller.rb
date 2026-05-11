class Api::V1::CoursesController < ApplicationController
  before_action :authorized # exige o token jwt
  before_action :set_course, only:[:show, :update, :destroy]

  def index
    render json: Course.all
  end

  def show
    # inclui as aulas automaticamente no json do curso
    render json: @course.as_json(include: :lessons)
  end

  def create
    course = @current_user.courses.build(course_params)
    if course.save
      render json: course, status: :created
    else
      render json: { errors: course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @course.user_id != @current_user.id
      render json: { "error": "Apenas o criador pode editar este recurso" }, status: :forbidden
    elsif @course.update(course_params)
      render json: @course
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @course.user_id != @current_user.id
      render json: { error: 'Apenas o criador pode excluir este curso' }, status: :forbidden
    else
      @course.destroy
      head :no_content
    end
  end

  private

  def set_course
    @course = Course.find(params[:id])
  end

  def course_params
    params.require(:course).permit(:name, :description, :start_date, :end_date)
  end
end
