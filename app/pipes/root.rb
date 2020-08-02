namespace 'root'

pipe :index do

  render
end

pipe :about do

  render
end

pipe :list do
  data = DB.searches.all(select: "query", order: "searched_at ASC", limit: 30).map {|s| s.query}

  render data.to_json, format: "json"
end

pipe :query do
  search = DB.searches.first(where: ["query=?", params[:ip]])
  
  if search.nil?
    results = youtube_search(params[:ip])
  
    data = results[0..(params[:rt].to_i-1)].map {|e|
      videos = youtube_watch_next_videos(e["video_id"])
      
      videos[0..(params[:rn].to_i-1)].map {|e2| {"title"=>e2["title"], "description"=>"", "category"=>"", "link"=>"https://www.youtube.com/watch?v=#{e2["video_id"]}"}}
    }
    
    DB.searches.insert(query: params[:ip], data: data.to_json, searched_at: DateTime.now)
    
    search = DB.searches.first(where: ["id=?", DB.insert_id])
  end
  
  render search.data.to_json, format: "json"
end