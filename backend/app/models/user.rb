class User < ApplicationRecord
    has_many :courses, dependent: :destroy
    has_secure_password # habilita a criptografia da senha usando a gem bcrypt
                        # e já exige que a senha seja preenchida na hora de criar o usuário.

    # validações
    validates :name, presence: true
    validates :email, presence: true, uniqueness: true
end
