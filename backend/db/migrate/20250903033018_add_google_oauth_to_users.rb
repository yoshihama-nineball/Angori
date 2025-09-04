class AddGoogleOauthToUsers < ActiveRecord::Migration[7.1]
  def up
    add_column :users, :provider, :string
    add_column :users, :uid, :string
    add_column :users, :google_image_url, :string
    
    add_index :users, [:provider, :uid], unique: true
    
    # encrypted_passwordをnull許可に変更
    change_column_null :users, :encrypted_password, true
  end
  
  def down
    remove_index :users, [:provider, :uid] if index_exists?(:users, [:provider, :uid])
    remove_column :users, :google_image_url if column_exists?(:users, :google_image_url)
    remove_column :users, :uid if column_exists?(:users, :uid)
    remove_column :users, :provider if column_exists?(:users, :provider)
    
    change_column_null :users, :encrypted_password, false
  end
end