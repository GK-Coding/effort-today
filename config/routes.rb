Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    resources :tasks, only: [ :index, :create, :update ]
  end

  # Frontend routes - serve React app
  root "home#index"

  # Catch-all route for React Router client-side routing
  get "*path", to: "home#index", constraints: ->(request) { !request.path.start_with?("/api") }
end
