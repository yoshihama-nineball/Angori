class CreateContactMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :contact_messages do |t|
      t.references :user, null: true, foreign_key: true
      t.string :email, null: false
      t.string :name, null: false
      t.string :category
      t.string :subject, null: false
      t.text :message, null: false
      t.string :status, default: 'open', null: false
      t.text :admin_reply
      t.timestamp :replied_at
      t.timestamps
    end
    add_index :contact_messages, :status
    add_index :contact_messages, :category
  end
end
