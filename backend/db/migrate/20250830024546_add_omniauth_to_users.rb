class AddOmniauthToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, provider. :string
    add_column :users, uid :string
    add_column :users, :google_image_url, :string
    
    add_index :users, [:provider, :uid], unique: true

    change_column_null :users, encrypted_password, true
    change_column_default :users, encrypted_password, nil
  end
end
