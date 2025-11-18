class ApplicationController < ActionController::Base
  # CSRF protection is enabled by default with ActionController::Base
  # Skip CSRF for API requests (handled by Api::ApplicationController)

  rescue_from ActiveRecord::RecordNotFound do |exception|
    respond_to do |format|
      format.json { render json: { error: "Record not found" }, status: :not_found }
      format.html { render file: "#{Rails.root}/public/404.html", status: :not_found, layout: false }
    end
  end

  rescue_from ActiveRecord::RecordInvalid do |exception|
    respond_to do |format|
      format.json { render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_entity }
      format.html { render file: "#{Rails.root}/public/422.html", status: :unprocessable_entity, layout: false }
    end
  end
end
