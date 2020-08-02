# encoding: utf-8

$:.unshift File.dirname(__FILE__)+"/../lib"


require 'net/https'
require 'brotli'
require 'json'
require 'erb'


def youtube_search(query)
  http = Net::HTTP.new("www.youtube.com", 443)
  http.use_ssl = true
  
  response = http.get("/results?search_query=#{ERB::Util.url_encode(query)}&pbj=1", {
    "Referer"=>"https://www.youtube.com/",
    "Cookie"=>"ST-1y37zs4=oq=%EB%B0%94%EB%82%98%EB%82%98%EC%9A%B0%EC%9C%A0%20%EB%A7%8C%EB%93%A4%EA%B8%B0&gs_l=youtube.3...5960.10591.0.10986.24.16.3.0.0.0.458.2840.0j1j4j1j3.9.0.ytnovav2hb%2Cytpo-bo-vo-i18n%3D0%2Cytpo-mns%3D0%2Cytpo-bo-vo-sb%3D1%2Cytposo-bo-vo-i18n%3D0%2Cytposo-mns%3D0%2Cytposo-bo-vo-sb%3D1...0...1ac.1j4.64.youtube..13.4.1071...0j0i433i131k1j0i433k1.0.PKj5Pr6qaVQ&itct=CBkQ7VAiEwiz54flsurqAhVFMmAKHX-iCpw%3D&csn=-jAdX7bdO82DigbHwbKADg; PREF=f4=4000000; GPS=1; VISITOR_INFO1_LIVE=zgXnTCLOkC0; YSC=5v7_vr-Zsr8",
    "User-Agent"=>"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15",
    "Host"=>"www.youtube.com",
    "Connection"=>"keep-alive",
    "Accept-Language"=>"ko-kr",
    "Accept"=>"*/*",
    "Accept-Encoding"=>"gzip, deflate, br",
    "X-SPF-Referer"=>"https://www.youtube.com/",
    "X-YouTube-Ad-Signals"=>"dt=1595748603824&flash=0&frm&u_tz=540&u_his=2&u_java=true&u_h=1120&u_w=1792&u_ah=1097&u_aw=1792&u_cd=24&u_nplug=1&u_nmime=3&bc=31&bih=1023&biw=1441&brdim=37%2C46%2C37%2C46%2C1792%2C23%2C1441%2C1061%2C1441%2C1023&vis=1&wgl=true&ca_type=image",
    "X-SPF-Previous"=>"https://www.youtube.com/",
    "X-YouTube-Utc-Offset"=>"540",
    "X-YouTube-Variants-Checksum"=>"73e5789339b2738655c073bc3e4fb9eb",
    "X-YouTube-Client-Name"=>"1",
    "X-YouTube-Time-Zone"=>"Asia/Seoul",
    "X-YouTube-Device"=>"cbr=Safari&cbrver=13.0.5&ceng=WebKit&cengver=605.1.15&cos=Macintosh&cosver=10_15_3",
    "X-YouTube-Page-CL"=>"322907731",
    "X-YouTube-STS"=>"18466",
    "X-YouTube-Client-Version"=>"2.20200724.05.01",
    "X-YouTube-Page-Label"=>"youtube.ytfe.desktop_20200723_5_RC1"
  })
  
  json = JSON.parse(Brotli.inflate(response.body))
  
  results = json[1]["response"]["contents"]["twoColumnSearchResultsRenderer"]["primaryContents"]["sectionListRenderer"]["contents"][0]["itemSectionRenderer"]["contents"]
  
  results.select {|e| e["videoRenderer"]}.map {|e|
    {
      "video_id"=>e["videoRenderer"]["videoId"],
      "title"=>e["videoRenderer"]["title"]["runs"][0]["text"],
      "thumbnail"=>e["videoRenderer"]["thumbnail"]["thumbnails"][0]["url"],
      "description"=>(e["videoRenderer"]["descriptionSnippet"] ? e["videoRenderer"]["descriptionSnippet"]["runs"].map {|c| c["text"]}.join : ""),
      "uploader_name"=>e["videoRenderer"]["longBylineText"]["runs"][0]["text"],
      "uploader_id"=>e["videoRenderer"]["longBylineText"]["runs"][0]["navigationEndpoint"]["browseEndpoint"]["browseId"]
    }
  }
end

