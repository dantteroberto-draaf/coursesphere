class ApplicationController < ActionController::API
    # Chave secreta única do seu projeto Rails para assinar o token
    SECRET_KEY = Rails.application.secret_key_base
    
    # função para gerar o token
    def encode_token(payload)
        JWT.encode(payload, SECRET_KEY)
    end

    # função para ler o token
    def decoded_token
        auth_header = request.headers['Authorization']
        if auth_header
        # O padrão é enviar "Bearer <token>", então quebramos a string para pegar só o token
        token = auth_header.split(' ')[1]
            begin
            JWT.decode(token, SECRET_KEY, true, algorithm: 'HS256')
        rescue JWT::DecodeError
            nil
            end
        end
    end

    # função para descobrir quem é o usuário logado no momento
  def current_user
    if decoded_token
      user_id = decoded_token[0]['user_id']
      @current_user = User.find_by(id: user_id)
    end
  end

  # função que barra quem tentar acessar rotas protegidas sem token
  def authorized
    render json: { message: 'Por favor, faça login' }, status: :unauthorized unless current_user
  end
end