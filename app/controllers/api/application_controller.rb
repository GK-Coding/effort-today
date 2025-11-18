require "clerk/authenticatable"

module Api
  class ApplicationController < ::ApplicationController
    include Clerk::Authenticatable

    # API-specific error handling (inherits main ones, adds more)
    rescue_from ActionController::ParameterMissing do |exception|
      render json: { error: "Missing parameter: " + exception.param }, status: :bad_request
    end

    rescue_from JWT::DecodeError do |exception|
      render json: { error: "Invalid authentication token" }, status: :unauthorized
    end
  end
end
