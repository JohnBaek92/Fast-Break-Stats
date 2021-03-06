require 'json'
require 'CSV'
require 'byebug'

def transform_player_adv(row)
  row = row.to_hash
  new_row = {}
  # Extract player ID
  new_row["playerId"] = row["Player"].split("\\")[1]
  new_row["name"] = row["Player"].split("\\")[0]
  new_row["age"] = row["Age"].to_i
  new_row["team"] = row["Tm"]
  # Only take primary position
  new_row["position"] = row["Pos"].split("-")[0]
  new_row["minutes"] = row["MP"].to_i
  new_row["threeRate"] = row["3PAr"].to_f
  new_row["ts%"] = row["TS%"].to_f
  new_row["oRb%"] = row["ORB%"].to_f
  new_row["dRb%"] = row["DRB%"].to_f
  new_row["tRb%"] = row["TRB%"].to_f
  new_row["ast%"] = row["AST%"].to_f
  new_row["stl%"] = row["STL%"].to_f
  new_row["blk%"] = row["BLK%"].to_f
  new_row["tov%"] = row["TOV%"].to_f
  new_row["usg%"] = row["USG%"].to_f
  new_row["obpm"] = row["OBPM"].to_f
  new_row["dbpm"] = row["DBPM"].to_f
  new_row["bpm"] = row["BPM"].to_f
  new_row
end

def transform_player_pg(row)
  row = row.to_hash
  new_row = {}
  new_row["playerId"] = row["Player"].split("\\")[1]
  new_row["games"] = row["G"].to_i
  new_row["fg%"] = row["FG%"].to_f
  new_row["three%"] = row["3P%"].to_f
  new_row["ft%"] = row["FT%"].to_f
  new_row["orbPg"] = row["ORB"].to_f
  new_row["drbPg"] = row["DRB"].to_f
  new_row["trbPg"] = row["TRB"].to_f
  new_row["astPg"] = row["AST"].to_f
  new_row["stlPg"] = row["STL"].to_f
  new_row["blkPg"] = row["BLK"].to_f
  new_row["tovPg"] = row["TOV"].to_f
  new_row["ptsPg"] = row["PS/G"].to_f
  new_row
end


def jsonify(years)
  data = [] 

  years.each do |year|
    players = {}
    ['ADV', 'PG'].each do |type|
      File.open("./data/csv/#{year}_#{type}.csv", 'r') do |file|
        csv = CSV.new(file, headers: true)
        csv.to_a.each do |row|
          if type == 'ADV'
            data = transform_player_adv(row)
            players[data["playerId"]] = data.merge({season: year})
          else
            data = transform_player_pg(row)
            players[data["playerId"]] = players[data["playerId"]].merge(data)
          end
        end
      end
    end
    data = players.values
  end

  data.to_json
end

File.open('./data/json/2010.json', 'w') do |f|
  f.puts(jsonify((2010..2010).to_a))
end