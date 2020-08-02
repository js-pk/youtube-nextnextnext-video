table 'searches' do

  column :id, :integer, type: "int unsigned", primary_key: true, auto_increment: true

  column :query, :string, type: "char(200)"
  column :data, :json
  column :searched_at, :datetime, default: '1900-01-01 00:00:00'

  index [:query], name: "query"
  index [:searched_at], name: "searched_at"
end
