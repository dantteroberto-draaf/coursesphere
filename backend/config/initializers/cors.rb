Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "*" # Em produção, trocaríamos o "*" pela URL real do site no Vercel/Netlify

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end