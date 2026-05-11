Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # cadastrar um novo usuário no banco de dados
      post '/users', to: 'users#create'

      # realizar login de usuário
      post '/login', to: 'authentication#login'

      resources :courses do
        resources :lessons, only: [:index, :create, :update, :destroy]
      end
    end
  end
end
