layout nil

namespace('root')

match('/', :get) do

  pipe(:index)
end

match('/about', :get) do

  pipe(:about)
end

match('/list', :get) do

  pipe(:list)
end

match('/query', :get) do

  pipe(:query)
end
