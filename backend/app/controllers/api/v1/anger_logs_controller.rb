module Api
  module V1
    class AngerLogsController < ApplicationController
      include AngerLogsConcern
      before_action :set_anger_log, only: %i[show update destroy]

      # GET /api/v1/anger_logs
      def index
        @anger_logs = fetch_paginated_anger_logs(search_params[:search])
        render json: anger_logs_index_response
      end

      # GET /api/v1/anger_logs/:id
      def show
        render json: anger_log_json(@anger_log)
      end

      # POST /api/v1/anger_logs
      def create
        return render_validation_error unless create_params_valid?

        @anger_log = build_anger_log_with_ai_advice

        if @anger_log.save
          render json: anger_log_json(@anger_log), status: :created
        else
          render_creation_error
        end
      rescue StandardError => e
        handle_server_error(e, 'AngerLog creation failed')
      end

      # PUT/PATCH /api/v1/anger_logs/:id
      def update
        if @anger_log.update(update_anger_log_params)
          render json: anger_log_json(@anger_log)
        else
          render_update_error
        end
      end

      # DELETE /api/v1/anger_logs/:id
      def destroy
        @anger_log.destroy!
        render json: { message: 'Anger log deleted successfully' }, status: :ok
      rescue StandardError => e
        handle_server_error(e, 'AngerLog deletion failed')
      end
    end
  end
end
