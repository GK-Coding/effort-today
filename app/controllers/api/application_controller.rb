require "clerk/authenticatable"

module Api
  class ApplicationController < ActionController::API
    include Clerk::Authenticatable

    # API-specific error handling
    rescue_from ActiveRecord::RecordNotFound do |exception|
      render json: { error: "Record not found" }, status: :not_found
    end

    rescue_from ActiveRecord::RecordInvalid do |exception|
      render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_entity
    end

    rescue_from ActionController::ParameterMissing do |exception|
      render json: { error: "Missing parameter: " + exception.param }, status: :bad_request
    end

    rescue_from JWT::DecodeError do |exception|
      render json: { error: "Invalid authentication token" }, status: :unauthorized
    end
  end
end
