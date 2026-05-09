class Api::V1::UsersController < ApplicationController
    def create
        user = User.new(user_params)

        if user.save
            # Se salvou no banco, gera o token guardando o ID do usuário dentro dele
            token = encode_token({user_id: user.id})
            render json: { user: user, token: token }, status: :created
        else
            # Se falhou (ex: email repetido), devolve o erro
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def user_params
        params.require(:user).permit(:name, :email, :password)
    end
end