def youtube_watch_next_videos(video_id)
  http = Net::HTTP.new("www.youtube.com", 443)
  http.use_ssl = true
  
  response = http.get("/watch?v=#{video_id}", {
    "Referer"=>"https://www.youtube.com/",
    "Cookie"=>"ST-1y37zs4=oq=%EB%B0%94%EB%82%98%EB%82%98%EC%9A%B0%EC%9C%A0%20%EB%A7%8C%EB%93%A4%EA%B8%B0&gs_l=youtube.3...5960.10591.0.10986.24.16.3.0.0.0.458.2840.0j1j4j1j3.9.0.ytnovav2hb%2Cytpo-bo-vo-i18n%3D0%2Cytpo-mns%3D0%2Cytpo-bo-vo-sb%3D1%2Cytposo-bo-vo-i18n%3D0%2Cytposo-mns%3D0%2Cytposo-bo-vo-sb%3D1...0...1ac.1j4.64.youtube..13.4.1071...0j0i433i131k1j0i433k1.0.PKj5Pr6qaVQ&itct=CBkQ7VAiEwiz54flsurqAhVFMmAKHX-iCpw%3D&csn=-jAdX7bdO82DigbHwbKADg; PREF=f4=4000000; GPS=1; VISITOR_INFO1_LIVE=zgXnTCLOkC0; YSC=5v7_vr-Zsr8",
    "User-Agent"=>"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15",
    "Host"=>"www.youtube.com",
    "Connection"=>"keep-alive",
    "Accept-Language"=>"ko-kr",
    "Accept"=>"*/*",
    "Accept-Encoding"=>"gzip, deflate, br",
    "X-SPF-Referer"=>"https://www.youtube.com/",
    "X-YouTube-Ad-Signals"=>"dt=1595748603824&flash=0&frm&u_tz=540&u_his=2&u_java=true&u_h=1120&u_w=1792&u_ah=1097&u_aw=1792&u_cd=24&u_nplug=1&u_nmime=3&bc=31&bih=1023&biw=1441&brdim=37%2C46%2C37%2C46%2C1792%2C23%2C1441%2C1061%2C1441%2C1023&vis=1&wgl=true&ca_type=image",
    "X-SPF-Previous"=>"https://www.youtube.com/",
    "X-YouTube-Utc-Offset"=>"540",
    "X-YouTube-Variants-Checksum"=>"73e5789339b2738655c073bc3e4fb9eb",
    "X-YouTube-Client-Name"=>"1",
    "X-YouTube-Time-Zone"=>"Asia/Seoul",
    "X-YouTube-Device"=>"cbr=Safari&cbrver=13.0.5&ceng=WebKit&cengver=605.1.15&cos=Macintosh&cosver=10_15_3",
    "X-YouTube-Page-CL"=>"322907731",
    "X-YouTube-STS"=>"18466",
    "X-YouTube-Client-Version"=>"2.20200724.05.01",
    "X-YouTube-Page-Label"=>"youtube.ytfe.desktop_20200723_5_RC1"
  })


  html = Brotli.inflate(response.body)

  if html =~ /window\["ytInitialData"\]\s=\s(\{.*\});\s\s\s\s\swindow\["ytInitialPlayerResponse"\]/m
    json = JSON.parse($1)
  else
    raise "파싱 실패. HTML 코드가 바꼈는지 직접 다시 확인할 것!"
  end
  
  
  
  results = json["contents"]["twoColumnWatchNextResults"]["secondaryResults"]["secondaryResults"]["results"]
  
  results.select {|e| e["compactAutoplayRenderer"] || e["compactVideoRenderer"]}.map {|e|
    e["compactAutoplayRenderer"] ? {
      "title"=>e["compactAutoplayRenderer"]["contents"][0]["compactVideoRenderer"]["title"]["simpleText"],
      "video_id"=>e["compactAutoplayRenderer"]["contents"][0]["compactVideoRenderer"]["videoId"],
      "thumbnail"=>e["compactAutoplayRenderer"]["contents"][0]["compactVideoRenderer"]["thumbnail"]["thumbnails"][0]["url"],
      "uploader_name"=>e["compactAutoplayRenderer"]["contents"][0]["compactVideoRenderer"]["longBylineText"]["runs"][0]["text"],
      "uploader_id"=>e["compactAutoplayRenderer"]["contents"][0]["compactVideoRenderer"]["longBylineText"]["runs"][0]["navigationEndpoint"]["browseEndpoint"]["browseId"]
    } : {
      "title"=>e["compactVideoRenderer"]["title"]["simpleText"],
      "video_id"=>e["compactVideoRenderer"]["videoId"],
      "thumbnail"=>e["compactVideoRenderer"]["thumbnail"]["thumbnails"][0]["url"],
      "uploader_name"=>e["compactVideoRenderer"]["longBylineText"]["runs"][0]["text"],
      "uploader_id"=>e["compactVideoRenderer"]["longBylineText"]["runs"][0]["navigationEndpoint"]["browseEndpoint"]["browseId"]
    }
  }
end