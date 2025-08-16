ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.

# 🚫 Disable Bootsnap to avoid FrozenError in Ruby 3.2+
ENV['DISABLE_BOOTSNAP'] = 'true'
# require 'bootsnap/setup' # ← コメントアウト
