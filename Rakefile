require 'rake'

$:.unshift("../aio/lib")

require 'aio'
require 'yaml'

namespace :db do
  task :aio_start do
    Aio.connect_to_db
  end

  desc "Migrates the database to the current version"
  task :migrate => :aio_start do
    DB.migrate!
  end
end
