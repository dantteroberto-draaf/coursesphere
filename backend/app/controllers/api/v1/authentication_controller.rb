class Api::V1::AuthenticationController < ApplicationController
    def login
        user = User.find_by(email: params[:email])

        if user && user.authenticate(params[:password])
            token = encode_token({ user_id: user.id })
            render json: { user: user, token: token }, status: :ok
        else
            render json: { error: 'Email ou senha inválidos' }, status: :unauthorized
        end
    end
end
