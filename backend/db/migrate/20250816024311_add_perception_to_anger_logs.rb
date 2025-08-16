class AddPerceptionToAngerLogs < ActiveRecord::Migration[7.1]
  def change
    add_column :anger_logs, :perception, :text
  end
end
