class AddOmniauthToUsers < ActiveRecord::Migration[7.1]
  def change
<<<<<<< HEAD
=======
    add_column :users, provider. :string
    add_column :users, uid :string
    add_column :users, :google_image_url, :string
    
    add_index :users, [:provider, :uid], unique: true

    change_column_null :users, encrypted_password, true
    change_column_default :users, encrypted_password, nil
>>>>>>> 2fd5dc7362c03e10a15bf22e28e33935e0a9c803
  end
end
