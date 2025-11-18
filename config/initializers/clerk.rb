begin
  require "clerk"
rescue LoadError => e
  Rails.logger.error "Clerk SDK not loaded: #{e.message}. Run bundle install?"
  raise e
end

# Configure only if secret key present
if ENV["CLERK_SECRET_KEY"].present?
  Clerk.configure do |config|
    config.secret_key = ENV["CLERK_SECRET_KEY"]
  end

else
  Rails.logger.warn "No CLERK_SECRET_KEY—auth disabled (dev mode?)"
end
