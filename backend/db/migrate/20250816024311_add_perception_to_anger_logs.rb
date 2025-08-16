class AddPerceptionToAngerLogs < ActiveRecord::Migration[7.1]
  def change
    # カラムが存在しない場合のみ追加
    unless column_exists?(:anger_logs, :perception)
      add_column :anger_logs, :perception, :text
    end
  end
end